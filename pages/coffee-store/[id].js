import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CoffeeStore() {
  const router = useRouter();

  console.log(router.query);

  return (
    <div>
      Coffee Store
      <Link href="/">Home</Link>
      <Link href="/coffee-store/two">Go to dynamic route</Link>
    </div>
  );
}
