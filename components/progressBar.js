import { useState } from 'react';
import { categoryColormap } from '../lib/settings';
import TOC from './toc';
import style from './progressBar.module.css';

export default function ProgressBar({ percent, focus, headers }) {
  const progress = (percent > 100) ? 100 : percent;
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className={style.progressBarBK}
      style={{ 'max-height': isHover ? '100vh' : '1vh', backgroundColor: isHover ? categoryColormap[focus] : 'gray' }}
      onMouseEnter={() => { setIsHover(true); console.log('mouseover'); }}
      onMouseLeave={() => { setIsHover(false); console.log('mouseout'); }}
    >
      <div
        className={style.progressBar}
        style={{ width: isHover ? 0 : `${progress}%`, backgroundColor: categoryColormap[focus] }}
      />
      {isHover && <TOC headers={headers} />}
    </div>
  );
}
