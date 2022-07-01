class CartModel {
    constructor(db, model) {
        this.db = db
        this.model = model
    }

    addProduct(productToAdd) {
        return this.db.then( _ => this.model.create(productToAdd))
        .then( resp => { return resp})
    }

    addQty(id) {
        return this.db.then( _ => this.model.findOneAndUpdate({ product_Id: id}, {$inc: { qty: 1}}))
        .then( resp => { return resp })
    }

    itemCheck(id) {
        return this.db.then( _ => this.model.where({ product_Id: id}).count())
        .then( resp => { return resp })
    }

    getAllCart() {
        return this.db.then( _ => this.model.find())
        .then( resp => {
            return resp
        })
    }

    deleteById(id) {
        return this.db.then( _ => this.model.deleteOne({ product_Id: id}))
        .then(resp => { return resp })
    }
}

module.exports = CartModel