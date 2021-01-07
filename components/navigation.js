import { useState } from 'react';

export default function NavigationBar() {
  const [forcus, setForcus] = useState(0);
  const cols = ['HOME', 'LIFE', 'RESEARCH', 'DEVELOPMENT'];
  return (
    <span className="flex flex-row ml-bklw">
      {
        cols.map((c) => (
          <div className="mr-bkl w-bk2wl flex flex-col">
            <span>{c}</span>
            <span className="w-full h-line bg-black mt-h2" />
          </div>
        ))
    }
    </span>
  );
}
