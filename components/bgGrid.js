export default function BgGrid() {
  return (
    <div className="w-full h-full fixed flex pl-bkl z-bottom">
      {Array.from({ length: 12 }, (v, k) => k).map(() => (
        <div className="h-full border-l border-r border-gray-400 mr-bkl w-bkw ease-linear duration-500 border-opacity-25" />
      ))}
    </div>
  );
}
