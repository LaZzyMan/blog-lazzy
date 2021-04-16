import 'katex/dist/katex.min.css';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import gfm from 'remark-gfm';
import math from 'remark-math';
import Date from '../../components/date';
import styles from '../../components/post.module.css';
import ProgressBar from '../../components/progressBar';
import { getAllPostIds, getPostData } from '../../lib/posts';
import { categoryColormap } from '../../lib/settings';
import { throttle } from '../../lib/utils';

let headers = [];
const renderers = {
  root: ({ children }) => {
    headers = children.reduce((acc, { key, props }) => {
      if (key.indexOf('heading') === 0) {
        acc.push({ level: props.level, text: props.children[0].props.children });
      }
      return acc;
    }, []);
    return (
      <div className={styles.markdown}>
        {children}
      </div>
    );
  },
  code: ({ language, value }) => (
    <SyntaxHighlighter
      style={monokaiSublime}
      language={language}
      showLineNumbers
      showInlineLineNumbers
      lineNumberStyle={{ color: 'gray' }}
    >
      {value}
    </SyntaxHighlighter>
  ),
  inlineMath: ({ value }) => (
    <InlineMath math={value} />
  ),
  math: ({ value }) => (
    <BlockMath math={value} />
  ),
};

const Article = React.memo(({ text }) => (
  <ReactMarkdown
    plugins={[gfm, math]}
    renderers={renderers}
    transformImageUri={(url) => (url.match('../public') ? url.substring(9) : `/${url}`)}
  >
    {text}
  </ReactMarkdown>
));

function Post({ postData, focus, home }) {
  const [scrollHeight, setScrollHeight] = useState(0);
  const [offsetHeight, setOffsetHeight] = useState(0);
  const [progress, setProgress] = useState(0);
  const handleScroll = (e) => {
    if (e.deltaY > 0 && (progress + offsetHeight) < scrollHeight) {
      setProgress((prev) => prev + 200);
    }
    if (e.deltaY < 0 && progress > 0) {
      setProgress((prev) => (prev >= 200 ? prev - 200 : 0));
    }
  };
  const handleTOCClick = (text, level) => {
    const header = Array.from(document.querySelectorAll(`h${level}`)).find((i) => (
      i.innerText.split(' ').join('') === text.split(' ').join('')
    ));
    if (header.offsetTop < scrollHeight) {
      setProgress(header.offsetTop);
    } else {
      setProgress(scrollHeight - offsetHeight);
    }
  };
  const onScreenResize = () => {
    const elem = document.getElementById('scrollArea');
    setScrollHeight(elem.scrollHeight + 200);
    setOffsetHeight(elem.offsetHeight);
  };
  useEffect(() => {
    window.addEventListener('resize', onScreenResize);
    return () => {
      window.removeEventListener('resize', onScreenResize);
    };
  }, []);
  useEffect(() => {
    onScreenResize();
  }, [postData]);
  return (
    <article
      className="pl-bklw pr-bklw transition-all duration-300 ease-out"
      onWheel={(e) => throttle(handleScroll, 100)(e)}
      style={{ opacity: home ? 0 : 1 }}
    >
      <Head>
        <title>{postData.title}</title>
        <link rel="icon" href="/img/favicon.ico" />
        <meta name="keywords" content="Blog" />
        <meta name="author" content="LaZzY" />
      </Head>
      <ProgressBar
        percent={Math.round((100 * (offsetHeight + progress)) / scrollHeight)}
        focus={focus}
        headers={headers}
        onTOCClick={handleTOCClick}
      />
      <h1 className={styles.postHead}>{postData.title}</h1>
      <div className="text-gray-500">
        <Date dateString={postData.date} />
      </div>
      <div id="scrollArea" className={styles.postContainer}>
        {postData
          ? (
            <div className={styles.scrollContent} style={{ transform: `translateY(${-progress}px)` }}>
              <Article text={postData.content} />
            </div>
          )
          : (
            <div className="flex justify-center relative" style={{ top: '30%' }}>
              <svg
                version="1.1"
                id="loader-1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="7vw"
                height="7vw"
                viewBox="0 0 50 50"
                style={{ 'enable-background': 'new 0 0 50 50' }}
                xmlSpace="preserve"
              >
                <path fill={categoryColormap[focus]} d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                  <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          )}
      </div>
    </article>
  );
}

export default React.memo(Post);

export async function getStaticPaths() {
  return {
    paths: getAllPostIds(),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const postData = getPostData(params.id);
  return {
    props: { postData },
  };
}
