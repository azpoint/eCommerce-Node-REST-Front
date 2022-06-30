const initSetCart = {
    client: 'sqlite3',
    connection: { filename: './db/carts.sqlite'},
    useNullAsDefault: true
}

module.exports = { initSetCart }