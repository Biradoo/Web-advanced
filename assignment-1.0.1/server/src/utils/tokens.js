const activeTokens = new Map();

export const addToken = (userId, token) => activeTokens.set(token, { userId, createdAt: Date.now() });

export const invalidateToken = (token) => activeTokens.delete(token);

export const validateToken = (token) => activeTokens.has(token);

export const clearExpiredTokens = (maxAge) => {
    const now = Date.now();
    for (const [token, { createdAt }] of activeTokens.entries()) {
        if (now - createdAt > maxAge) {
            activeTokens.delete(token);
        }
    }
};