import styles from './header.module.css';
import MenuBtn from './menuBtn';

export default function Header({
  name, description, focus, changeFocus, home, changeDisplay,
}) {
  return (
    <header className={styles.header}>
      <div
        className="outline-none"
        style={{ pointerEvents: focus === 0 ? 'none' : 'auto' }}
        onClick={() => {
          if (home) {
            changeFocus(0);
          } else {
            changeDisplay('home');
          }
        }}
        role="button"
        tabIndex={0}
      >
        <img
          src={(focus === 0) && (home)
            ? '/img/logo_black.png'
            : '/img/logo_white.png'}
          className="w-bkw h-bkw"
          alt={name}
        />
      </div>
      <span className={`ml-bkl transition-all duration-500 ease-out flex-col flex ${focus !== 0 && 'text-white'} ${!home && 'opacity-0'}`}>
        <span className="text-content font-bold">{name}</span>
        <span className="text-content text-gray-500 text-opacity-75">{description}</span>
      </span>
      <MenuBtn focus={home ? focus : 1} />
    </header>
  );
}
