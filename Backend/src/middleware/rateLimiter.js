const rateLimit = require('express-rate-limit');


function createRateLimiter() {
const windowMs = (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15')) * 60 * 1000;
const max = parseInt(process.env.RATE_LIMIT_MAX || '100');


return rateLimit({
windowMs,
max,
standardHeaders: true,
legacyHeaders: false,
message: 'Too many requests from this IP, please try again later.'
});
}


module.exports = createRateLimiter;