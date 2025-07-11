import { CustomComponentMixin, defineComponent } from "./component.js";

export class Drawer extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.name = this.parsedData.name;
    this.active = this.parsedData.active;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe(`button:click:open-drawer:${this.name}`, this.handleOpen);
    globalThis.subscribe(`button:click:close-drawer:${this.name}`, this.handleClose);

    globalThis.subscribe("backdrop:click", this.handleBackdropClick);

    this.subscribe("button:click:close", this.handleClose);

    if (this.active) {
      this.publish("drawer:open");
    }
  }

  disconnectedCallback() {
    globalThis.unsubscribe(`button:click:open-drawer:${this.name}`, this.handleOpen);
    globalThis.unsubscribe(`button:click:close-drawer:${this.name}`, this.handleClose);

    globalThis.unsubscribe("backdrop:click", this.handleBackdropClick);

    this.unsubscribe("button:click:close", this.handleClose);
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
