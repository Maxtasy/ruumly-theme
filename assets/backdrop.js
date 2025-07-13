import { CustomComponentMixin, defineComponent } from "./component.js";

export class Backdrop extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleDrawerOpenEvent = this.handleDrawerOpenEvent.bind(this);
    this.handleDrawerCloseEvent = this.handleDrawerCloseEvent.bind(this);
  }

  connectedCallback() {
    this.addEventListener("click", this.handleClick);

    globalThis.subscribe("drawer:open", this.handleDrawerOpenEvent);
    globalThis.subscribe("drawer:close", this.handleDrawerCloseEvent);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);

    globalThis.unsubscribe("drawer:open", this.handleDrawerOpenEvent);
    globalThis.unsubscribe("drawer:close", this.handleDrawerCloseEvent);
  }

  handleClick() {
    this.hide();

    this.publish("backdrop:click");
  }

  handleDrawerOpenEvent() {
    this.show();
  }

  handleDrawerCloseEvent() {
    this.hide();
  }

  show() {
    this.classList.add("Backdrop--Active");

    window.requestAnimationFrame(() => {
      this.classList.add("Backdrop--Visible");
    });
  }

  hide() {
    this.classList.remove("Backdrop--Visible");

    window.requestAnimationFrame(() => {
      this.classList.remove("Backdrop--Active");
    });
  }
}

defineComponent("backdrop-component", Backdrop, "div");
