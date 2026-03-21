import { CustomComponentMixin, defineComponent } from "./component.js";
import { toastLifetime } from "./constants.js";
import { toPascalCase } from "./utils.js";

export class Toaster extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.activeToasts = [];

    this.handleToastClick = this.handleToastClick.bind(this);
    this.handleMaxQuantityError = this.handleMaxQuantityError.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe("button:click:toast", this.handleToastClick);
    globalThis.subscribe("quick-add:max-quantity-error", this.handleMaxQuantityError);
  }

  disconnectedCallback() {
    globalThis.unsubscribe("button:click:toast", this.handleToastClick);
    globalThis.unsubscribe("quick-add:max-quantity-error", this.handleMaxQuantityError);
  }

  handleToastClick(data) {
    if (this.activeToasts.includes(data.text)) return;

    this.toast(data.text, "success");

    if (data.url) {
      navigator.clipboard.writeText(data.url);
    }
  }

  handleMaxQuantityError(data) {
    this.toast(data.message, "critical");
  }

  toast(text, variant) {
    const newToastDocumentFragment = document.importNode(this.toastElement.content, true);

    const newToastElement = newToastDocumentFragment.querySelector(".Toast");

    if (variant) {
      newToastElement.classList.add(`Toast--${toPascalCase(variant)}`);
    }

    const textElement = newToastElement.querySelector(".Text");
    textElement.textContent = text;

    this.appendChild(newToastElement);

    this.activeToasts.push(text);

    setTimeout(() => {
      this.activeToasts = this.activeToasts.filter((toastText) => toastText !== text);
    }, toastLifetime);
  }

  get toastElement() {
    return this.querySelector("#toast");
  }
}

defineComponent("toaster-component", Toaster);
