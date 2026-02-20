import { CustomComponentMixin, defineComponent } from "./component.js";

export class DropdownContent extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.handle = this.parsedData.handle;

    this.handleWindowClick = this.handleWindowClick.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe("click", this.handleWindowClick);
  }

  disconnectedCallback() {
    globalThis.unsubscribe("click", this.handleWindowClick);
  }

  show() {
    this.classList.add("DropdownContent--Active");
  }

  hide() {
    this.classList.remove("DropdownContent--Active");
  }

  handleWindowClick(event) {
    if (this.connectedTriggerElement?.contains(event.target)) return;
    if (this.contains(event.target)) return;

    this.connectedTriggerElement?.setInactive();
    this.hide();
  }

  get connectedTriggerElement() {
    return document.querySelector(`.DropdownTrigger[data-handle="${this.handle}"]`);
  }
}

defineComponent("dropdown-content-component", DropdownContent, "div");
