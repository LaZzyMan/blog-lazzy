import styles from './loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loader}>
      <span className={styles.loaderBlock} />
      <span className={styles.loaderBlock} />
      <span className={styles.loaderBlock} />
      <span className={styles.loaderBlock} />
      <span className={styles.loaderBlock} />
      <span className={styles.loaderBlock} />
      <span className={styles.loaderBlock} />
      <span className={styles.loaderBlock} />
      <span className={styles.loaderBlock} />
    </div>
  );
}
