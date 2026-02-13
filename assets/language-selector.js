import { CustomComponentMixin, defineComponent } from "./component.js";

class LanguageSelector extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.handleSelectorChange = this.handleSelectorChange.bind(this);
  }

  connectedCallback() {
    this.selectElement.addEventListener("change", this.handleSelectorChange);
  }

  disconnectedCallback() {
    this.selectElement.removeEventListener("change", this.handleSelectorChange);
  }

  handleSelectorChange(event) {
    const selectedLanguage = event.target.value;
    this.inputElement.value = selectedLanguage;
    this.formElement.submit();
  }

  get selectElement() {
    return this.querySelector("select");
  }

  get inputElement() {
    return this.querySelector('input[name="language_code"]');
  }

  get formElement() {
    return this.querySelector("form");
  }
}

defineComponent("language-selector-component", LanguageSelector, "div");
