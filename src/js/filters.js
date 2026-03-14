import { CustomComponentMixin, defineComponent } from "./component.js";

export class Filters extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
  }

  connectedCallback() {
    this.subscribe("filter-value:change", this.handleFilterValueChange);
  }

  disconnectedCallback() {
    this.unsubscribe("filter-value:change", this.handleFilterValueChange);
  }

  handleFilterValueChange(data) {
    this.fetchSection(data.url);
  }

  async fetchSection(url) {
    const response = await fetch(url);
    const markup = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, "text/html");
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
