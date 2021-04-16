import Head from 'next/head';
import React, { useState } from 'react';
import CardList from '../components/cardList';
import Hello from '../components/hello';
import NavigationBar from '../components/navigation';
import getSortedPostsData from '../lib/posts';
import {
  blogClasses, cardColormap, mood1, mood2, mood3, siteTitle
} from '../lib/settings';
import styles from '../styles/Home.module.css';

export default function Home({
  allPostsData, focus, changeFocus, changeDisplay, home,
}) {
  const cardPosStyles = [styles.pos_0, styles.pos_n1, styles.pos_n2, styles.pos_n3];
  const classedPosts = blogClasses.map((c) => (
    allPostsData.filter(({ category }) => (c === category))));
  const [curProgress, setCurProgress] = useState(
    classedPosts.map((c) => (1 / Math.ceil(c.length / 4))),
  );
  const handlePageChange = (progress, i) => {
    const newProgress = [...curProgress];
    newProgress[i] = progress;
    setCurProgress(newProgress);
  };
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/img/favicon.ico" />
        <meta name="keywords" content="Blog" />
        <meta name="description" content="Home page of LaZzY." />
        <meta name="author" content="LaZzY" />
      </Head>
      <section
        className={styles.navi}
        style={{ opacity: home ? 1 : 0 }}
      >
        <NavigationBar focus={focus} onNaviBarClick={changeFocus} progress={curProgress} />
      </section>
      <section
        className={styles.main}
        style={home ? { top: '2.6vw', opacity: 1 } : { top: '100vh', opacity: 0 }}
      >
        <div className={`${cardPosStyles[focus]} h-hsection`}>
          <Hello
            mood1={mood1}
            mood2={mood2}
            mood3={mood3}
            onClickDown={changeFocus}
          />
        </div>
        {blogClasses.map((c, i) => (
          <div className={`${cardPosStyles[focus]} h-hsection pt-h10`} key={c}>
            <CardList
              data={allPostsData.filter(({ category }) => (c === category))}
              focus={focus === i + 1}
              bgColor={cardColormap[i]}
              onPageChange={handlePageChange}
              onPostClick={changeDisplay}
              index={i}
            />
          </div>
        ))}
      </section>
    </div>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return { props: { allPostsData } };
}
