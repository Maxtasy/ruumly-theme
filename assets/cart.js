export class Cart {
  constructor() {
    this.addItems = this.addItems.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  async addItems(items) {
    if (!Array.isArray(items)) {
      throw new Error('Items must be an array');
    }

    items.forEach((item) => {
      if (typeof item !== 'object' || !item.id || !item.quantity) {
        throw new Error('Each item must be an object with id and quantity');
      }
    });

    const response = await fetch(window.routes.cart_add_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error('Failed to add items to cart');
    }

    const data = await response.json();
    console.log('Items added to cart:', data);
    return data;
  }

  async addItem(item) {
    if (typeof item !== 'object' || !item.id || !item.quantity) {
      throw new Error('Item must be an object with id and quantity');
    }

    const response = await fetch(window.routes.cart_add_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: [item] }),
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    const data = await response.json();
    console.log('Item added to cart:', data);
    return data;
  }
}

export const cart = new Cart();
