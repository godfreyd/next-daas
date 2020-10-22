import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.Container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.Main}>
        <h1 className={styles.Title}>
          Welcome to <a href="https://nextjs.org">Next.js</a> DaaS!
        </h1>

        <p className={styles.Description}>
          Get started by editing{' '}
          <code className={styles.Code}>pages/index.js</code>
        </p>

        <div className={styles.Grid}>
          <a href="./docs" className={styles.Card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Node.js features.</p>
          </a>

          <a href="./docs/api/index" className={styles.Card}>
            <h3>API &rarr;</h3>
            <p>Find in-depth information about Nede.js API.</p>
          </a>
        </div>
      </main>

      <footer className={styles.Footer}>
        <a
          href="https://github.com/godfreyd"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          @godfreyd
        </a>
      </footer>
    </div>
  )
}
