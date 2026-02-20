import { CustomComponentMixin, defineComponent } from "./component.js";

export class DropdownContent extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.handle = this.parsedData.handle;
    globalThis.subscribe("dropdown-trigger:click", this.handleClick);
  }

  disconnectedCallback() {
    globalThis.unsubscribe("dropdown-trigger:click", this.handleClick);
  }

  handleClick({ handle, active }) {
    if (handle === this.handle) {
      this.classList.toggle("DropdownContent--Active", active);
    }
  }
}

defineComponent("dropdown-content-component", DropdownContent, "div");
