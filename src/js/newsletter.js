import { sleep } from "./utils.js";

export class Newsletter {
  async register(payload = {}) {
    await sleep(1000);

    return {
      success: true,
    };
  }
}
