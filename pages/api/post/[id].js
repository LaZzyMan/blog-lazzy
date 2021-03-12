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

export default function handler(req, res) {
  const { id } = req.query;
  const { fileName } = fileNameHashCodes.find((e) => e.hash === id);
  const fullPath = path.join(postDir, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  res.status(200).json({
    id,
    content: matterResult.content,
    ...matterResult.data,
  });
}
