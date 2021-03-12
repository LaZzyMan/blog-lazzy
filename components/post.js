import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import gfm from 'remark-gfm';
import math from 'remark-math';
import useSWR from 'swr';
import Date from './date';
import styles from './post.module.css';

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
};

export default function Post({ postData }) {
  const { data, error } = useSWR(`/api/post/${postData.id}`, (url) => fetch(url).then((res) => res.json()));
  return (
    <article className="ml-bklw mr-bklw">
      <h1 className={styles.postHead}>{postData.title}</h1>
      <div className="text-gray-500">
        <Date dateString={postData.date} />
      </div>
      <div className={styles.postContainer}>

        <ReactMarkdown
          className={styles.markdown}
          plugins={[gfm, math]}
          renderers={renderers}
          transformImageUri={(url) => (url.match('../public') ? url.substring(9) : `/${url}`)}
        >
          {data && data.content}
        </ReactMarkdown>

      </div>
    </article>
  );
}
