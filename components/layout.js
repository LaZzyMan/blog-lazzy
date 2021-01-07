import Head from 'next/head';
import Link from 'next/link';
import BgGrid from './bgGrid';
import styles from './layout.module.css';
import MenuBtn from './menuBtn';

const name = 'Seigo Natsume';
export const siteTitle = 'Blog of LaZzY';

export default function Layout({ children, home }) {
  return (
    <>
      <BgGrid />
      <div className={styles.container}>
        <Head>
          <title>{siteTitle}</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="keywords" content="Blog" />
          <meta name="description" content="Home page of LaZzY." />
          <meta name="author" content="LaZzY" />
        </Head>
        <header className={styles.header}>
          {home ? (
            <>
              <img
                src="/img/logo_black.png"
                className={styles.headerImage}
                alt={name}
              />
              <h1 className="text-h2">{name}</h1>
            </>
          ) : (
            <>
              <Link href="/">
                <a href="/">
                  <img
                    src="/img/logo_black.png"
                    className={styles.headerImage}
                    alt={name}
                  />
                </a>
              </Link>
              <h2 className="text-h2">
                <Link href="/">
                  <a href="/">{name}</a>
                </Link>
              </h2>
            </>
          )}
          <MenuBtn />
        </header>
        <main>{children}</main>
        {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a href="/">← Back to home</a>
          </Link>
        </div>
        )}
      </div>
    </>
  );
}
