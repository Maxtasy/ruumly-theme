import { CustomComponentMixin, defineComponent } from "./component.js";

class ProductRecommendations extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();
    const locale = "de";
    this.productRecommendationsSectionId = "product-recommendations";
    this.productId = this.parsedData.productId;
    this.recommendationsUrl = `/${locale}/recommendations/products?product_id=${this.productId}&section_id=${this.productRecommendationsSectionId}`;
  }

  connectedCallback() {
    this.getRecommendations();
  }

  async getRecommendations() {
    const response = await fetch(this.recommendationsUrl);
    const data = await response.text();
    console.log(data);

    // To-Do: Replace markup in section
  }
}

defineComponent("product-recommendations-component", ProductRecommendations, "div");
