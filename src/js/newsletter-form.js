import { CustomComponentMixin, defineComponent } from "./component.js";
import { newsletter } from "./newsletter.js";

export class NewsletterForm extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  connectedCallback() {
    this.formElement?.addEventListener("submit", this.handleFormSubmit);
  }

  disconnectedCallback() {
    this.formElement?.removeEventListener("submit", this.handleFormSubmit);
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    this.setLoading(true);

    const response = await newsletter.register(this.email);

    if (response.success) {
      this.showSuccessMessage();
    } else {
      this.showErrorMessage();
    }

    this.setLoading(false);
    this.hideButton();
  }

  showSuccessMessage() {
    this.successMessageElement?.classList.add("Newsletter__SuccessMessage--Active");
    this.errorMessageElement?.classList.remove("Newsletter__ErrorMessage--Active");
  }

  showErrorMessage() {
    this.errorMessageElement?.classList.add("Newsletter__ErrorMessage--Active");
    this.successMessageElement?.classList.remove("Newsletter__SuccessMessage--Active");
  }

  hideButton() {
    this.buttonElement?.classList.add("u-Hidden");
  }

  setLoading(force) {
    this.buttonElement?.setLoading(force);
  }

  get formElement() {
    return this.querySelector("form");
  }

  get buttonElement() {
    return this.formElement.querySelector("button-component");
  }

  get successMessageElement() {
    return this.querySelector(".Newsletter__SuccessMessage");
  }

  get errorMessageElement() {
    return this.querySelector(".Newsletter__ErrorMessage");
  }

  get email() {
    return this.formElement.querySelector('input[type="email"]').value;
  }
}

defineComponent("newsletter-form-component", NewsletterForm);
