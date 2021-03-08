import styles from './background.module.css';

export default function Background({ focus }) {
  const colormap = [{ left: '#E7475E', right: '#E6E6E6', card: '#F0D879' },
    { left: '#587498', right: '#587058', card: '#E86850' },
    { left: '#20938b', right: '#f3cc6f', card: '#de7921' }];
  const leftPosStyles = [styles.left_pos_0, styles.left_pos_1,
    styles.left_pos_2, styles.left_pos_3];
  const rightPosStyles = [styles.right_pos_0, styles.right_pos_1,
    styles.right_pos_2, styles.right_pos_3];
  return (
    <div className="w-full h-full fixed flex z-bottom">
      <div className={styles.leftcontainer}>
        <div className={`${styles.left_2} ${leftPosStyles[focus]}`} />
        <div className={`${styles.left_1} ${leftPosStyles[focus]}`} />
        <div className={`${styles.left_0} ${leftPosStyles[focus]}`} />
      </div>
      <div className={styles.rightcontainer}>
        <div className={`${styles.right_0} ${rightPosStyles[focus]}`} />
        <div className={`${styles.right_1} ${rightPosStyles[focus]}`} />
        <div className={`${styles.right_2} ${rightPosStyles[focus]}`} />
      </div>
    </div>
  );
}
