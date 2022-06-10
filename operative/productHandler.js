const fs = require('fs');


class Contenedor {
    constructor (productsInit) {
        this.arrayProducts = productsInit;
    }

    newProduct(addProduct, addPrice, addImgUrl) {

        let newProduct = { title: addProduct, price: Number(addPrice), thumbnail: addImgUrl};
        let lastProduct = this.getLast()

        if (newProduct.title == lastProduct.title && newProduct.price == lastProduct.price) {
            return { Error: 'Producto ya fue agregado recientemente'}
        }
        
        this.arrayProducts.push(newProduct);
        this.idStarter();
        return this.getLast();
    }

    idStarter() {
        let i = 0;
        
        for (let obj of this.arrayProducts) {
            if (obj.id == undefined) {
                obj.id = i;
                i++;
            } else if (obj.id) {
                obj.id = i;
                i++;
            } else {
                obj.id = i;
                i++;
            }
        }
    }


    getById(idNumber) {
        if (this.arrayProducts[idNumber] > this.arrayProducts.length - 1) {
            return 'Producto no disponible'
        } else {
            return this.arrayProducts[idNumber];
        }
    }

    getAll() {
        return this.arrayProducts;
    }

    getLast() {
        return this.arrayProducts[this.arrayProducts.length - 1];
    }


    deleteById(idNumber) {
        this.arrayProducts.splice(idNumber, 1);
        this.idStarter();
        return { result: `Product with the ID ${idNumber} has been deleted.` };        
    }

    deleteAll() {
        this.arrayProducts = [];
    }

    exportProducts() {
        fs.promises.writeFile('./db/products.json', JSON.stringify(this.arrayProducts))
        .then( () => { console.log('Productos exportados a productos.json')})
        .catch( err => { console.error(err)})
    }
}

module.exports = Contenedor