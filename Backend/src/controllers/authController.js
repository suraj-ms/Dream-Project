const bcrypt = require('bcryptjs');
const { User, RefreshToken } = require('../models');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: (process.env.COOKIE_SECURE === 'true'),
  sameSite: process.env.COOKIE_SAME_SITE || 'Lax',
  domain: process.env.COOKIE_DOMAIN || undefined,
};

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, password: hashed });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ message: 'Email already in use' });
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await RefreshToken.create({ token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) });

    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 3600 * 1000 });
    res.cookie('csrfToken', uuidv4(), { ...COOKIE_OPTIONS });

    res.json({ message: 'Logged in' });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const refresh = req.cookies?.refreshToken;
    const csrfHeader = req.get('x-csrf-token');
    const csrfCookie = req.cookies?.csrfToken;
    if (!refresh || !csrfHeader || csrfHeader !== csrfCookie) return res.status(401).json({ message: 'Invalid CSRF or refresh token' });

    const payload = verifyRefreshToken(refresh);
    const tokenRow = await RefreshToken.findOne({ where: { token: refresh } });
    if (!tokenRow) return res.status(401).json({ message: 'Refresh token not recognized' });

    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken(payload);
    await tokenRow.update({ token: newRefresh, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) });

    res.cookie('accessToken', newAccess, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', newRefresh, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 3600 * 1000 });
    res.cookie('csrfToken', uuidv4(), { ...COOKIE_OPTIONS });

    res.json({ message: 'Token refreshed' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}

async function logout(req, res, next) {
  try {
    const refresh = req.cookies?.refreshToken;
    if (refresh) await RefreshToken.destroy({ where: { token: refresh } });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('csrfToken');
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout };