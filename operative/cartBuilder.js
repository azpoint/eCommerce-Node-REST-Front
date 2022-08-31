class CartModel {
    constructor(db, model) {
        this.db = db
        this.model = model
    }

    addProduct(userId, productToAdd) {
        return this.db.then( _ => this.model.findOneAndUpdate({ _id: userId }, { $push: { cart: productToAdd }}))
        .then( resp => { return resp})
    }

    addQty(id) {
        return this.db.then( _ => this.model.findOneAndUpdate({ product_Id: id}, {$inc: { qty: 1}}))
        .then( resp => { return resp })
    }

    itemCheck(userId, productId) {
        return this.db.then( _ => this.model.findOne({ _id: userId}))
        .then( resp => {
           return resp.cart.find(element => { return element.product_Id === productId})
        })
    }

    getAllCart(userId) {
        return this.db.then( _ => this.model.findOne({ _id: userId}))
        .then( resp => {
            return resp.cart
        })
    }

    deleteById(userId, id) {
        return this.db.then( _ => this.model.find({ _id: userId }))
        .then(resp => { return resp })
    }
}

module.exports = CartModel