import { categoryColormap } from '../lib/settings';
import style from './progressBar.module.css';

export default function ProgressBar({ percent, focus }) {
  const progress = (percent > 100) ? 100 : percent;
  return (
    <>
      <div className={style.progressBar} style={{ width: `${progress}%`, backgroundColor: categoryColormap[focus] }} />
      <div className={style.progressBarBK} />
    </>
  );
}
