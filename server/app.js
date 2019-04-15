const express = require('express');
const routes = require('./routes')
const cors = require('cors')
const debug = require('debug')('invoice-app');
const path = require('path')

const app = express();
debug('app initialized')

const corsOptions = {
    origin: 'http://localhost:8080'
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({  extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', routes);

// app.use('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(3000, () => console.log('ok!!!'))