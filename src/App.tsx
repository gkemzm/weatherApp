import { Toaster } from "react-hot-toast";
import { AppRouter } from "./app/router/router";

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "16px",
            background: "#ffffff",
            color: "#10b259",
          },
        }}
      />
    </>
  );
}
