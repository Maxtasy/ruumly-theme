// TODO: Use listeners
class Wishlist {
  constructor() {
    this.items = [];
    console.log("Wishlist initialized");
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(item) {
    this.items.filter((i) => {
      if (item.id === i.id) {
        return false;
      } else {
        return true;
      }
    });
  }
}

export const wishlist = new Wishlist();
