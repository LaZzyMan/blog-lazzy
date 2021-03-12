import { useEffect, useState } from 'react';
import group from '../lib/utils';
import styles from './cardList.module.css';

export default function CardList({
  index, data, focus, bgColor, onPageChange, onPostClick,
}) {
  const [curPage, setCurPage] = useState(0);
  const [isTransitionEnd, setIsTransitionEnd] = useState(true);
  const pages = group(data, 4).map((c) => (
    c.map((p, i) => {
      const tmp = p;
      tmp.rank = i;
      return tmp;
    })
  ));
  const numPages = pages.length;
  const handlePageChange = (i) => {
    setIsTransitionEnd(false);
    setCurPage(i);
  };
  useEffect(() => {
    onPageChange((curPage + 1) / numPages, index);
  }, [curPage, numPages]);
  return (
    <div>
      <div className={styles.cardListContainer}>
        {pages[curPage].map(({
          id, date, title, tags, image, rank,
        }) => (
          <div
            className={`${styles.cardContainer} ${(curPage % 2 === 1) && styles.cardChange}`}
            onTransitionEnd={() => { setIsTransitionEnd(true); }}
            role="button"
            key={rank}
            onClick={() => { onPostClick(id); }}
            tabIndex={0}
          >
            <div className={styles.cardCover} style={{ 'background-image': bgColor }} />
            <div className={`${styles.cardImage} ${!isTransitionEnd && 'opacity-0'}`}>
              <img src={image} alt="" />
            </div>
            <span className={`w-bk2wl text-2xl pl-w1 pr-w1 mt-h5 z-30 transition-opacity duration-500 ${!isTransitionEnd && 'opacity-0'}`}>{title}</span>
            <div className={`flex flex-row mb-h2 w-bk2wl justify-between pr-w1 z-30 transition-opacity duration-500 ${!isTransitionEnd && 'opacity-0'}`}>
              <span className="pl-w1 text-right pr-w1">{tags}</span>
              <div className="flex flex-col text-gray-400">
                <span className="text-right text-xs">{date.split(' ')[1]}</span>
                <span className="text-right text-xs">{date.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}

      </div>
      <div className={styles.arrowcontainer}>
        <div
          className={(curPage > 0) && focus
            ? styles.leftarrowactivate
            : styles.leftarrowhidden}
          onClick={() => handlePageChange(curPage === 0 ? curPage : curPage - 1)}
          role="button"
          tabIndex={0}
        >
          <span />
        </div>
        <div
          className={(curPage < numPages - 1) && focus
            ? styles.rightarrowactivate
            : styles.rightarrowhidden}
          onClick={() => handlePageChange(curPage === numPages ? curPage : curPage + 1)}
          role="button"
          tabIndex={0}
        >
          <span />
        </div>
      </div>
    </div>
  );
}
