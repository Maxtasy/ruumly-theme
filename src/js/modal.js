import { CustomComponentMixin, defineComponent } from "./component.js";

class Modal extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.name = this.parsedData.name;
    this.mousedownInsideDialog = false;

    this.handleOpenEvent = this.handleOpenEvent.bind(this);
    this.handleCloseEvent = this.handleCloseEvent.bind(this);
    this.handleClickEvent = this.handleClickEvent.bind(this);
    this.handleMousedownEvent = this.handleMousedownEvent.bind(this);

    this.isClickOutside = this.isClickOutside.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe(`button:click:open-modal:${this.name}`, this.handleOpenEvent);

    this.subscribe("button:click:close", this.handleCloseEvent);
    this.subscribe("click", this.handleClickEvent);
    this.subscribe("mousedown", this.handleMousedownEvent);
  }

  disconnectedCallback() {
    globalThis.unsubscribe(`button:click:open-modal:${this.name}`, this.handleOpenEvent);

    this.unsubscribe("button:click:close", this.handleCloseEvent);
    this.unsubscribe("click", this.handleClickEvent);
    this.unsubscribe("mousedown", this.handleMousedownEvent);
  }

  handleMousedownEvent(event) {
    if (!this.isClickOutside(event)) {
      this.mousedownInsideDialog = true;
    } else {
      this.mousedownInsideDialog = false;
    }
  }

  handleOpenEvent() {
    this.dialogElement?.showModal();
  }

  handleCloseEvent() {
    this.dialogElement?.close();
  }

  handleClickEvent(event) {
    if (this.isClickOutside(event) && !this.mousedownInsideDialog) {
      this.dialogElement?.close();
    }
  }

  isClickOutside(clickEvent) {
    const rect = this.dialogElement.getBoundingClientRect();
    const isInDialog =
      rect.top <= clickEvent.clientY &&
      clickEvent.clientY <= rect.top + rect.height &&
      rect.left <= clickEvent.clientX &&
      clickEvent.clientX <= rect.left + rect.width;

    return !isInDialog;
  }

  get dialogElement() {
    return this.querySelector("dialog");
  }
}

defineComponent("modal-component", Modal);
