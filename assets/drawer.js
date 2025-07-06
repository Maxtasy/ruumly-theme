import { CustomComponentMixin, defineComponent } from "./component.js";

export class Drawer extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.name = this.parsedData.name;
  }

  connectedCallback() {
    globalThis.subscribe(`button:click:open-drawer:${this.name}`, this.handleOpen.bind(this));
    globalThis.subscribe(`button:click:close-drawer:${this.name}`, this.handleClose.bind(this));

    this.subscribe("button:click:close", this.handleClose.bind(this));
  }

  handleOpen() {
    this.open();
  }

  handleClose() {
    this.close();
  }

  open() {
    this.classList.add("Drawer--Active");
  }

  close() {
    this.classList.remove("Drawer--Active");
  }
}

defineComponent("drawer-component", Drawer, "aside");
