import { CustomComponentMixin, defineComponent } from "./component.js";

export class Search extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.cachedDocuments = {};

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  connectedCallback() {
    this.formElement?.addEventListener("submit", this.handleFormSubmit);
  }

  disconnectedCallback() {
    this.formElement?.removeEventListener("submit", this.handleFormSubmit);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const searchTerms = this.searchTerms;

    if (!searchTerms || searchTerms === "") return;

    const url = new URL(window.location.href);
    url.searchParams.set("q", searchTerms);

    this.updateSearchResults(url);
  }

  setLoadingState(force) {
    this.submitButtonElement.setLoading(force);
  }

  async updateSearchResults(url) {
    this.setLoadingState(true);

    const doc = await this.getDocument(url);

    this.rerender(doc);
    this.updateUrl(url);

    this.setLoadingState(false);
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
    const elementsToReplaceSelectors = [".Search__Content"];

    elementsToReplaceSelectors.forEach((elementsToReplaceSelector) => {
      const newElements = doc.querySelectorAll(elementsToReplaceSelector);
      const currentElements = document.querySelectorAll(elementsToReplaceSelector);

      currentElements.forEach((currentElement, index) => {
        if (!newElements[index]) return;

        currentElement.outerHTML = newElements[index].outerHTML;
      });
    });
  }

  updateUrl(url) {
    window.history.replaceState({}, "", url);
  }

  get formElement() {
    return this.querySelector("form");
  }

  get searchTerms() {
    return this.querySelector("input[type='search']")?.value;
  }

  get submitButtonElement() {
    return this.formElement?.querySelector("button-component");
  }
}

defineComponent("search-component", Search);
