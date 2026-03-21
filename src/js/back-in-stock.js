import { sleep } from "./utils";

class BackInStock {
  constructor() {}

  handleBisSubscribe(event) {
    const { productId, variantId, email } = event.detail;

    this.subscribe(productId, variantId, email);
  }

  async subscribe(productId, variantId, email) {
    // ! INFO: This is a placeholder for the actual subscription logic, which would typically involve making an API
    // ! call to your backend to save the subscription details.
    // ! The sleep function is used here to simulate an asynchronous operation.
    await sleep();

    return {
      success: true,
    };
  }
}

export const backInStock = new BackInStock();
