import { fetchCoffeeStores } from '@/lib/coffee-stores';

export default async function handler(req, res) {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json({ data: response });
  } catch (err) {
    res.status(500);
    res.json({ message: 'Something went wrong' });
  }
}
