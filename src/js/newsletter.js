import { sleep } from "./utils";

class Newsletter {
  constructor() {}

  handleNewsletterRegister(event) {
    const { email } = event.detail;

    this.register(email);
  }

  async register(email) {
    // ! INFO: This is a placeholder for the actual register logic, which would typically involve making an API
    // ! call to your backend to save the register details.
    // ! The sleep function is used here to simulate an asynchronous operation.
    await sleep();

    return {
      success: true,
    };
  }
}

export const newsletter = new Newsletter();
