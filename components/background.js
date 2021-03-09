import { leftColormap, rightColormap } from '../lib/settings';
import styles from './background.module.css';

export default function Background({ focus }) {
  const leftPosStyles = [styles.left_pos_0, styles.left_pos_1,
    styles.left_pos_2, styles.left_pos_3];
  const rightPosStyles = [styles.right_pos_0, styles.right_pos_1,
    styles.right_pos_2, styles.right_pos_3];
  return (
    <div className="w-full h-full fixed flex z-bottom">
      <div className={styles.leftcontainer}>
        <div
          className={leftPosStyles[focus]}
          style={{ 'background-color': leftColormap[2] }}
        />
        <div
          className={leftPosStyles[focus]}
          style={{ 'background-color': leftColormap[1] }}
        />
        <div
          className={leftPosStyles[focus]}
          style={{ 'background-color': leftColormap[0] }}
        />
      </div>
      <div className={styles.rightcontainer}>
        <div
          className={rightPosStyles[focus]}
          style={{ 'background-color': rightColormap[0] }}
        />
        <div
          className={rightPosStyles[focus]}
          style={{ 'background-color': rightColormap[1] }}
        />
        <div
          className={rightPosStyles[focus]}
          style={{ 'background-color': rightColormap[2] }}
        />
      </div>
    </div>
  );
}
