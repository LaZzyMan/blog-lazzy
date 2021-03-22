import 'katex/dist/katex.min.css';
import { useEffect, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import gfm from 'remark-gfm';
import math from 'remark-math';
import useSWR from 'swr';
import { categoryColormap } from '../lib/settings';
import { throttle } from '../lib/utils';
import Date from './date';
import styles from './post.module.css';
import ProgressBar from './progressBar';

const renderers = {
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
  heading: ({ level, children }) => {
    let header;
    switch (level) {
      case 1:
        header = (<h1>{children}</h1>);
        break;
      case 2:
        header = (<h2>{children}</h2>);
        break;
      case 3:
        header = (<h3>{children}</h3>);
        break;
      default:
        header = (<h4>{children}</h4>);
    }
    return (<a href={`#${children[0].props.children}`}>{header}</a>);
  },
};

export default function Post({ postData, focus }) {
  const [progress, setProgress] = useState(0);
  const { data } = useSWR(`/api/post/${postData.id}`, (url) => fetch(url).then((res) => res.json()));
  const handleScroll = (e) => {
    const { scrollHeight, scrollTop, offsetHeight } = e.target;
    setProgress((Math.round((offsetHeight + scrollTop) / scrollHeight) * 100));
  };
  useEffect(() => {
    const { scrollHeight, offsetHeight } = document.getElementById('scrollArea');
    setProgress(Math.round((100 * offsetHeight) / scrollHeight));
  }, [data]);
  return (
    <article className="ml-bklw mr-bklw">
      <ProgressBar percent={progress} focus={focus} />
      <h1 className={styles.postHead}>{postData.title}</h1>
      <div className="text-gray-500">
        <Date dateString={postData.date} />
      </div>
      <div id="scrollArea" className={styles.postContainer} onScroll={(e) => throttle(handleScroll, 300)(e)}>
        {data
          ? (
            <ReactMarkdown
              className={styles.markdown}
              plugins={[gfm, math]}
              renderers={renderers}
              transformImageUri={(url) => (url.match('../public') ? url.substring(9) : `/${url}`)}
            >
              {data.content}
            </ReactMarkdown>
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
