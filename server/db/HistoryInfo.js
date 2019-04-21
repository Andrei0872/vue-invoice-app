module.exports = {
    fields: [
        'id int(8) auto_increment primary key',
        'message tinytext not null',
        'entity varchar(20) not null',
        'action_type varchar(20) not null',
        'prev_state varchar(300)',
        'current_state varchar(300)',
        'additional_info varchar(300)',
        'inserted_date TIMESTAMP'
    ]
}