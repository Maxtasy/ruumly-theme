import { sleep } from "./utils";

class BackInStock {
  constructor() {}

  handleBisSubscribe(event) {
    const { productId, variantId, email } = event.detail;

    this.subscribe(productId, variantId, email);
  }

  async subscribe(productId, variantId, email) {
    await sleep();

    return {
      success: true,
    };
  }
}

export const backInStock = new BackInStock();
