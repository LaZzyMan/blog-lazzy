import Link from 'next/link';
import styles from './header.module.css';
import MenuBtn from './menuBtn';
import NavigationBar from './navigation';

export default function Header({
  name, description, focus, onNaviBarClick, home,
}) {
  return (
    <header className={styles.header}>
      <section className="flex felx-row items-center">
        <Link href="/">
          <a href="/" onClick={() => onNaviBarClick(0)}>
            <img
              src="/img/logo_black.png"
              className="w-bkw h-bkw"
              alt={name}
            />
          </a>
        </Link>
        {home && (
        <span className="ml-bkl flex-col flex">
          <span className="text-content font-bold">{name}</span>
          <span className="text-content text-gray-500">{description}</span>
        </span>
        )}

        <MenuBtn />
      </section>
      {home && (
      <section className="mt-h10">
        <NavigationBar focus={focus} onNaviBarClick={onNaviBarClick} />
      </section>
      )}
    </header>
  );
}
