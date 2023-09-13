import React, { useEffect, useState } from "react";
import ChatPage from "./pages/ChatPage";
import { MessagesContextProvider } from "./context/MessagesContext";
import { ServiceWorkerUpdateListener } from "./serviceWorkerUpdateListener";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TabContextProvider } from "./context/TabContext";

function App() {
  const [isUpdateWaiting, setIsUpdateWaiting] = useState(false);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState(null);
  const [swListener, setSwListener] = useState({});

  useEffect(() => {
    let listener = new ServiceWorkerUpdateListener();
    setSwListener(listener);

    listener.onupdateinstalling = (installingEvent) => {
      console.log("SW installed", installingEvent);
    };

    listener.onupdatewaiting = (waitingEvent) => {
      console.log("new update waiting", waitingEvent);
      setIsUpdateWaiting(true);
    };

    listener.onupdateready = (event) => {
      window.location.reload();
    };

    navigator.serviceWorker.getRegistration().then((reg) => {
      listener.addRegistration(reg);
      setServiceWorkerRegistration(reg);
    });

    return () => listener.removeRegistration(serviceWorkerRegistration);
  }, []);

  const handleServiceWorkerUpdate = () => {
    swListener.skipWaiting(serviceWorkerRegistration.waiting);
  };

  function displayToast() {
    toast.info("Update available", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false,
      closeButton: () => <button onClick={handleServiceWorkerUpdate}>update</button>,
    });
  }

  return (
    <TabContextProvider>
      <MessagesContextProvider>
        <div>
          <ChatPage />
          {isUpdateWaiting && displayToast()}
          <ToastContainer />
        </div>
      </MessagesContextProvider>
    </TabContextProvider>
  );
}

export default App;
