/* eslint-disable camelcase */
require('dotenv').config()
module.exports.up = async function(pgm) {
    pgm.createTable('orders', {
        id: 'id',
        veggie: { type: 'string', notNull: true },
        count: { type: 'integer', notNull: true},
        address: { type: 'string', notNull: true},
    })
}

module.exports.down = async function(pgm) {
    pgm.dropTable('orders')
}