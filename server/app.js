const express = require('express');
const routes = require('./routes')
const cors = require('cors')
const debug = require('debug')('invoice-app');

const app = express();
debug('app initialized')

const corsOptions = {
    origin: 'http://localhost:8080'
}

// TODO: middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({  extended: false }))

app.get('/', (req, res) => {
    res.send('ok!');
});

// const data = require('./mock');

app.use('/', routes);

app.listen(3000, () => console.log('ok!!!'))