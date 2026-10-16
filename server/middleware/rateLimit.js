const buckets = new Map();

// Clean up expired entries every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of buckets.entries()) {
        if (now > entry.resetAt) {
            buckets.delete(key);
        }
    }
}, 10 * 60 * 1000).unref();

export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 15, message = 'Too many requests, please try again later.' } = {}) {
    return (req, res, next) => {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip) || 'unknown';
        const key = `${req.baseUrl || ''}:${ip}`;
        const now = Date.now();

        let entry = buckets.get(key);
        if (!entry || now > entry.resetAt) {
            entry = { count: 0, resetAt: now + windowMs };
            buckets.set(key, entry);
        }

        entry.count += 1;
        if (entry.count > max) {
            return res.status(429).json({ error: message });
        }

        next();
    };
}
