import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import cls from 'classnames';
import useSWR from 'swr';

import styles from '@/styles/coffee-store.module.css';

import { fetchCoffeeStores } from '@/lib/coffee-stores';
import { useStore } from '@/store/store-context';
import { fetcher } from '@/utils';

export default function CoffeeStore(props) {
  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore);
  const [votingCount, setVotingCount] = useState(props.coffeeStore?.voting || 0);

  const {
    state: { coffeeStores },
  } = useStore();

  const router = useRouter();
  const id = router.query?.id;

  const { data } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data?.[0]) {
      const store = data[0];
      setVotingCount(store.voting);
      if (!coffeeStore) {
        setCoffeeStore(store);
        setVotingCount(store.voting);
      }
    }
  }, [coffeeStore, data]);

  useEffect(() => {
    if (props.coffeeStore) {
      createCoffeeStore(props.coffeeStore);
      return;
    }
    if (coffeeStores) {
      const store = coffeeStores?.find((item) => item.id.toString() === id);
      setCoffeeStore(store);
      setVotingCount(store.voting);
      createCoffeeStore(store);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const createCoffeeStore = async (store) => {
    try {
      const { id, name, address, neighbourhood, imgUrl, voting } = store;
      let res = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          address,
          neighbourhood,
          imgUrl,
          voting,
        }),
      });
      res = await res.json();
    } catch (err) {}
  };

  const handleUpvoteButton = async () => {
    let count = votingCount + 1;
    setVotingCount(count);

    try {
      const response = await fetch('/api/favouriteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStores = await response.json();
    } catch (err) {
      console.error('Error upvoting the coffee store', err);
    }
  };
  const { name, address, neighbourhood, imgUrl } = coffeeStore || {};

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name || 'img'}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/places.svg" width="24" height="24" alt="places icon" />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width="24" height="24" alt="near me icon" />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" alt="star icon" />
            <p className={styles.text}>{votingCount || 0}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  const params = context.params;
  const coffeeStores = await fetchCoffeeStores();
  const store = coffeeStores.find((item) => item.id.toString() === params.id);
  return {
    props: {
      coffeeStore: store || null,
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((item) => {
    return {
      params: {
        id: item.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}
