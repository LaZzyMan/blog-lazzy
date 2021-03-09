import styles from './hello.module.css';

export default function Hello({
  mood1, mood2, mood3, onClickDown,
}) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-title">{mood1}</span>
      <div className="mt-h10">
        <span className="text-gray-500 text-title">{mood2}</span>
        <span className="text-black text-title">{mood3}</span>
      </div>
      <div
        className="flex justify-center mt-h10 outline-none"
        onClick={() => onClickDown(1)}
        onKeyDown={() => onClickDown(1)}
        tabIndex={0}
        role="button"
      >
        <svg className={styles.scrolldown} t="1614867424746" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1828" width="128" height="128"><path d="M517.2736 654.2336L860.672 311.296a35.328 35.328 0 0 1 50.688 0.6144 37.1712 37.1712 0 0 1-0.6144 51.8144l-368.7936 368.2816a35.328 35.328 0 0 1-50.432-0.3072L112.896 344.064a37.2224 37.2224 0 0 1 0-51.712 35.328 35.328 0 0 1 50.688 0l353.6896 361.8816z" fill="#a0aec0" p-id="1829" /></svg>
      </div>
    </div>
  );
}
