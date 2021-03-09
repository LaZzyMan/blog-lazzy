import styles from './navigation.module.css';

export default function NavigationBar({ focus, onNaviBarClick }) {
  const cols = ['HOME', 'LIFE', 'RESEARCH', 'DEVELOPMENT'];
  const posMaps = [['0vw', '0vw', '0vw', '0vw'],
    ['0vw', '-16.2vw', '-16.2vw', '-32.4vw'],
    ['0vw', '-16.2vw', '-32.4vw', '-32.4vw'],
    ['0vw', '-16.2vw', '-32.4vw', '-48.6vw']];
  return (
    <span
      className={`${styles.navigationContainer}`}
    >
      {
        cols.map((c, i) => {
          const pos = { left: posMaps[focus][i] };
          return (
            <div
              className={`${styles.navigationButton} 
            ${((focus !== 0) && (focus !== i)) && styles.navigationButtonHidden}`}
              style={pos}
              onClick={focus === 0 ? (() => onNaviBarClick(i)) : null}
              onKeyDown={focus === 0 ? (() => onNaviBarClick(i)) : null}
              role="button"
              tabIndex={0}
            >
              <span className={`${focus === 0 ? 'text-black' : 'text-white'} ${styles.text}`}>{c}</span>
              { focus === i
                ? <span className={`w-half h-line z-10 ${focus === 0 ? 'bg-black' : 'bg-white'} ${styles.progress}`} />
                : <span className={styles.progress} />}
              <span className={`w-full h-line bg-gray-400 ${styles.back}`} />
            </div>
          );
        })
    }
    </span>
  );
}
