class CartModel {
  constructor(db, model) {
    this.db = db;
    this.model = model;
  }

  addProduct(userId, productToAdd) {
    return this.db
      .then((_) =>
        this.model.findOneAndUpdate(
          { _id: userId },
          { $push: { cart: productToAdd } }
        )
      )
      .then((resp) => {
        return resp;
      });
  }

  addQty(userId, productId) {
    return this.db
      .then((_) => this.model.findOne({ _id: userId }))
      .then((resp) => {
        const index = resp.cart.findIndex((product) => {
          return product.product_Id === productId;
        });
        if (index !== -1) {
          resp.cart[index].qty += 1;
        }
        return resp.save();
      });
  }

  itemCheck(userId, productId) {
    return this.db
      .then((_) => this.model.findOne({ _id: userId }))
      .then((resp) => {
        return resp.cart.find((element) => {
          return element.product_Id === productId;
        });
      });
  }

  getAllCart(userId) {
    return this.db
      .then((_) => this.model.findOne({ _id: userId }))
      .then((resp) => {
        return resp.cart;
      });
  }

  deleteById(userId, id) {
    return this.db
      .then((_) => this.model.findOne({ _id: userId }))
      .then((resp) => {
        resp.cart = resp.cart.filter((product) => {
          return product.product_Id !== id;
        });
        return resp.save();
      });
  }
}

module.exports = CartModel;
