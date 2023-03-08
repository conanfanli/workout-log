import * as React from "react";
import { Button } from "@mui/material";
import { Authorize } from "./googlespreadsheet/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Exercises } from "./Exercise";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <div>
          <Button fullWidth href="/spreadsheet/authorize">
            Spreadsheet
          </Button>
          <Button fullWidth href="/exercises">
            Exercises
          </Button>
        </div>
      ),
    },

    {
      path: "/exercises",
      element: <Exercises />,
    },
    {
      path: "/spreadsheet/authorize",
      element: <Authorize />,
    },
  ],
  { basename: "/workout-log" }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
