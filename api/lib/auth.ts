import { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email?: string;
  tier?: string;
}

/**
 * Extracts and verifies the JWT Bearer token from a request.
 * Returns the decoded payload on success, or sends an error response and returns null.
 */
export function verifyAuth(
  req: VercelRequest,
  res: VercelResponse,
  options?: { requiredTier?: string[] }
): JwtPayload | null {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ error: 'Server configuration error' });
    return null;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  const token = authHeader.substring(7);

  let decoded: JwtPayload;
  try {
    const verifyFunc = (jwt as any).default?.verify || (jwt as any).verify;
    if (typeof verifyFunc !== 'function') {
      throw new Error('JWT verify is not a function');
    }
    decoded = verifyFunc(token, jwtSecret) as JwtPayload;
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Invalid or expired token' });
    } else {
      res.status(500).json({ error: 'Authentication error' });
    }
    return null;
  }

  if (options?.requiredTier && !options.requiredTier.includes(decoded.tier || '')) {
    res.status(403).json({ error: 'Pro tier required' });
    return null;
  }

  return decoded;
}
