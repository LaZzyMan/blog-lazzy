import React, { useEffect } from 'react';
import Background from './background';
import BgGrid from './bgGrid';
import Header from './header';
import styles from './layout.module.css';

const name = 'Seigo Natsume';
const description = '日々、私たちが過ごしている日常は、実は奇跡の連続なのかもしれない。';

export default function Layout({
  home, children, onNaviBarClick, focus, naviProgress, category, onHomeClick,
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.addEventListener('mousemove', (e) => {
      root.style.setProperty('--mouse-x', `${e.clientX}px`);
      root.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
  }, []);
  return (
    <div
      onWheel={home
        ? (e) => {
          if (e.deltaY < 0 && focus > 0) {
            onNaviBarClick(focus - 1);
          }
          if (e.deltaY > 0 && focus < 3) {
            onNaviBarClick(focus + 1);
          }
        }
        : () => {}}
    >
      <div className={styles.mouse} />
      <Background focus={focus} home={home} category={category} />
      <BgGrid />
      <div
        className="ml-bkl mr-bklfixed pt-bkl"
      >
        <Header
          home={home}
          name={name}
          description={description}
          focus={focus}
          onNaviBarClick={onNaviBarClick}
          naviProgress={naviProgress}
          onHomeClick={onHomeClick}
        />
        {children}
      </div>
    </div>
  );
}
