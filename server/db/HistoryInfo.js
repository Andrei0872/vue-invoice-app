module.exports = {
    fields: [
        'id int(8) auto_increment primary key',
        'message tinytext not null',
        'entity varchar(20) not null',
        'action_type varchar(20) not null',
        'prev_state text',
        'current_state text',
        'additional_info text',
        'inserted_date TIMESTAMP'
    ]
}