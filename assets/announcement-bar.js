import { CustomComponentMixin, defineComponent } from "./component.js";

export class AnnouncementBar extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.index = 0;
    this.autoscrollTimeout = 2000;
    this.interactionTimeout = 5000;
    this.intervall = null;
    this.timeout = null;

    this.start();

    this.subscribe("touchstart", this.pause.bind(this));
  }

  next() {
    this.index = this.index + 1;

    if (this.index >= this.announcementItemElements.length) {
      this.index = 0;
    }

    this.announcementItemElements[this.index].scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  start() {
    clearTimeout(this.timeout);

    this.intervall = setInterval(() => {
      this.next();
    }, this.autoscrollTimeout);
  }

  pause() {
    clearInterval(this.intervall);

    this.timeout = setTimeout(() => {
      this.start();
    }, this.interactionTimeout);
  }

  get announcementItemElements() {
    return this.closest(".Section").querySelectorAll(".AnnouncementBar > *");
  }
}

defineComponent("announcement-bar-component", AnnouncementBar, "div");
