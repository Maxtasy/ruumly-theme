import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";
import { sectionRenderingApi } from "./section-rendering-api.js";
import { getClosestSectionId } from "./utils.js";

export class ProductConfigurator extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.productHandle = this.parsedData.productHandle;

    this.enableHistoryState = this.parsedData.enableHistoryState;

    // These are the selectors of the elements that get updated when the variant changes.
    this.elementsToReplaceSelectors = [".ProductForm", ".ProductConfigurator__Gallery"];
    this.sectionDocumentCache = {};

    this.handleProductFormChange = this.handleProductFormChange.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  connectedCallback() {
    this.subscribe("product-form:change", this.handleProductFormChange);
    this.subscribe("button:click:add-to-cart", this.handleAddToCart);
  }

  disconnectedCallback() {
    this.unsubscribe("product-form:change", this.handleProductFormChange);
    this.unsubscribe("button:click:add-to-cart", this.handleAddToCart);
  }

  async handleProductFormChange({ item }) {
    // Set loading states for components that should not be interacted with while section is beeing fetched.
    this.productOptionSelectorElements.forEach((productOptionSelectorElement) => {
      productOptionSelectorElement.setLoading(true);
    });

    const newSectionDocument = await this.getDocumentForVariant(item.id);
    this.rerenderParts(newSectionDocument);

    if (this.enableHistoryState) {
      this.updateUrl(item.id);
    }
  }

  async handleAddToCart(_, event) {
    const addToCartButtonElement = event.target;

    addToCartButtonElement.setLoading(true);

    const items = Array.from(this.productFormElements).map((formElement) => formElement.item);

    const cartResponse = await cart.addItems({ items, sections: ["cart-drawer"] });

    addToCartButtonElement.setLoading(false);

    if (cartResponse.status === "success") {
      // Notify other components that the item has been added to the cart.
      this.publish("product-configurator:item-added", {
        addedItems: items,
        sections: cartResponse.data.sections,
        items: cartResponse.data.items,
      });

      return;
    }

    if (cartResponse.status === "partial-success") {
      const errorMessage = cartResponse.data.description;

      // Notify other components that the item has been added (partially) to the cart.
      this.publish("product-configurator:item-partially-added", {
        addedItems: items,
        errorMessage,
      });

      return;
    }

    throw new Error("Failed to add items to cart");
  }

  async getDocumentForVariant(variantId) {
    // Get section document from cache or fetch it if it's not in the cache.
    let doc = this.sectionDocumentCache[variantId];

    if (!doc) {
      doc = await sectionRenderingApi.fetchSection(
        getClosestSectionId("product-configurator-component"),
        `products/${this.productHandle}`,
        {
          variant: variantId,
        },
      );

      // Cache the section document for future use to avoid unnecessary network requests when switching between variants.
      this.sectionDocumentCache[variantId] = doc;
    }

    return doc;
  }

  async rerenderParts(newSectionDocument) {
    this.elementsToReplaceSelectors.forEach((selector) => {
      const newElement = newSectionDocument.querySelector(selector);
      const currentElement = this.querySelector(selector);

      if (newElement && currentElement) {
        currentElement.outerHTML = newElement.outerHTML;
      }
    });
  }

  updateUrl(variantId) {
    const url = new URL(window.location.href);
    url.searchParams.set("variant", variantId);
    window.history.replaceState({}, "", url);
  }

  get productFormElements() {
    return this.querySelectorAll("product-form-component");
  }

  get productOptionSelectorElements() {
    return this.querySelectorAll("product-option-selector-component");
  }
}

defineComponent("product-configurator-component", ProductConfigurator);
