import 'katex/dist/katex.min.css';
import Head from 'next/head';
import { BlockMath, InlineMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import gfm from 'remark-gfm';
import math from 'remark-math';
import Date from '../../components/date';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import style from '../../styles/Post.module.css';
import utilStyles from '../../styles/utils.module.css';

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
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className="mr-2bklw ml-2bklw">
        <h1 className={utilStyles.heading2Xl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <ReactMarkdown
          className={style.markdown}
          plugins={[gfm, math]}
          renderers={renderers}
          transformImageUri={(url) => (url.match('../public') ? url.substring(9) : `/${url}`)}
        >
          {postData.content}
        </ReactMarkdown>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = getPostData(params.id);
  return {
    props: { postData },
  };
}
