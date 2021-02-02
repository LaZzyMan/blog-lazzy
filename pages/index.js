import Head from 'next/head';
import Link from 'next/link';
import Date from '../components/date';
import Layout, { siteTitle } from '../components/layout';
import getSortedPostsData from '../lib/posts';
import utilStyles from '../styles/utils.module.css';

const blogClasses = ['Life', 'Research', 'Development'];

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content="Blog" />
        <meta name="description" content="Home page of LaZzY." />
        <meta name="author" content="LaZzY" />
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        {blogClasses.map((c) => {
          const categoryPostsData = allPostsData.filter(({ category }) => (c === category));
          return (
            <>
              <h2 className={utilStyles.headingLg}>{c}</h2>
              <ul className={utilStyles.list}>
                {categoryPostsData.map(({ id, date, title }) => (
                  <li className={utilStyles.listItem} key={id}>
                    <Link href={`/posts/${id}`}>
                      <a href={`/posts/${id}`}>
                        {title}
                      </a>
                    </Link>
                    <small className={utilStyles.lightText}>
                      <Date dateString={date} />
                    </small>
                  </li>
                ))}
              </ul>
            </>
          );
        })}
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return { props: { allPostsData } };
}
