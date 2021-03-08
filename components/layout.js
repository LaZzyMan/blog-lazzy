import React from 'react';
import BgGrid from './bgGrid';
import Header from './header';


const name = 'Seigo Natsume';
const description = '日々、私たちが過ごしている日常は、実は奇跡の連続なのかもしれない。';

export default function Layout({
  home, children, onNaviBarClick, focus,
}) {
  const colormap = [{ left: '#E7475E', right: '#E6E6E6', card: '#F0D879' },
    { left: '#587498', right: '#587058', card: '#E86850' },
    { left: '#20938b', right: '#f3cc6f', card: '#de7921' }];
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
        />
        {children}
      </div>
    </>
  );
}
