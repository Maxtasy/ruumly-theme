export class Cart {
  constructor() {
    this.addItems = this.addItems.bind(this);
    this.addItem = this.addItem.bind(this);
    this.clear = this.clear.bind(this);
  }

  async addItems(items) {
    if (!Array.isArray(items)) {
      throw new Error("Items must be an array");
    }

    items.forEach((item) => {
      if (typeof item !== "object" || !item.id || !item.quantity) {
        throw new Error("Each item must be an object with id and quantity");
      }
    });

    const response = await fetch(window.routes.cart_add_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error("Failed to add items to cart");
    }

    const data = await response.json();

    return data;
  }

  async addItem({ item, sections }) {
    if (typeof item !== "object" || !item.id || !item.quantity) {
      throw new Error("Item must be an object with id and quantity");
    }

    const response = await fetch(`${window.routes.cartAddUrl}.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: [item], sections }),
    });

    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }

    const data = await response.json();

    return data;
  }

  async update({ updates, sections }) {
    const response = await fetch(`${window.routes.cartUpdateUrl}.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updates, sections }),
    });

    if (!response.ok) {
      throw new Error("Failed to update cart");
    }

    return response.json();
  }

  async clear({ sections }) {
    const response = await fetch(`${window.routes.cartClearUrl}.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sections }),
    });

    if (!response.ok) {
      throw new Error("Failed to clear cart");
    }

    return response.json();
  }
}

export const cart = new Cart();
