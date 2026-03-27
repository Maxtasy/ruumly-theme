import { CustomComponentMixin, defineComponent } from "./component.js";

export class Backdrop extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    // Track open drawers to determine when to show/hide the backdrop. This allows multiple drawers to be open at once
    // without prematurely hiding the backdrop when one of them closes.
    this.openDrawers = [];

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

  handleDrawerOpenEvent(data) {
    this.show();

    const drawerName = data.name;

    if (drawerName && !this.openDrawers.includes(drawerName)) {
      this.openDrawers.push(drawerName);
    }
  }

  handleDrawerCloseEvent(data) {
    const drawerName = data.name;

    if (drawerName) {
      this.openDrawers = this.openDrawers.filter((name) => name !== drawerName);
    }

    if (this.openDrawers.length === 0) {
      this.hide();
    }
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

defineComponent("backdrop-component", Backdrop);
