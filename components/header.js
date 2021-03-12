import styles from './header.module.css';
import MenuBtn from './menuBtn';
import NavigationBar from './navigation';

export default function Header({
  name, description, focus, onNaviBarClick, home, naviProgress, onHomeClick,
}) {
  return (
    <header className={styles.header}>
      <section className="flex felx-row items-center">

        <div
          className="outline-none"
          onClick={() => {
            if (home) {
              onNaviBarClick(0);
            } else {
              onHomeClick('home');
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
      </section>
      {home && (
      <section className="mt-h5">
        <NavigationBar focus={focus} onNaviBarClick={onNaviBarClick} progress={naviProgress} />
      </section>
      )}
    </header>
  );
}
