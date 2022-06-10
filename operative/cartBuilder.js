const fs = require("fs");

const productList = JSON.parse(fs.readFileSync('./db/products.json'));

class NewCart {
    constructor() {
        this.cartList = []
    }

    newCart() {
        return this.cartList.push( { cartID : Math.floor(Math.random() * 21)})        
    }

    addProduct(idToAdd) {
        productList.find( obj => {
            if (obj.id == idToAdd) {
                this.cartList.push(obj);
            }
        })
    }

    show() {
        return this.cartList
    }

    deleteById(id) {
        this.cartList.find( (obj, i) => {
            if (obj.id == id) {
                this.cartList.splice(i, 1);
                return `product with the id: ${id}`
            }
        })
    }
}

module.exports = NewCart