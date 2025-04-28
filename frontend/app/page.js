import styles from './page.module.css';
import MainPage from './Pages/MainPage';
export default function Home() {
  return (
    <div className={styles.page}>
      {/*edit page.module.css to change general styles for webpage */}
      <main className={styles.main}>
        <MainPage />
      </main>
    </div>
  );
}
