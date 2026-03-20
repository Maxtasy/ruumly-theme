import { CustomComponentMixin, defineComponent } from "./component.js";

export class Toaster extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleToastClick = this.handleToastClick.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe("button:click:toast", this.handleToastClick);
  }

  disconnectedCallback() {
    globalThis.unsubscribe("button:click:toast", this.handleToastClick);
  }

  handleToastClick(data) {
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
  }

  get toastElement() {
    return this.querySelector("#toast");
  }
}

defineComponent("toaster-component", Toaster);
