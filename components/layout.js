import Head from 'next/head';
import Link from 'next/link';
import BgGrid from './bgGrid';
import styles from './layout.module.css';
import MenuBtn from './menuBtn';
import NavigationBar from './navigation';

export const name = 'Seigo Natsume';
export const siteTitle = 'Blog of LaZzY';
export const description = '日々、私たちが過ごしている日常は、実は奇跡の連続なのかもしれない。';

export default function Layout({ children, home }) {
  return (
    <>
      <BgGrid />
      <div className="mx-bkl pt-bkl">
        <Head>
          <title>{siteTitle}</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="keywords" content="Blog" />
          <meta name="description" content="Home page of LaZzY." />
          <meta name="author" content="LaZzY" />
        </Head>
        <header className="flex flex-col">
          <section className="flex felx-row items-center">
            <Link href="/">
              <a href="/">
                <img
                  src="/img/logo_black.png"
                  className="w-bkw h-bkw"
                  alt={name}
                />
              </a>
            </Link>
            <span className="ml-bkl flex-col flex">
              <span className="text-content">{name}</span>
              <span className="text-content text-gray-500">{description}</span>
            </span>
            <MenuBtn />
          </section>
          <section className="mt-h10">
            <NavigationBar />
          </section>
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
