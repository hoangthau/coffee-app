import styles from './Banner.module.css';

export default function Banner(props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffee stores!</p>
      <div className={styles.buttonWrapper}>
        <button disabled={props.isLoading} className={styles.button} onClick={props.handleOnClick}>
          {props.isLoading ? 'Loading...' : props.buttonText}
        </button>
      </div>
    </div>
  );
}
