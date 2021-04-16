import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [curDisplay, setCurDisplay] = useState('home');
  const [focus, setFocus] = useState(0);
  const router = useRouter();
  const handleDisplayChange = (id) => {
    setCurDisplay(id);
    if (id === 'home') {
      router.push('/');
    } else {
      router.push(`/post/${id}`);
    }
  };
  useEffect(() => {
    if (curDisplay === 'home') {
      router.push('/');
    } else {
      router.push(`/post/${curDisplay}`);
    }
  }, [curDisplay]);
  return (
    <Layout
      home={curDisplay === 'home'}
      focus={focus}
      changeDisplay={handleDisplayChange}
      changeFocus={setFocus}
    >
      <Component
        {...pageProps}
        focus={focus}
        home={curDisplay === 'home'}
        changeFocus={setFocus}
        changeDisplay={setCurDisplay}
      />
    </Layout>
  );
}

export default MyApp;
