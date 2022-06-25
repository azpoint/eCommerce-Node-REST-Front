class ProductHandlerMySQL {
    constructor (initSetup, table) {
        this.knex = require('knex')( initSetup );
        this.table = table;
    }

    getAll() {
        return this.knex
        .from(this.table).select('*')
        .then( resp => {
            return resp
        })

    }
    
    getById(id) {
        return this.knex
        .from(this.table).select('*').where('id', id)
        .then( resp => {
            return resp
        })
    }

    addProduct(productToAdd) {
        return this.knex(this.table)
        .insert(productToAdd)
        .then( newId => {
            return this.knex.select('*').from(this.table).where('id', newId)
            .then( resp => {
                return resp
            })
        })
    }

    updateProduct(id, productUpdate) {
        return this.knex
        .from(this.table).where('id', id)
        .update(productUpdate)
        .then( resp => {
            if (resp == 1) {
                return this.knex.select('*').from(this.table).where('id', id)
                .then( resp => {
                    return resp
                })
            } else {
                return resp
            }
        })
    }

    
    deleteById(id) {
        return this.knex
        .from(this.table).where('id', id).del()
        .then( resp => {
            return resp
        })
    }

}

module.exports = ProductHandlerMySQL