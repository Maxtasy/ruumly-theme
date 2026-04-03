import { CustomComponentMixin, defineComponent } from "./component.js";
import { debounce } from "./utils.js";
export class QuickSearch extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.cachedDocuments = {};

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormInput = this.handleFormInput.bind(this);

    this.debouncedHandleFormInput = debounce(this.handleFormInput, 500);
  }

  connectedCallback() {
    this.formElement?.addEventListener("submit", this.handleFormSubmit);
    this.formElement?.addEventListener("input", this.debouncedHandleFormInput);
  }

  disconnectedCallback() {
    this.formElement?.removeEventListener("submit", this.handleFormSubmit);
    this.formElement?.removeEventListener("input", this.debouncedHandleFormInput);
  }

  handleFormInput() {
    this.executeSearch();
  }

  async executeSearch() {
    const searchTerms = this.searchTerms;

    if (!searchTerms || searchTerms === "") return;

    const url = new URL(`${window.location.origin}/search`);
    url.searchParams.set("q", searchTerms);

    await this.updateSearchResults(url);

    if (this.buttonElement) {
      this.updateButtonLink(url);
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    this.executeSearch();
  }

  updateButtonLink(url) {
    this.buttonElement.href = url;
  }

  async updateSearchResults(url) {
    const doc = await this.getDocument(url);

    this.rerender(doc);
  }

  async getDocument(url) {
    let doc = this.cachedDocuments[url];

    if (!doc) {
      const response = await fetch(url);
      const markup = await response.text();
      const parser = new DOMParser();
      doc = parser.parseFromString(markup, "text/html");
      this.cachedDocuments[url] = doc;
    }

    return doc;
  }

  rerender(doc) {
    const elementsToReplaceSelectors = [".QuickSearch__Content"];

    elementsToReplaceSelectors.forEach((elementsToReplaceSelector) => {
      const newElements = doc.querySelectorAll(elementsToReplaceSelector);
      const currentElements = this.querySelectorAll(elementsToReplaceSelector);

      currentElements.forEach((currentElement, index) => {
        if (!newElements[index]) return;

        currentElement.outerHTML = newElements[index].outerHTML;
      });
    });
  }

  get formElement() {
    return this.querySelector("form");
  }

  get searchTerms() {
    return this.querySelector("input[type='search']")?.value;
  }

  get buttonElement() {
    return this.querySelector("a[href*='/search']");
  }
}

defineComponent("quick-search-component", QuickSearch);
