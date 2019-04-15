const express = require('express');
const routes = require('./routes')
const cors = require('cors')
const debug = require('debug')('invoice-app');

// TODO: add morgan

const app = express();
debug('app initialized')

const corsOptions = {
    origin: 'http://localhost:8080'
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({  extended: false }))

// app.get('/', (req, res) => {
//     res.send('ok!');
// });

app.use('/api', routes);

app.listen(3000, () => console.log('ok!!!'))