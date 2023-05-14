// require('dotenv').config()


module.exports.up = async function(pgm) {
    pgm.createTable('vegetables', {
        id: 'id',
        name: { type: 'string', notNull: true, unique: true },
        color: { type: 'string', notNull: true},
        quantity: { type: 'integer', notNull: true},
    })
}

module.exports.down = async function(pgm) {
    pgm.dropTable('vegetables')
}