const morgan = require('morgan');


module.exports = function setupLogger(app) {
app.use(morgan('combined'));
};