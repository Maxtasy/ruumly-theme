import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";

export class ProductQuickAddForm extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.item = {
      id: null,
      quantity: 1,
    };

    this.handleProductVariantSelectorInit = this.handleProductVariantSelectorInit.bind(this);
    this.handleProductVariantSelectorChange = this.handleProductVariantSelectorChange.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  connectedCallback() {
    this.subscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.subscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.subscribe("button:click:add-to-cart", this.handleAddToCart);
  }

  disconnectedCallback() {
    this.unsubscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.unsubscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.unsubscribe("button:click:add-to-cart", this.handleAddToCart);
  }

  handleProductVariantSelectorInit(event) {
    const { selectedVariantId } = event;

    this.item.id = selectedVariantId;
  }

  handleProductVariantSelectorChange(event) {
    const { selectedVariantId } = event;

    this.item.id = selectedVariantId;
  }

  async handleAddToCart(_, event) {
    const addToCartButtonElement = event.target;

    addToCartButtonElement.setLoading(true);

    const items = [this.item];

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
}

defineComponent("product-quick-add-form-component", ProductQuickAddForm);
