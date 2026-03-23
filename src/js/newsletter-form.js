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

    const response = await newsletter.register(this.email);

    if (response.success) {
      this.showSuccessMessage();
    } else {
      this.showErrorMessage();
    }

    this.hideButton();
  }

  showSuccessMessage() {
    this.successMessageElement?.classList.add("NewsletterForm__SuccessMessage--Active");
    this.errorMessageElement?.classList.remove("NewsletterForm__ErrorMessage--Active");
  }

  showErrorMessage() {
    this.errorMessageElement?.classList.add("NewsletterForm__ErrorMessage--Active");
    this.successMessageElement?.classList.remove("NewsletterForm__SuccessMessage--Active");
  }

  hideButton() {
    this.buttonElement?.classList.add("u-Hidden");
  }

  get formElement() {
    return this.querySelector("form");
  }

  get buttonElement() {
    return this.formElement.querySelector("button-component");
  }

  get successMessageElement() {
    return this.querySelector(".NewsletterForm__SuccessMessage");
  }

  get errorMessageElement() {
    return this.querySelector(".NewsletterForm__ErrorMessage");
  }

  get email() {
    return this.formElement.querySelector('input[type="email"]').value;
  }
}

defineComponent("newsletter-form-component", NewsletterForm);
