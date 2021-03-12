import { categoryColormap, leftColormap, rightColormap } from '../lib/settings';
import styles from './background.module.css';

export default function Background({ home, focus, category }) {
  const leftPosStyles = [styles.left_pos_0, styles.left_pos_1,
    styles.left_pos_2, styles.left_pos_3];
  const rightPosStyles = [styles.right_pos_0, styles.right_pos_1,
    styles.right_pos_2, styles.right_pos_3];
  return (
    <div className="w-full h-full fixed flex z-bottom">
      <div
        className={styles.middleContainer}
        style={home ? { top: '-100vh' } : { top: '0vh' }}
      />
      <div className={styles.leftcontainer}>
        <div
          className={home ? leftPosStyles[focus] : leftPosStyles[1]}
          style={home ? { 'background-color': leftColormap[2] } : { 'background-color': categoryColormap[focus] }}
        />
        <div
          className={home ? leftPosStyles[focus] : leftPosStyles[1]}
          style={home ? { 'background-color': leftColormap[1] } : { 'background-color': categoryColormap[focus] }}
        />
        <div
          className={home ? leftPosStyles[focus] : leftPosStyles[1]}
          style={home ? { 'background-color': leftColormap[0] } : { 'background-color': categoryColormap[focus] }}
        />
      </div>
      <div className={styles.rightcontainer}>
        <div
          className={home ? rightPosStyles[focus] : rightPosStyles[1]}
          style={home ? { 'background-color': rightColormap[0] } : { 'background-color': categoryColormap[focus] }}
        />
        <div
          className={home ? rightPosStyles[focus] : rightPosStyles[1]}
          style={home ? { 'background-color': rightColormap[1] } : { 'background-color': categoryColormap[focus] }}
        />
        <div
          className={home ? rightPosStyles[focus] : rightPosStyles[1]}
          style={home ? { 'background-color': rightColormap[2] } : { 'background-color': categoryColormap[focus] }}
        />
      </div>
    </div>
  );
}
