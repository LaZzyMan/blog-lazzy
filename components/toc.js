import React from 'react';
import styles from './toc.module.css';

const TOC = ({ headers }) => (
  <div className={styles.tocContainer}>
    { headers.map((header) => {
      switch (header.level) {
        case 2:
          return (<div className={`${styles.headerText} ${styles.header2}`}>{header.text}</div>);
        case 3:
          return (<div className={`${styles.headerText} ${styles.header3}`}>{header.text}</div>);
        default:
          return (<div className={`${styles.headerText} ${styles.header4}`}>{header.text}</div>);
      }
    })}
  </div>
);

export default React.memo(TOC);
