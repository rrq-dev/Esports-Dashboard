import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./router/AppRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;
