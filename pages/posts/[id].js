import 'katex/dist/katex.min.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BlockMath, InlineMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import gfm from 'remark-gfm';
import math from 'remark-math';
import Date from '../../components/date';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import styles from '../../styles/Post.module.css';
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
  const router = useRouter();
  const { category } = router.query;
  return (
    <Layout home={false} category={category}>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className="ml-bk2wl mr-bk2wl pl-bkl pr-bkl">
        <h1 className={utilStyles.heading2Xl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div className={styles.postContainer}>
          <ReactMarkdown
            className={styles.markdown}
            plugins={[gfm, math]}
            renderers={renderers}
            transformImageUri={(url) => (url.match('../public') ? url.substring(9) : `/${url}`)}
          >
            {postData.content}
          </ReactMarkdown>
        </div>
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
