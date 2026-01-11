class Wishlist {
  constructor() {
    this.items = this.getLocalStorage();

    document.addEventListener("button:click:wishlist:add", this.handleWishlistAdd.bind(this));
    document.addEventListener("button:click:wishlist:remove", this.handleWishlistRemove.bind(this));

    window.wishlist = this;
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
    this.publishEvent();
  }

  handleWishlistRemove(event) {
    const item = event.detail;

    if (this.items.length < 1) return;

    if (this.items.find((i) => i.productId === item.productId)) {
      this.removeItem(item);
      this.setLocalStrorage();
      this.publishEvent();
    }
  }

  setLocalStrorage() {
    localStorage.setItem("wishlist", JSON.stringify(this.items));
  }

  getLocalStorage() {
    const wishlistDataRaw = localStorage.getItem("wishlist");

    return wishlistDataRaw ? JSON.parse(wishlistDataRaw) : [];
  }

  publishEvent() {
    globalThis.dispatchEvent(new CustomEvent("wishlist:update", { detail: this.items }));
  }
}

export const wishlist = new Wishlist();
