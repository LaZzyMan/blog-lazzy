/* eslint-disable no-bitwise */
/* eslint-disable no-extend-native */
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const hashCode = (str) => {
  let hash = 0;
  let i;
  let chr;
  if (str.length === 0) return hash.toString();
  for (i = 0; i < str.length; i += 1) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString();
};

const postDir = path.join(process.cwd(), 'posts');
const allNames = fs.readdirSync(postDir);
const fileNames = allNames.filter((fileName) => {
  const fullPath = path.join(postDir, fileName);
  return !fs.statSync(fullPath).isDirectory();
});
const fileNameHashCodes = fileNames.map((fileName) => ({
  fileName,
  hash: hashCode(fileName.replace(/\.md$/, '')),
}));

export default function getSortedPostsData() {
  const allPostsData = fileNameHashCodes.map(({ fileName, hash }) => {
    const id = hash;
    const fullPath = path.join(postDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    console.log(hash);
    console.log(fullPath);
    return { id, ...matterResult.data };
  });
  const finishedPostsData = allPostsData.filter((c) => !(Object.keys(c).includes('draft')));
  return finishedPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }
    return -1;
  });
}

export function getAllPostIds() {
  return fileNameHashCodes.map((fileNameHashCode) => ({ params: { id: fileNameHashCode.hash } }));
}

export function getPostData(id) {
  const { fileName } = fileNameHashCodes.find((e) => e.hash === id);
  const fullPath = path.join(postDir, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  return {
    id,
    content: matterResult.content,
    ...matterResult.data,
  };
}
