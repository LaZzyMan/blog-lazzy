import React, { useState } from 'react';
import BgGrid from './bgGrid';
import Header from './header';

export const name = 'Seigo Natsume';
export const siteTitle = 'Blog of LaZzY';
export const description = '日々、私たちが過ごしている日常は、実は奇跡の連続なのかもしれない。';

export default function Layout({ children }) {
  const [focus, setFocus] = useState(0);
  const handleNaviBarClick = (i) => {
    setFocus(i);
  };
  return (
    <>
      <BgGrid />
      <div
        className="mx-bkl pt-bkl"
        onWheel={(e) => {
          if (e.deltaY < 0 && focus > 0) {
            setFocus(focus - 1);
          }
          if (e.deltaY > 0 && focus < 3) {
            setFocus(focus + 1);
          }
        }}
      >
        <Header
          name={name}
          description={description}
          focus={focus}
          onNaviBarClick={handleNaviBarClick}
        />
        <main>{children}</main>
      </div>
    </>
  );
}
