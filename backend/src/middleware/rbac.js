export function checkRole(roles) {
  return (req, res, next) => {
    const userRoles = Array.isArray(roles) ? roles : [roles];
    const allowed = userRoles.map(r => String(r).toLowerCase());
    const userRole = req.user && req.user.role ? String(req.user.role).toLowerCase() : '';
    if (userRole && allowed.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
}