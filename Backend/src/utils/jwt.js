const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;


function signAccessToken(payload) {
return jwt.sign(payload, ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' });
}


function signRefreshToken(payload) {
return jwt.sign(payload, REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
}


function verifyAccessToken(token) {
return jwt.verify(token, ACCESS_SECRET);
}


function verifyRefreshToken(token) {
return jwt.verify(token, REFRESH_SECRET);
}


module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };