import { categoryColormap } from '../lib/settings';
import style from './progressBar.module.css';

export default function ProgressBar({ percent, focus }) {
  return (
    <>
      <div className={style.progressBar} style={{ width: `${percent}%`, backgroundColor: categoryColormap[focus] }} />
      <div className={style.progressBarBK} />
    </>
  );
}
