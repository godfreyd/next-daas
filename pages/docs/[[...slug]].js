import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import Head from 'next/head';
import matter from 'gray-matter';
import { SITE_URL } from '../../src/lib/constants';
import hashMap from '../../src/lib/docs/hash-map.json';
import { getSlug, removeFromLast, addTagToSlug } from '../../src/lib/docs/utils';
import { getPaths, getCurrentTag, findRouteByPath, fetchDocsManifest } from '../../src/lib/docs/page';
import { getRawFileFromRepo } from '../../src/lib/github/raw';
import markdownToHtml from '../../src/lib/docs/markdown-to-html';
import getRouteContext from '../../src/lib/get-route-context';


import PageContent from '../../src/components/page-content';
import Container from '../../src/components/container';
import DocsPage from '../../src/components/docs/docs-page';
import { Sidebar, Post, Category, Heading } from '../../src/components/sidebar';
import Page from '../../src/components/page';
import { useIsMobile } from '../../src/components/media-query';
import FeedbackContext from '../../src/components/feedback-context';
import Skeleton from '../../src/components/skeleton';

function getCategoryPath(routes) {
  const route = routes.find(r => r.path);
  return route && removeFromLast(route.path, '/');
}

function SidebarRoutes({ isMobile, routes: currentRoutes, level = 1 }) {
  const { query } = useRouter();
  const { tag, slug } = getSlug(query);

  return currentRoutes.map(({ path, title, routes, heading, open }) => {
    if (routes) {
      const pathname = getCategoryPath(routes);
      const selected = slug.startsWith(pathname);
      const opened = selected || isMobile ? false : open;

      if (heading) {
        return (
          <Heading key={pathname} title={title}>
            <SidebarRoutes isMobile={isMobile} routes={routes} level={level + 1} />
          </Heading>
        );
      }

      return (
        <Category
          key={pathname}
          isMobile={isMobile}
          level={level}
          title={title}
          selected={selected}
          opened={opened}
        >
          <SidebarRoutes isMobile={isMobile} routes={routes} level={level + 1} />
        </Category>
      );
    }

    const href = '/docs/[[...slug]]';
    const pagePath = removeFromLast(path, '.');
    const pathname = addTagToSlug(pagePath, tag);
    const selected = slug.startsWith(pagePath);
    const route = { href, path, title, pathname, selected };

    return <Post key={title} isMobile={isMobile} level={level} route={route} />;
  });
}

const Docs = ({ routes, route: _route, data, html }) => {
  const router = useRouter();
  const { asPath, isFallback, query } = router;
  console.log(router)
  const isMobile = useIsMobile();
  const { route, prevRoute, nextRoute } = _route ? getRouteContext(_route, routes) : {};

  useEffect(() => {
    if (asPath.startsWith('/docs/getting-started#')) {
      const hash = asPath.split('#')[1];

      // excluded hashes don't need to be redirected to the olds docs because they are covered
      // by the first page of the new docs (/docs/getting-started)
      if (!hashMap.excluded.includes(hash)) {
        const to = hashMap.redirects[hash];
        // Redirect the user to the section in the new docs that corresponds to the hash,
        // or to the old docs if a redirect for that hash is not set
        router.push(`/docs${to || `/old#${hash}`}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  if (!route && !isFallback) {
    return <Error statusCode={404} />;
  }

  const title = route && `${data.title || route.title} | Next.js`;
  const { tag } = getSlug(query);
  const image = asPath.startsWith('/docs/migrating')
    ? 'https://og-image.now.sh/Migrating%20to%20**Next.js**.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg'
    : '/static/twitter-cards/documentation.png';

  return (
    <FeedbackContext.Provider value={{ label: 'next-docs' }}>
      {tag && (
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
      )}
      <Page title={title} description={false} sticky={!isMobile}>
        {route ? (
          <PageContent>
            <Container>
              <div className="content">
                <Sidebar fixed>
                  <SidebarRoutes routes={routes} />
                </Sidebar>
                <DocsPage route={route} html={html} prevRoute={prevRoute} nextRoute={nextRoute} />
              </div>
              <style jsx>{`
                .content {
                  position: relative;
                  display: flex;
                  margin-top: 2rem;
                }

                @media (max-width: 950px) {
                  .content {
                    margin-top: 1rem;
                  }
                }

                /* Remove the top margin of the first heading in the sidebar */
                :global(.heading:first-child > h4) {
                  margin-top: 0;
                }
              `}</style>
            </Container>
          </PageContent>
        ) : (
          <Container>
            <div className="content">
              <aside>
                <Skeleton style={{ height: '2.5rem', margin: '1.5rem 0' }} />
                <Skeleton style={{ height: 'calc(100% - 5.5rem)' }} />
              </aside>
              <Skeleton style={{ maxWidth: '100%', margin: '1.5rem 0 0' }} />
            </div>

            <style jsx>{`
              aside {
                min-width: 300px;
                height: calc(((100vh - 2rem) - 81px) - 50px);
                padding-right: 1.5rem;
                margin-right: 1rem;
              }
              .content {
                position: relative;
                display: flex;
                margin-top: 2rem;
              }
            `}</style>
          </Container>
        )}
      </Page>
    </FeedbackContext.Provider>
  );
};

export async function getStaticPaths() {
  const tag = await getCurrentTag();
  const manifest = await fetchDocsManifest(tag);
  return { paths: getPaths(manifest.routes), fallback: true };
}

export async function getStaticProps({ params }) {
  const { tag, slug } = getSlug(params);
  const currentTag = await getCurrentTag(tag);
  const manifest = await fetchDocsManifest(currentTag).catch(error => {
    // If a manifest wasn't found for a custom tag, show a 404 instead
    if (error.status === 404) return;
    throw error;
  });
  const route = manifest && findRouteByPath(slug, manifest.routes);

  if (!route) return { props: {} };

  const md = await getRawFileFromRepo(route.path, currentTag);
  const { content, data } = matter(md);
  const html = await markdownToHtml(route.path, tag, content);

  return { props: { routes: manifest.routes, data, route, html } };
}

export default Docs;















// import Header from '../../src/components/Header'
// import styles from '../../styles/Document.module.css'


// export default function Docs() {
//   return (
//     <div className={styles.container}>
//       <Header />

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Welcome to <a href="https://nextjs.org">Next.js</a> DaaS!
//         </h1>

//         <p className={styles.description}>
//           Get started by editing{' '}
//           <code className={styles.code}>pages/index.js</code>
//         </p>

//       </main>

//       <footer className={styles.footer}>
//         <a
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
//         </a>
//       </footer>
//     </div>
//   )
// }














