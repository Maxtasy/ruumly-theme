import { CustomComponentMixin, defineComponent } from "./component.js";
import { stickyStack } from "./sticky-stack.js";

export class Section extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.sectionIndex = this.parsedData.sectionIndex || 0;
    this.height = this.offsetHeight;
    this.stickyTopOffset = null;
  }

  connectedCallback() {
    if (!this.isSticky()) return;

    stickyStack.addElement(this);
  }

  disconnectedCallback() {
    if (!this.isSticky()) return;

    stickyStack.removeElement(this);
  }

  isSticky() {
    return this.classList.contains("Section--Sticky");
  }
}

defineComponent("section-component", Section);
