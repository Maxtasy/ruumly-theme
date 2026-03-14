import { CustomComponentMixin, defineComponent } from "./component.js";

export class Filters extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.cachedDocuments = {};

    this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
  }

  connectedCallback() {
    this.subscribe("filter-value:change", this.handleFilterValueChange);
  }

  disconnectedCallback() {
    this.unsubscribe("filter-value:change", this.handleFilterValueChange);
  }

  async handleFilterValueChange(data) {
    const doc = await this.getDocument(data.url);

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
}

defineComponent("filters-component", Filters);
