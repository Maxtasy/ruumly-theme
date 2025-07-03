import { cart } from './cart.js';

export class ProductForm extends HTMLFormElement {
  constructor() {
    super();

    this.items = [];
    this.sectionsToRerender = [];

    this.addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.items.length) {
      throw new Error('No items to add to cart');
    }

    const cartResponse = cart.addItems({ items: this.items, sections: this.sectionsToRerender });

    console.log(cartResponse);
  }
}

if (!customElements.get('product-form')) {
  customElements.define('product-form', ProductForm, { extends: 'form' });
}
