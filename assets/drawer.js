import { CustomComponentMixin, defineComponent } from "./component.js";

export class Drawer extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.name = this.parsedData.name;
    this.active = this.parsedData.active;
  }

  connectedCallback() {
    globalThis.subscribe(`button:click:open-drawer:${this.name}`, this.handleOpen.bind(this));
    globalThis.subscribe(`button:click:close-drawer:${this.name}`, this.handleClose.bind(this));

    globalThis.subscribe("backdrop:click", this.handleBackdropClick.bind(this));

    this.subscribe("button:click:close", this.handleClose.bind(this));

    if (this.active) {
      this.publish("drawer:open");
    }
  }

  disconnectedCallback() {
    globalThis.unsubscribe(`button:click:open-drawer:${this.name}`, this.handleOpen.bind(this));
    globalThis.unsubscribe(`button:click:close-drawer:${this.name}`, this.handleClose.bind(this));

    globalThis.unsubscribe("backdrop:click", this.handleBackdropClick.bind(this));

    this.unsubscribe("button:click:close", this.handleClose.bind(this));
  }

  handleBackdropClick() {
    this.close();
  }

  handleOpen() {
    this.open();
  }

  handleClose() {
    this.close();
  }

  open() {
    this.classList.add("Drawer--Active");

    this.publish("drawer:open");
  }

  close() {
    this.classList.remove("Drawer--Active");

    this.publish("drawer:close");
  }
}

defineComponent("drawer-component", Drawer, "aside");
