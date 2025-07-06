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
    stickyStack.addElement(this);
  }

  disconnectedCallback() {
    stickyStack.removeElement(this);
  }
}

defineComponent("section-component", Section, "section");
