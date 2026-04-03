import { Routes } from "./config";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000, 
          style: {
            background: "#048372", 
            color: "#FFFFFF", 
          },
        }}
      />
      <Routes />
    </>
  );
}

export default App;

