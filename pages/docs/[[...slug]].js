import { useRouter } from 'next/router';
import Error from 'next/error';
import Head from 'next/head';
import matter from 'gray-matter';
import { getSlug, removeFromLast, addTagToSlug } from '../../src/lib/docs/utils';
import { getPaths, findRouteByPath, fetchDocsManifest } from '../../src/lib/docs/page';
import { getFileContent } from '../../src/lib/raw';
import markdownToHtml from '../../src/lib/docs/markdown-to-html';
import getRouteContext from '../../src/lib/get-route-context';
import PageContent from '../../src/components/PageContent';
import Container from '../../src/components/Container';
import DocsPage from '../../src/components/docs/DocsPage';
import { Sidebar, Post, Category, Heading } from '../../src/components/sidebar';
import Page from '../../src/components/Page';
import FeedbackContext from '../../src/components/FeedbackContext';

function getCategoryPath(routes) {
  const route = routes.find(r => r.path);
  return route && removeFromLast(route.path, '/');
}

function SidebarRoutes({ routes: currentRoutes, level = 1 }) {
  const { query } = useRouter();
  const { tag, slug } = getSlug(query);

  return currentRoutes.map(({ path, title, routes, heading, open }) => {
    if (routes) {
      const pathname = getCategoryPath(routes);
      const selected = slug.startsWith(pathname);
      const opened = selected ? false : open;

      if (heading) {
        return (
          <Heading key={pathname} title={title}>
            <SidebarRoutes routes={routes} level={level + 1} />
          </Heading>
        );
      }

      return (
        <Category
          key={pathname}
          level={level}
          title={title}
          selected={selected}
          opened={opened}
        >
          <SidebarRoutes routes={routes} level={level + 1} />
        </Category>
      );
    }

    const href = '/docs/[[...slug]]';
    const pagePath = removeFromLast(path, '.');
    const pathname = addTagToSlug(pagePath, tag);
    const selected = slug.startsWith(pagePath);
    const route = { href, path, title, pathname, selected };

    return <Post key={title} level={level} route={route} />;
  });
}

const Docs = ({ routes, route: _route, data, html }) => {
  const router = useRouter();
  const { isFallback, query } = router;
  const { route, prevRoute, nextRoute } = _route ? getRouteContext(_route, routes) : {};

  if (!route && !isFallback) {
    return <Error statusCode={404} />;
  }

  const title = route && `${data.title || route.title} | Next.js`;
  const { tag } = getSlug(query);

  return (
    <FeedbackContext.Provider value={{ label: 'next-docs' }}>
      {tag && (
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
      )}
      <Page title={title} description={false} sticky={true}>
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
        ) : null}
      </Page>
    </FeedbackContext.Provider>
  );
};

export async function getStaticPaths() {
  const manifest = await fetchDocsManifest();
  return { paths: getPaths(manifest.routes), fallback: true };
}

export async function getStaticProps({ params }) {
  const { tag, slug } = getSlug(params);
  const manifest = await fetchDocsManifest().catch(error => {
    // If a manifest wasn't found for a custom tag, show a 404 instead
    if (error.status === 404) return;
    throw error;
  });

  const route = manifest && findRouteByPath(slug, manifest.routes);

  if (!route) return { props: {} };

  const md = await getFileContent(route.path)
  const { content, data } = matter(md);
  const html = await markdownToHtml(route.path, tag, content);

  return { props: { routes: manifest.routes, data, route, html } };
}

export default Docs;
