/* eslint-disable no-lonely-if */
import React, { useState } from 'react';
import styles from './toc.module.css';

class TreeNode {
  constructor(text, level) {
    this.text = text;
    this.level = level;
    this.children = [];
  }
}

const getTitleTree = (headers) => {
  const root = new TreeNode();
  const stack = [];
  headers.push({ text: '', level: 0 });
  headers.forEach((header) => {
    if (stack.length === 0) {
      stack.push(new TreeNode(header.text, header.level));
    } else {
      if (header.level > stack.slice(-1)[0].level) {
        stack.push(new TreeNode(header.text, header.level));
      } else if (header.level === stack.slice(-1)[0].level) {
        const popNode = stack.pop();
        if (stack.length === 0) {
          root.children.push(popNode);
        } else {
          stack.slice(-1)[0].children.push(popNode);
        }
        stack.push(new TreeNode(header.text, header.level));
      } else {
        while (stack.length > 0 && stack.slice(-1)[0].level >= header.level) {
          const popNode = stack.pop();
          if (stack.length === 0) {
            root.children.push(popNode);
          } else {
            stack.slice(-1)[0].children.push(popNode);
          }
        }
        stack.push(new TreeNode(header.text, header.level));
      }
    }
  });
  return root;
};

const TOC = ({ headers }) => {
  const titleTree = getTitleTree(headers);
  return (
    <div className={styles.tocContainer}>
      <TitleTree titleTree={titleTree} />
    </div>
  );
};

const TitleTree = ({ titleTree }) => (
  titleTree.children.map((node) => (
    <Title level={node.level} text={node.text}>
      <TitleTree titleTree={node} />
    </Title>
  ))
);

const Title = ({ level, text, children }) => {
  const headerText = [styles.header2, styles.header3, styles.header4];
  const [isHover, setIsHover] = useState(false);
  if (level > 4 || level < 2) return null;
  return (
    <div
      className={styles.titleContainer}
      onMouseOver={() => { setIsHover(true); }}
      onMouseOut={() => { setIsHover(false); }}
      onFocus={() => { setIsHover(true); }}
      onBlur={() => { setIsHover(false); }}
    >
      <div
        className={headerText[level - 2]}
      >
        <div className={styles.point} />
        {level === 2
          ? <div className={styles.ring} />
          : <div className={styles.ring} style={{ border: 'none' }} />}
        <div className={styles.headerText}>{text}</div>
      </div>
      <div className={styles.titleContainer} style={{ display: (isHover ? 'flex' : 'none') }}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(TOC);
