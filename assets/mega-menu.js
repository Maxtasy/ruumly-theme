import { CustomComponentMixin, defineComponent } from "./component.js";

export class MegaMenu extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.handle = this.parsedData.handle;
    this.timeout = null;

    this.handleTriggerEnter = this.handleTriggerEnter.bind(this);
    this.handleTriggerLeave = this.handleTriggerLeave.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe(`mega-menu-trigger:mouse-enter`, this.handleTriggerEnter);
    globalThis.subscribe(`mega-menu-trigger:mouse-leave:${this.handle}`, this.handleTriggerLeave);

    this.subscribe("mouseenter", this.handleMouseEnter);
    this.subscribe("mouseleave", this.handleMouseLeave);
  }

  disconnectedCallback() {
    globalThis.unsubscribe(`mega-menu-trigger:mouse-enter`, this.handleTriggerEnter);
    globalThis.unsubscribe(`mega-menu-trigger:mouse-leave:${this.handle}`, this.handleTriggerLeave);

    this.unsubscribe("mouseenter", this.handleMouseEnter);
    this.unsubscribe("mouseleave", this.handleMouseLeave);
  }

  handleTriggerEnter(data) {
    if (data.handle === this.handle) {
      this.show();
    } else {
      clearTimeout(this.timeout);
      this.hide();
    }
  }

  handleTriggerLeave() {
    this.timeout = setTimeout(() => {
      this.hide();
    }, 750);
  }

  handleMouseEnter() {
    clearTimeout(this.timeout);
  }

  handleMouseLeave() {
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
