import Head from 'next/head';
import CardList from '../components/cardList';
import Layout, { siteTitle } from '../components/layout';
import getSortedPostsData from '../lib/posts';

const blogClasses = ['Life', 'Research', 'Development'];

export default function Home({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content="Blog" />
        <meta name="description" content="Home page of LaZzY." />
        <meta name="author" content="LaZzY" />
      </Head>
      <section className="ml-bklw overflow-hidden">
        {blogClasses.map((c) => {
          const categoryPostsData = allPostsData.filter(({ category }) => (c === category));
          return (
            <CardList data={categoryPostsData} />
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
