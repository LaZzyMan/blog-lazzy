import { useState } from 'react';
import { categoryColormap } from '../lib/settings';
import style from './progressBar.module.css';
import TOC from './toc';

export default function ProgressBar({
  percent, focus, headers, onTOCClick,
}) {
  const progress = (percent > 100) ? 100 : percent;
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className={style.progressBarBK}
      style={{ maxHeight: isHover ? '100vh' : '1vh', backgroundColor: isHover ? categoryColormap[focus] : 'gray' }}
      onMouseEnter={() => { setIsHover(true); }}
      onMouseLeave={() => { setIsHover(false); }}
    >
      <div
        className={style.progressBar}
        style={{ width: isHover ? 0 : `${progress}%`, backgroundColor: categoryColormap[focus] }}
      />
      {isHover && <TOC headers={headers} onTOCClick={onTOCClick} />}
    </div>
  );
}
