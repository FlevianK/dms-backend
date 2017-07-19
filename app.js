const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const env = process.env.NODE_ENV;

// Set up the express app
const port = process.env.PORT || 3000;
const app = express();

if (env !== 'production') {
  require('dotenv').load();
}
// const compiler = webpack(config);
app.set('port', port);
// Log requests to the console.
app.use(logger('dev'));
app.use(cors());

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./server/routes/route')(app);

app.listen(port);
module.exports = app;
