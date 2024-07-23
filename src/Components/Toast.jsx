import React, { useRef, useContext } from "react";

import { Toast } from "react-bootstrap";

export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);

  const showToast = (severity, summary, detail) => {
    if (toastRef.current) {
      toastRef.current.show({
        severity: severity,
        summary: summary,
        detail: detail,
        timeout: 5000, // Keep consistent with the delay prop of the Toast component
      });
    } else {
      console.error("Toast reference is not available.");
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} autohide={true} delay={5000} />
      {children}
    </ToastContext.Provider>
  );
};
