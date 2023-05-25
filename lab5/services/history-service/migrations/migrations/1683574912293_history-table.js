module.exports.up = async function(pgm) {
    pgm.createTable('history', {
        id: 'id',
        json: { type: 'string', notNull: true },
        date: { type: 'string', notNull: true }
        
    })
}

module.exports.down = async function(pgm) {
    pgm.dropTable('history')
}