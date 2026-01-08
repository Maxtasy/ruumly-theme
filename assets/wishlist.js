// TODO: Add wishlist buttons component that handles state of wishlist buttons (wishlist module loops over all these elements and sets state)
// TODO: Render products in wishlist section
class Wishlist {
  constructor() {
    this.items = this.getLocalStorage();

    this.setWishlistButtonStates();

    document.addEventListener("button:click:wishlist:add", this.handleWishlistAdd.bind(this));
    document.addEventListener("button:click:wishlist:remove", this.handleWishlistRemove.bind(this));
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(item) {
    this.items = this.items.filter((i) => {
      if (item.productId === i.productId) {
        return false;
      } else {
        return true;
      }
    });
  }

  handleWishlistAdd(event) {
    const item = event.detail;

    if (this.items.find((i) => i.productId === item.productId)) return;

    this.addItem(item);
    this.setLocalStrorage();
  }

  handleWishlistRemove(event) {
    const item = event.detail;

    if (this.items.length < 1) return;

    if (this.items.find((i) => i.productId === item.productId)) {
      this.removeItem(item);
      this.setLocalStrorage();
    }
  }

  setLocalStrorage() {
    localStorage.setItem("wishlist", JSON.stringify(this.items));
  }

  getLocalStorage() {
    const wishlistDataRaw = localStorage.getItem("wishlist");

    return wishlistDataRaw ? JSON.parse(wishlistDataRaw) : [];
  }

  setWishlistButtonStates() {
    const wishlistButtonElements = document.querySelectorAll(".WishlistButtons");

    wishlistButtonElements.forEach((wishlistButtonElement) => {
      console.log(wishlistButtonElement.productId);
      // TODO Handle hierarchy issue
    });
  }
}

export const wishlist = new Wishlist();
