import { CustomComponentMixin, defineComponent } from "./component.js";

export class MegaMenuTrigger extends CustomComponentMixin(HTMLLIElement) {
  constructor() {
    super();

    this.handle = this.parsedData.handle;

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  connectedCallback() {
    this.subscribe("mouseenter", this.handleMouseEnter);
    this.subscribe("mouseleave", this.handleMouseLeave);
  }

  disconnectedCallback() {
    this.unsubscribe("mouseenter", this.handleMouseEnter);
    this.unsubscribe("mouseleave", this.handleMouseLeave);
  }

  handleMouseEnter() {
    this.publish(`mega-menu-trigger:mouse-enter`, { handle: this.handle });
  }

  handleMouseLeave() {
    this.publish(`mega-menu-trigger:mouse-leave:${this.handle}`);
  }
}

defineComponent("mega-menu-trigger-component", MegaMenuTrigger, "li");
