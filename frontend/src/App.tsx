import { RouterProvider } from "react-router-dom";

import router from "@/routes/router";

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
