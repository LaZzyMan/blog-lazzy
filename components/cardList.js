import Link from 'next/link';

export default function CardList({ data }) {
  return (
    <div className="flex w-full overflow-hidden">
      {data.map(({
        id, date, title, tags,
      }) => (
        <Link href={`/posts/${id}`}>
          <div className="text-white mr-bkl flex flex-col justify-between h-hcard bg-card-cover">
            <div className="absolute z-bottom w-bk2wl">
              <img src="/冰菓/01.jpg" alt={title} className="w-auto max-w-full h-hcard object-cover" />
            </div>
            <span className="w-bk2wl text-2xl pl-w1 pr-w1 mt-h5">{title}</span>
            <div className="flex flex-row mb-h2 w-bk2wl justify-between pr-w1">
              <span className="pl-w1 text-right pr-w1">{tags}</span>
              <div className="flex flex-col text-gray-400">
                <span className="text-right text-xs">{date.split(' ')[1]}</span>
                <span className="text-right text-xs">{date.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
