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

  get toasterElement() {
    return this.querySelector(".Toaster");
  }
}

defineComponent("toaster-component", Toaster);
