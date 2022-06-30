class CartModel {
    constructor(initSetCart, table) {
        this.knex = require ('knex')( initSetCart )
        this.table = table
    }

    newCart() {
        return this.knex.schema
        .createTable(this.table, table => {
            table.string('productId')
            table.integer('qty', 99)
        })
        .then( _ => {
            return 'Cart Table Created'
        })
        .catch( err => {
            return err
        })
    }

    addProduct(productToAdd) {
        return this.knex(this.table)
        .insert(productToAdd)
        .then( resp => {
            return resp
        })
        .catch( err => {
            return err
        })
    }

    addQty(id) {
        return this.knex(this.table)
        .where( { productId: id}).increment('qty', 1)
        .then( resp => {
            return resp
        }).catch( err => { return err})
    }

    show() {
        return this.knex.from(this.table).select('*')
        .then( resp => {
            return resp
        })
        .catch( err => {
            return err
        })
    }

    deleteById(idd) {
        return this.knex(this.table).where({ productId: idd }).del()
        .then( resp => {
            return resp
        })
        .catch( err => {
            return err
        })
    }
}

module.exports = CartModel