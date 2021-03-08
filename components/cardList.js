import Link from 'next/link';
import { useState } from 'react';
import group from '../lib/utils';
import styles from './cardList.module.css';

export default function CardList({ data, focus }) {
  const [curPage, setCurPage] = useState(0);
  const pages = group(data, 4);
  const numPages = pages.length;
  return (
    <div>
      <div className="flex w-full overflow-hidden">
        {pages[curPage].map(({
          id, date, title, tags,
        }) => (
          <Link href={`/posts/${id}`}>
            <div className="text-white mr-bkl flex flex-col justify-between h-hcard bg-card-cover">
              <div className="absolute z-bottom w-bk2wl">
                <img src="/冰菓/01.jpg" alt={title} className="w-auto max-w-full h-hcard object-cover" />
              </div>
              <span className="w-bk2wl text-2xl pl-w1 pr-w1 mt-h5">{title}</span>
              <div className="flex flex-row mb-h2 w-bk2wl justify-between pr-w1">
                <span className="pl-w1 text-right pr-w1">{tags}</span>
                <div className="flex flex-col text-gray-400">
                  <span className="text-right text-xs">{date.split(' ')[1]}</span>
                  <span className="text-right text-xs">{date.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

      </div>
      <div className={styles.arrowcontainer}>
        <div
          className={(curPage > 0) && focus
            ? styles.leftarrowactivate
            : styles.leftarrowhidden}
          onClick={() => setCurPage(curPage === 0 ? curPage : curPage - 1)}
          onKeyDown={() => setCurPage(curPage === 0 ? curPage : curPage - 1)}
          role="button"
          tabIndex={0}
        >
          <span />
        </div>
        <div
          className={(curPage < numPages - 1) && focus
            ? styles.rightarrowactivate
            : styles.rightarrowhidden}
          onClick={() => setCurPage(curPage === numPages ? curPage : curPage + 1)}
          onKeyDown={() => setCurPage(curPage === numPages ? curPage : curPage + 1)}
          role="button"
          tabIndex={0}
        >
          <span />
        </div>
      </div>
    </div>
  );
}
