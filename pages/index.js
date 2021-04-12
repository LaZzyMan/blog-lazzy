import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CardList from '../components/cardList';
import Hello from '../components/hello';
import Layout from '../components/layout';
import Post from '../components/post';
import getSortedPostsData from '../lib/posts';
import {
  blogClasses, cardColormap, mood1, mood2, mood3, siteTitle
} from '../lib/settings';
import styles from '../styles/Home.module.css';

export default function Home({ allPostsData }) {
  const cardPosStyles = [styles.pos_0, styles.pos_n1, styles.pos_n2, styles.pos_n3];
  const classedPosts = blogClasses.map((c) => (
    allPostsData.filter(({ category }) => (c === category))));
  const [curDisplay, setCurDisplay] = useState('home');
  const [focus, setFocus] = useState(0);
  const [title, setTitle] = useState(siteTitle);
  const [isTransitionEnd, setIsTransitionEnd] = useState(true);
  const [curProgress, setCurProgress] = useState(
    classedPosts.map((c) => (1 / Math.ceil(c.length / 4))),
  );
  const router = useRouter();
  const handleNaviBarClick = (i) => {
    if (isTransitionEnd) {
      setFocus(i);
      setIsTransitionEnd(false);
    }
  };
  const handleDisplayChange = (id) => {
    setCurDisplay(id);
    if (id === 'home') {
      setTitle(siteTitle);
      router.push('/', undefined, { shallow: true });
    } else {
      setTitle(allPostsData.find((i) => (i.id === id)).title);
      router.push(`/?id=${id}`, undefined, { shallow: true });
    }
  };
  const handlePageChange = (progress, i) => {
    const newProgress = [...curProgress];
    newProgress[i] = progress;
    setCurProgress(newProgress);
  };
  return (
    <Layout
      home={curDisplay === 'home'}
      onNaviBarClick={handleNaviBarClick}
      focus={focus}
      naviProgress={curProgress}
      onHomeClick={handleDisplayChange}
    >
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/img/favicon.ico" />
        <meta name="keywords" content="Blog" />
        <meta name="description" content="Home page of LaZzY." />
        <meta name="author" content="LaZzY" />
      </Head>
      <section
        className="ml-bklw overflow-hidden mt-h27 h-hsection absolute w-wsection transition-all duration-500 ease-out delay-200"
        style={curDisplay === 'home' ? { top: '2.6vw', opacity: 1 } : { top: '100vh', opacity: 0 }}
      >
        <div className={`${cardPosStyles[focus]} h-hsection`} onTransitionEnd={() => setIsTransitionEnd(true)}>
          <Hello
            mood1={mood1}
            mood2={mood2}
            mood3={mood3}
            onClickDown={handleNaviBarClick}
          />
        </div>
        {blogClasses.map((c, i) => (
          <div className={`${cardPosStyles[focus]} h-hsection pt-h2`} key={c}>
            <CardList
              data={allPostsData.filter(({ category }) => (c === category))}
              focus={focus === i + 1}
              bgColor={cardColormap[i]}
              onPageChange={handlePageChange}
              onPostClick={handleDisplayChange}
              index={i}
            />
          </div>
        ))}
      </section>
      <section
        className={styles.postSection}
        style={curDisplay === 'home' ? { top: '-100vh' } : { top: '0vh' }}
      >
        {curDisplay !== 'home'
        && (<Post postData={allPostsData.find((i) => i.id === curDisplay)} focus={focus} />)}
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return { props: { allPostsData } };
}
