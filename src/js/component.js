export const CustomComponentMixin = (Base) =>
  class extends Base {
    constructor() {
      super();

      // Ensure the component has parsed dataset attributes
      this.parsedData = parseDataAttributes(this);

      // Internal map to track wrapped event listeners for proper removal
      this._eventWrappers = new WeakMap();
    }

    /**
     * Subscribe to an event on this component.
     * Works with CustomEvent or normal Event.
     * The same callback can be unsubscribed later.
     */
    subscribe(eventName, callbackFunction) {
      // Wrap the callback so we always pass event.detail for CustomEvents
      const wrapper = (event) => {
        if (event instanceof CustomEvent) {
          callbackFunction(event.detail);
        } else {
          callbackFunction(event);
        }
      };

      // Store the wrapper in a WeakMap keyed by the original callback
      this._eventWrappers.set(callbackFunction, wrapper);

      // Attach the wrapper listener
      this.addEventListener(eventName, wrapper);
    }

    /**
     * Unsubscribe a previously subscribed callback
     */
    unsubscribe(eventName, callbackFunction) {
      const wrapper = this._eventWrappers.get(callbackFunction);
      if (wrapper) {
        this.removeEventListener(eventName, wrapper);
        this._eventWrappers.delete(callbackFunction);
      }
    }

    /**
     * Publish a custom event from this component.
     * Optionally appends the action name from parsedData for namespacing.
     */
    publish(eventName, data = {}) {
      let eventNameWithAction = eventName;
      if (this.parsedData?.action) {
        eventNameWithAction += `:${this.parsedData.action}`;
      }

      const eventObject = new CustomEvent(eventNameWithAction, {
        bubbles: true,
        composed: true,
        detail: data,
      });

      this.dispatchEvent(eventObject);
    }
  };

function parseDataValue(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseDataAttributes(element) {
  const data = {};
  for (const [key, value] of Object.entries(element.dataset)) {
    data[key] = parseDataValue(value);
  }
  return data;
}

export class Component extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.parsedData = parseDataAttributes(this);
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

export function defineComponent(tagName, componentClass, extendsElement) {
  if (customElements.get(tagName)) {
    console.warn(`Component with tag name ${tagName} is already defined.`);
    return;
  }

  customElements.define(tagName, componentClass, { extends: extendsElement });
}

// Global event subscription function
// This allows components to subscribe to events globally, not just within their own scope.
globalThis.subscribe = function (eventName, callbackFunction) {
  document.addEventListener(eventName, (event) => {
    if (event instanceof CustomEvent) {
      callbackFunction(event.detail);
    } else {
      callbackFunction(event);
    }
  });
};

// Global event unsubscription function
// This allows components to unsubscribe from events globally, not just within their own scope.
globalThis.unsubscribe = function (eventName, callbackFunction) {
  document.removeEventListener(eventName, callbackFunction);
};
