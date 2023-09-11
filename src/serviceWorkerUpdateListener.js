export class ServiceWorkerUpdateListener extends EventTarget {
  addRegistration(registration) {
    if (!this._registrations) this._registrations = [];

    //Abort if we are already listening for this registration
    if (this._registrations.includes(registration)) return;

    this._registrations.push(registration);

    // add a eventListener and attach it to a registration so that we can remove it when we want
    const addEventListenerForRegistration = (registration, target, type, listener) => {
      if (!this._eventListeners) {
        this._eventListeners = [];
      }

      this._eventListeners.push({ registration, target, type, listener });
      target.addEventListener(type, listener);
    };

    //method to dispatch the update event and call the related method
    const dispatchUpdateEvent = (state, serviceWorker, registration) => {
      const type = `update${state}`;
      const method = `on${type}`;
      const event = new CustomEvent(type, {
        detail: { serviceWorker, registration },
      });

      this.dispatchEvent(event);

      if (this[method] && typeof this[method] === "function")
        this[method].call(this, event);
    };

    // Fire the onupdatewaiting if there is already a service worker waiting
    if (registration.waiting)
      dispatchUpdateEvent("waiting", registration.waiting, registration);

    // Listen for a new service worker at ServiceWorkerRegistration.installing
    addEventListenerForRegistration(
      registration,
      registration,
      "updatefound",
      (updateFoundEvent) => {
        if (!registration.active || !registration.installing) return;

        //Listen for the state changes on the installing service worker
        addEventListenerForRegistration(
          registration,
          registration.installing,
          "statechange",
          (stateChangeEvent) => {
            if (stateChangeEvent.target.state !== "installed") return;

            dispatchUpdateEvent("waiting", registration.waiting, registration);
          }
        );

        dispatchUpdateEvent("installing", registration.installing, registration);
      }
    );

    addEventListenerForRegistration(
      registration,
      navigator.serviceWorker,
      "controllerchange",
      (controllerChangeEvent) => {
        //postpone the onupdateready event until the new active service worker is fully updated
        controllerChangeEvent.target.ready.then((registration) => {
          dispatchUpdateEvent("ready", registration.active, registration);
        });
      }
    );
  }

  removeRegistration(registration) {
    if (!this._registrations || !this._registrations.length <= 0) return;

    const removeEventListenersForRegistration = (registration) => {
      if (!this._eventListeners) this._eventListeners = [];
      this._eventListeners = this._eventListeners.filter((eventListener) => {
        if (eventListener.registration === registration) {
          eventListener.target.removeEventListener(
            eventListener.type,
            eventListener.listener
          );
          return false;
        }
        return true;
      });
    };

    this._registrations = this._registrations.filter((current) => {
      if (current === registration) {
        removeEventListenersForRegistration(registration);
        return false;
      }

      return true;
    });
  }

  skipWaiting(serviceWorker) {
    serviceWorker.postMessage({ type: "SKIP_WAITING" });
  }
}
