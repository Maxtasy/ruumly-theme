import { CustomComponentMixin, defineComponent } from "./component.js";
import { toastLifetime } from "./constants.js";

export class Toaster extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.activeToasts = [];

    this.handleToastClick = this.handleToastClick.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe("button:click:toast", this.handleToastClick);
  }

  disconnectedCallback() {
    globalThis.unsubscribe("button:click:toast", this.handleToastClick);
  }

  handleToastClick(data) {
    if (this.activeToasts.includes(data.text)) return;

    this.toast(data.text);

    if (data.url) {
      navigator.clipboard.writeText(data.url);
    }
  }

  toast(text) {
    const newToastElement = document.importNode(this.toastElement.content, true);

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
