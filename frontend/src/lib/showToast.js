import { toast } from "react-toastify";

// Custom toast notification system with enhanced features
export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  info: (message, options = {}) => {
    toast.info(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    toast.warning(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  // Custom notification with custom content
  custom: (content, options = {}) => {
    toast(content, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  // Loading toast that can be updated
  loading: (message) => {
    return toast.loading(message, {
      position: "bottom-right",
    });
  },

  // Update existing toast
  update: (toastId, options) => {
    toast.update(toastId, options);
  },

  // Promise-based notification
  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        pending: {
          render: messages.pending,
          icon: "⏳",
        },
        success: {
          render: messages.success,
          icon: "✅",
        },
        error: {
          render: messages.error,
          icon: "❌",
        },
      },
      {
        position: "bottom-right",
      }
    );
  },
};
