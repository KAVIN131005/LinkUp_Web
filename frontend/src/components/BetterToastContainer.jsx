import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast Container Component
export default function BetterToastContainer() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{
        zIndex: 9999,
      }}
    />
  );
}
