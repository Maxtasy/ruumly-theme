export function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

export function getClosestSectionId(selector) {
  return document.querySelector(selector)?.closest(".shopify-section")?.id.split("shopify-section-")[1];
}
