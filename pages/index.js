import Head from 'next/head';
import React, { useState } from 'react';
import Background from '../components/background';
import CardList from '../components/cardList';
import Hello from '../components/hello';
import Layout from '../components/layout';
import getSortedPostsData from '../lib/posts';
import styles from '../styles/Home.module.css';

const siteTitle = 'Blog of LaZzY';
const mood2 = 'but This is ';
const mood1 = 'There is Nothing Meaningful';
const mood3 = 'Me.';
const blogClasses = ['Life', 'Research', 'Development'];

export default function Home({ allPostsData }) {
  const [focus, setFocus] = useState(0);
  const [isTransitionEnd, setIsTransitionEnd] = useState(true);
  const cardPosStyles = [styles.pos_0, styles.pos_n1, styles.pos_n2, styles.pos_n3];
  const handleNaviBarClick = (i) => {
    if (isTransitionEnd) {
      setFocus(i);
      setIsTransitionEnd(false);
    }
  };
  return (
    <div
      onWheel={(e) => {
        if (e.deltaY < 0 && focus > 0) {
          handleNaviBarClick(focus - 1);
        }
        if (e.deltaY > 0 && focus < 3) {
          handleNaviBarClick(focus + 1);
        }
      }}
    >
      <Background focus={focus} />
      <Layout home onNaviBarClick={handleNaviBarClick} focus={focus}>
        <Head>
          <title>{siteTitle}</title>
          <link rel="icon" href="/img/favicon.ico" />
          <meta name="keywords" content="Blog" />
          <meta name="description" content="Home page of LaZzY." />
          <meta name="author" content="LaZzY" />
        </Head>
        <section className="ml-bklw overflow-hidden mt-h32 h-hsection absolute w-wsection">
          <div className={`${cardPosStyles[focus]} h-hsection`} onTransitionEnd={() => setIsTransitionEnd(true)}>
            <Hello
              mood1={mood1}
              mood2={mood2}
              mood3={mood3}
              onClickDown={handleNaviBarClick}
            />
          </div>
          {blogClasses.map((c, i) => (
            <div className={`${cardPosStyles[focus]} h-hsection pt-h2`}>
              <CardList
                data={allPostsData.filter(({ category }) => (c === category))}
                focus={focus === i + 1}
              />
            </div>
          ))}
        </section>
      </Layout>
    </div>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return { props: { allPostsData } };
}
