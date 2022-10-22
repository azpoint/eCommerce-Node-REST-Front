class ProductHandlerMongo {
    constructor (db, model) {
        this.db = db;
        this.model = model
    }

    getAll() {
        return this.db
        .then( _ => this.model.find({}))
        .then( resp => { return resp })
    }
    
    getById(id) {
        return this.db.then( _ => this.model.find({ _id: id}))
        .then( resp => {
            return resp
        })
    }

    getMany(idArray) {
        return this.db.then( _ => this.model.find({'_id': { $in: idArray}}))
        .then( resp => { return resp})
    }

    addProduct(productToAdd) {
        return this.db.then( _ => this.model.create(productToAdd))
        .then( resp => {
            return resp
        })
    }

    updateProduct(id, productUpdate) {
        return this.db.then(_ => this.model.updateOne({ _id: id}, productUpdate)
        .then(resp => {
            return resp
        }))
    }

    getCategory(category) {
        return this.db.then( _ => this.model.find({'category': category }))
        .then( resp => {
            return resp
        })
    }
    
    deleteById(id) {
        return this.db.then( _ => this.model.deleteOne({ _id: id}))
        .then( resp => { return resp })
    }

}

module.exports = ProductHandlerMongo