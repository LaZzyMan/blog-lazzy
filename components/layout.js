import React from 'react';
import BgGrid from './bgGrid';
import Header from './header';

const name = 'Seigo Natsume';
const description = '日々、私たちが過ごしている日常は、実は奇跡の連続なのかもしれない。';

export default function Layout({
  home, children, onNaviBarClick, focus, naviProgress,
}) {
  return (
    <>
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
        />
        {children}
      </div>
    </>
  );
}
