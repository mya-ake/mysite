'use strict';

const express = require('express');
const { ENV } = require('./env.js');

let app = express();
app.use('/', express.static(`${__dirname}/../static`));

app.listen(ENV.LOCAL_SERVER.PORT, () => {
  console.info(`Open http://localhost:${ENV.LOCAL_SERVER.PORT}`);
});

