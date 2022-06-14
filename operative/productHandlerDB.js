const { initSetup } = require('../db/setup/dbSetup.js');
const knex = require('knex')( initSetup );

class Contenedor {
    constructor (productsInit) {
        this.arrayProducts = productsInit;
    }

    newProduct(addProduct, addPrice, addImgUrl) {

        let productToAdd = {
            title: addProduct,
            price: addPrice,
            thumbnail: addImgUrl,
            stock: Math.floor(Math.random() * 101)
        };

        knex('products')
            .insert(productToAdd)
            .then( () => console.log('Product Inserted'))
            .catch( error => console.log(error.message))
            .finally( () => knex.destroy())

        return productToAdd;
    }


    getById(idNumber) {
        if (this.arrayProducts[idNumber] > this.arrayProducts.length - 1) {
            return 'Producto no disponible'
        } else {
            return this.arrayProducts[idNumber];
        }
    }

    getAll() {
            knex
                .from('products')
                .select('*')
                .then( res => {
                    return res
                })
                .catch( error => console.log(error.message))
                .finally( () => knex.destroy())       
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