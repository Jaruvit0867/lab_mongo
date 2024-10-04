import { dbConnect } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const db = await dbConnect();
    if (db.connection.readyState === 1) {
      res.status(200).json({ message: 'Successfully connected to MongoDB' });
    } else {
      res.status(500).json({ message: 'Failed to connect to MongoDB' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Connection error', error: error.message });
  }
}