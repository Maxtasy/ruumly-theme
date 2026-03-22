// `context` can be used to render the sections in a specific context (e.g., a product page).
// Values: 'products', 'collections', 'cart', etc.

class SectionRenderingApi {
  constructor() {
    this.baseUrl = `${window.routes.home}`;
  }

  async fetchSection(sectionId, context, params) {
    const response = await fetch(
      `${this.baseUrl}${context ? `${context}` : ""}?section_id=${sectionId}${params ? `&${new URLSearchParams(params).toString()}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch section");
    }

    const parser = new DOMParser();
    const htmlString = await response.text();
    const doc = parser.parseFromString(htmlString, "text/html");

    return doc;
  }

  async fetchSections(sectionIds, context) {
    const response = await fetch(`${this.baseUrl}${context ? `${context}/` : ""}?sections=${sectionIds.join(",")}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sections");
    }

    const data = await response.json();

    return data;
  }
}

export const sectionRenderingApi = new SectionRenderingApi();
