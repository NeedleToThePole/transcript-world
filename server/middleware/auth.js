import crypto from 'crypto';

const getSecret = () =>
    process.env.JWT_SECRET ||
    process.env.MONGODB_URI ||
    'rowsc-transcript-portal-fallback-secret-2026';

export function signToken(payload, expiresInMs = 12 * 60 * 60 * 1000) {
    const data = {
        ...payload,
        iat: Date.now(),
        exp: Date.now() + expiresInMs,
    };
    const encodedPayload = Buffer.from(JSON.stringify(data)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', getSecret())
        .update(encodedPayload)
        .digest('base64url');
    return `${encodedPayload}.${signature}`;
}

export function verifyToken(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto
        .createHmac('sha256', getSecret())
        .update(encodedPayload)
        .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return null;
    }

    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
        if (!payload.exp || Date.now() > payload.exp) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.slice(7).trim();
    const user = verifyToken(token);
    if (!user) {
        return res.status(401).json({ error: 'Invalid or expired session token' });
    }

    req.user = user;
    next();
}

export function requireAdmin(req, res, next) {
    requireAuth(req, res, () => {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Administrator access required' });
        }
        next();
    });
}
