import React, { useEffect } from 'react';
import { description, name } from '../lib/settings';
import { debounce } from '../lib/utils';
import Background from './background';
import BgGrid from './bgGrid';
import Header from './header';
import styles from './layout.module.css';

export default function Layout({
  home, children, focus, changeDisplay, changeFocus,
}) {
  const handleMouseWheel = (e) => {
    if (e.deltaY < 0 && focus > 0) {
      changeFocus(focus - 1);
    }
    if (e.deltaY > 0 && focus < 3) {
      changeFocus(focus + 1);
    }
  };
  useEffect(() => {
    const root = document.documentElement;
    root.addEventListener('mousemove', (e) => {
      root.style.setProperty('--mouse-x', `${e.clientX}px`);
      root.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
  }, []);
  return (
    <div
      onWheel={home ? (e) => debounce(handleMouseWheel, 200)(e) : null}
    >
      <div className={styles.mouse} />
      <Background focus={focus} home={home} />
      <BgGrid />
      <section
        className="ml-bkl mr-bklfixed pt-bkl"
      >
        <Header
          home={home}
          name={name}
          description={description}
          focus={focus}
          changeDisplay={changeDisplay}
          changeFocus={changeFocus}
        />
        {home && children}
      </section>
      <section
        className={styles.postSection}
        style={home ? { top: '-100vh' } : { top: '-5.5vw' }}
      >
        {!home && children }
      </section>
    </div>
  );
}
