const Database = require('./Database');

const subClasses = ['Provider', 'Product'];

module.exports = new Database(subClasses);