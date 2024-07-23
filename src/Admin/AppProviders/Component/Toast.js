import React, { useRef } from "react";
import { Toast } from "primereact/toast";

export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toast} position="bottom-right" />
      {children}
    </ToastContext.Provider>
  );
};
