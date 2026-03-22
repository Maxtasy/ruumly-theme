import { CustomComponentMixin, defineComponent } from "./component.js";

export class NewsletterForm extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

defineComponent("newsletter-form-component", NewsletterForm);
