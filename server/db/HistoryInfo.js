module.exports = {
    fields: [
        'id int(8) auto_increment primary key',
        'message tinytext not null',
        'enitity varchar(20) not null',
        'inserted_date TIMESTAMP'
    ]
}