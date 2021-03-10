import { useState } from 'react';
import styles from './menuBtn.module.css';

export default function MenuBtn({ focus }) {
  const [mode, setMode] = useState(false);
  return (
    <div
      className={`${mode ? styles.triggered : styles.normal} ${styles.container} ${focus === 0 ? styles.dark : styles.white}`}
      onClick={() => setMode(!mode)}
      role="button"
      tabIndex={0}
    >
      <span className={styles.line} />
    </div>
  );
}
