import { CustomComponentMixin, defineComponent } from "./component.js";

export class Filters extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.cachedDocuments = {};

    this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
    this.handleActiveFilterValueRemove = this.handleActiveFilterValueRemove.bind(this);
  }

  connectedCallback() {
    this.subscribe("filter-value:change", this.handleFilterValueChange);
    this.subscribe("active-filter-value:remove", this.handleActiveFilterValueRemove);
  }

  disconnectedCallback() {
    this.unsubscribe("filter-value:change", this.handleFilterValueChange);
    this.unsubscribe("active-filter-value:remove", this.handleActiveFilterValueRemove);
  }

  handleFilterValueChange(data) {
    this.updateProductGrid(data.url);
  }

  handleActiveFilterValueRemove(data) {
    this.updateProductGrid(data.url);
  }

  setLoadingStates() {
    const loadingElements = this.querySelectorAll(".Filter__DropdownContent");
  }

  async updateProductGrid(url) {
    this.setLoadingStates();

    const doc = await this.getDocument(url);

    this.rerender(doc);
    this.updateUrl(url);
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
    const elementsToReplaceSelectors = [
      "[id$='product-grid'] .ProductGrid",
      ".Filter__DropdownContent",
      ".Filter__TriggerContent",
      ".Filters__Row:has(.Filters__ActiveValues)",
      ".FiltersMobile__DrawerContent",
      '[data-action="open-drawer:filters-mobile"]',
    ];

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
}

defineComponent("filters-component", Filters);
