import toast from "react-hot-toast";

export const queryToast = {
  loading(id: string, message: string) {
    toast.loading(message, { id });
  },
  success(id: string) {
    toast.dismiss(id);
  },
  error(id: string, message: string) {
    toast.error(message, { id });
  },
};
