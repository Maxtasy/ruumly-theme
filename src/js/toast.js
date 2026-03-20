import { CustomComponentMixin, defineComponent } from "./component.js";

export class Toast extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.lifetime = 5000;

    this.destroy = this.destroy.bind(this);
  }

  connectedCallback() {
    window.requestAnimationFrame(() => {
      this.classList.add("Toast--Toasted");
    });

    setTimeout(this.destroy, this.lifetime);

    this.subscribe("button:click:close", this.destroy);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:close", this.destroy);
  }

  destroy() {
    this.remove();
  }
}

defineComponent("toast-component", Toast);
