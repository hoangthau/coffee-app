import Footer from '@/components/Footer';

import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {/* <Footer /> */}
    </>
  );
}
