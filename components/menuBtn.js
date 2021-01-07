import { useState } from 'react';
import styles from './menuBtn.module.css';

export default function MenuBtn() {
  const [mode, setMode] = useState(false);
  return (
    <div
      className={`${mode ? styles.triggered : styles.normal} ${styles.container}`}
      onClick={() => setMode(!mode)}
      onKeyDown={() => setMode(!mode)}
      role="button"
      tabIndex={0}
    >
      <span className={styles.line} />
    </div>
  );
}
