import { CustomComponentMixin, defineComponent } from "./component.js";

export class Toaster extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleShareClick = this.handleShareClick.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe("button:click:share", this.handleShareClick);
  }

  disconnectedCallback() {
    globalThis.unsubscribe("button:click:share", this.handleShareClick);
  }

  handleShareClick() {
    this.toasterElement.classList.toggle("Toaster--Toasted");
  }

  toast(variant, text) {}

  get toasterElement() {
    return this.querySelector(".Toaster");
  }

  get toastElement() {
    return this.querySelector("#toast");
  }
}

defineComponent("toaster-component", Toaster);
