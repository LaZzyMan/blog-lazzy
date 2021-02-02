import Link from 'next/link';
import BgGrid from './bgGrid';
import Header from './header';
import styles from './layout.module.css';

export const name = 'Seigo Natsume';
export const siteTitle = 'Blog of LaZzY';
export const description = '日々、私たちが過ごしている日常は、実は奇跡の連続なのかもしれない。';

export default function Layout({ children, home }) {
  return (
    <>
      <BgGrid />
      <div className="mx-bkl pt-bkl">
        <Header name={name} description={description} />
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
