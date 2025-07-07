import { ToastContainer, toast, Slide } from "react-toastify";


const ToastProvider = () => (
  <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme={localStorage.getItem("darkMode") === "true" ? "dark" : "light"}
    transition={Slide}
  />
);

export const showToast = (type, message) => {
  const toastFunctions = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warn,
  };
  const show = toastFunctions[type] || toast;
  show(message, {
    theme: localStorage.getItem("darkMode") === "true" ? "dark" : "light"
  }
  );
};

export default ToastProvider;
