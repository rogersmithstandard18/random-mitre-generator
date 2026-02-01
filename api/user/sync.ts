import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

interface UserData {
  cardHistory: unknown[];
  favorites: string[];
  showAdvanced: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const { cardHistory, favorites, showAdvanced } = req.body as UserData;

    // TODO: Save to your database
    // await db.users.update({
    //   where: { id: decoded.id },
    //   data: { cardHistory, favorites, showAdvanced }
    // });

    console.log(`Syncing data for user ${decoded.id}:`, {
      cardHistoryCount: cardHistory?.length,
      favoritesCount: favorites?.length,
      showAdvanced,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: 'Sync failed' });
  }
}
