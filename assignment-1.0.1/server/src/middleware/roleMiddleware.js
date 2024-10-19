export const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        const { roles } = req.user;
        if (roles && roles.includes(requiredRole)) {
            return next();
        }
        return res.status(403).json({ message: `Access denied. Requires ${requiredRole} role.` });
    };
};