import Link from 'next/link';

export default function Main({ allPostsData }) {
  const mood_1 = 'and This is Me.';
  const mood_2 = 'There is Nothing Meaningful';
  const cols = ['HOME', 'LIFE', 'RESEARCH', 'DEVELOPMENT'];
  const blogClasses = ['Life', 'Research', 'Development'];
  const sections = blogClasses.map((c) => {
    const categoryPostsData = allPostsData.filter(({ category }) => (c === category));
    return (
      <>
        <h2 className={utilStyles.headingLg}>{c}</h2>
        <ul className={utilStyles.list}>
          {categoryPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a href={`/posts/${id}`}>
                  {title}
                </a>
              </Link>
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </>
    );
  });
  return (
    <section className="">
      {blogClasses.map((c) => {
        const categoryPostsData = allPostsData.filter(({ category }) => (c === category));
        return (
          <>
            <h2 className={utilStyles.headingLg}>{c}</h2>
            <ul className={utilStyles.list}>
              {categoryPostsData.map(({ id, date, title }) => (
                <li className={utilStyles.listItem} key={id}>
                  <Link href={`/posts/${id}`}>
                    <a href={`/posts/${id}`}>
                      {title}
                    </a>
                  </Link>
                  <small className={utilStyles.lightText}>
                    <Date dateString={date} />
                  </small>
                </li>
              ))}
            </ul>
          </>
        );
      })}
    </section>
  );
}
