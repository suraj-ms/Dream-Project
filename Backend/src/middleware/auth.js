const { verifyAccessToken } = require('../utils/jwt');
const { User, Role, Permission } = require('../models');

// Middleware to check JWT access token from cookies
async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: 'No access token' });

    const payload = verifyAccessToken(token);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
}

// Role/permission based authorization middleware
function authorize(neededPermissions = []) {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
      const user = await User.findByPk(req.user.id, { include: Role });
      if (!user) return res.status(401).json({ message: 'User not found' });

      const roles = await user.getRoles({ include: Permission });
      const userPerms = new Set();
      for (const r of roles) {
        const perms = await r.getPermissions();
        perms.forEach(p => userPerms.add(p.name));
      }

      const hasAll = neededPermissions.every(p => userPerms.has(p));
      if (!hasAll) return res.status(403).json({ message: 'Forbidden' });
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { authenticate, authorize };