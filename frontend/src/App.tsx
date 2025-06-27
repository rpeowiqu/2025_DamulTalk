import { RouterProvider } from "react-router-dom";

import router from "@/routes/router";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <Toaster position="top-center" richColors />
    </>
  );
};

export default App;
