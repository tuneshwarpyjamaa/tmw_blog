export function checkRole(roles) {
  return (req, res, next) => {
    const userRoles = Array.isArray(roles) ? roles : [roles];
    if (req.user && userRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
}