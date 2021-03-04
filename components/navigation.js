export default function NavigationBar({ focus, onNaviBarClick }) {
  const cols = ['HOME', 'LIFE', 'RESEARCH', 'DEVELOPMENT'];
  return (
    <span
      className="flex flex-row ml-bklw"
    >
      {
        cols.map((c, i) => (
          <div
            className="mr-bkl w-bk2wl flex flex-col outline-none"
            onClick={() => onNaviBarClick(i)}
            onKeyDown={() => onNaviBarClick(i)}
            role="button"
            tabIndex={0}
          >
            <span>{c}</span>
            {focus === i
              ? <span className="w-full h-line bg-black mt-h2" />
              : <span className="w-full h-line mt-h2 bg-gray-400" />}
          </div>
        ))
    }
    </span>
  );
}
