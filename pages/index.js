import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

import Banner from '@/components/Banner';
import Card from '@/components/Card';

import { fetchCoffeeStores } from '@/lib/coffee-stores';
import useTrackLocation from '@/hooks/use-track-location';
import { useStore, ACTION_TYPES } from '@/store/store-context';

export default function Home(props) {
  console.log('test 456');
  const { handleTrackLocation, latLong } = useTrackLocation();
  const [isLoading, setLoading] = useState(false);

  const { dispatch, state } = useStore();
  const coffeeStores = state.coffeeStores;

  const handleOnBannerClick = () => {
    setLoading(true);
    handleTrackLocation();
  };

  useEffect(() => {
    if (latLong) {
      const query = encodeURIComponent(latLong);
      fetch(`/api/getCoffeeStoresByLocation?latLong=${query}`)
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: res.data,
          });
          dispatch({
            type: ACTION_TYPES.SET_LAT_LONG,
            payload: latLong,
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latLong]);

  const items = coffeeStores || props?.coffeeStores || [];

  return (
    <>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText="View store nearby"
          handleOnClick={handleOnBannerClick}
          isLoading={isLoading}
        />
        <Image
          className={styles.heroImage}
          src="/static/hero-image.png"
          blurDataURL="/static/hero-image.png"
          width={700}
          height={400}
          alt="hero-image"
          placeholder="blur"
        />
        {items.length > 0 ? (
          <>
            <h2 className={styles.heading2}>
              {coffeeStores ? 'Stores next to me' : 'Some Stores bvb'}
            </h2>
            <div className={styles.cardLayout}>
              {items.map((item) => {
                return (
                  <Card
                    key={item.id}
                    name={item.name}
                    imgUrl={item.imgUrl}
                    href={`/coffee-store/${item.id}`}
                  />
                );
              })}
            </div>
          </>
        ) : null}
      </main>
    </>
  );
}

export async function getStaticProps() {
  let coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    },
  };
}
