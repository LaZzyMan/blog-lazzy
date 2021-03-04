import Link from 'next/link';
import MenuBtn from './menuBtn';
import NavigationBar from './navigation';

export default function Header({
  name, description, focus, onNaviBarClick,
}) {
  return (
    <header className="flex flex-col">
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
        <span className="ml-bkl flex-col flex">
          <span className="text-content">{name}</span>
          <span className="text-content text-gray-500">{description}</span>
        </span>
        <MenuBtn />
      </section>
      <section className="mt-h10">
        <NavigationBar focus={focus} onNaviBarClick={onNaviBarClick} />
      </section>
    </header>
  );
}
