const express = require('express');
const routes = require('./routes')
const debug = require('debug')('invoice-app');

const app = express();
debug('app initialized')

// TODO: middleware

app.get('/', (req, res) => {
    res.send('ok!');
});


app.use('/', routes);

app.listen(3000, () => console.log('ok!!!'))