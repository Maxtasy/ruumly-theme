import { backInStock } from "./back-in-stock.js";
import { CustomComponentMixin, defineComponent } from "./component.js";

export class BackInStockForm extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.productId = this.parsedData.productId;
    this.variantId = this.parsedData.variantId;

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

    const response = await backInStock.subscribe(this.productId, this.variantId, this.email);

    if (response.success) {
      this.showSuccessMessage();
    } else {
      this.showErrorMessage();
    }

    this.setLoading(false);
    this.hideButton();
  }

  setLoading(force) {
    this.buttonElement?.setLoading(force);
  }

  showSuccessMessage() {
    this.successMessageElement?.classList.add("BackInStockForm__SuccessMessage--Active");
    this.errorMessageElement?.classList.remove("BackInStockForm__ErrorMessage--Active");
  }

  showErrorMessage() {
    this.errorMessageElement?.classList.add("BackInStockForm__ErrorMessage--Active");
    this.successMessageElement?.classList.remove("BackInStockForm__SuccessMessage--Active");
  }

  hideButton() {
    this.buttonElement?.classList.add("u-Hidden");
  }

  get buttonElement() {
    return this.formElement.querySelector("button-component");
  }

  get formElement() {
    return this.querySelector("form");
  }

  get successMessageElement() {
    return this.querySelector(".BackInStockForm__SuccessMessage");
  }

  get errorMessageElement() {
    return this.querySelector(".BackInStockForm__ErrorMessage");
  }

  get email() {
    return this.formElement.querySelector('input[type="email"]').value;
  }
}

defineComponent("back-in-stock-form-component", BackInStockForm);
