import { CustomComponentMixin, defineComponent } from "./component.js";

export class MegaMenu extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.handle = this.parsedData.handle;

    this.handleTriggerEnter = this.handleTriggerEnter.bind(this);
    this.handleTriggerLeave = this.handleTriggerLeave.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe(`mega-menu-trigger:mouse-enter:${this.handle}`, this.handleTriggerEnter);
    globalThis.subscribe(`mega-menu-trigger:mouse-leave:${this.handle}`, this.handleTriggerLeave);
  }

  disconnectedCallback() {
    globalThis.unsubscribe(`mega-menu-trigger:mouse-enter:${this.handle}`, this.handleTriggerEnter);
    globalThis.unsubscribe(`mega-menu-trigger:mouse-leave:${this.handle}`, this.handleTriggerLeave);
  }

  handleTriggerEnter() {
    this.show();
  }

  handleTriggerLeave() {
    // TODO: implement timeout
    this.hide();
  }

  show() {
    this.classList.add("MegaMenu--Active");
  }

  hide() {
    this.classList.remove("MegaMenu--Active");
  }
}

defineComponent("mega-menu-component", MegaMenu, "div");
