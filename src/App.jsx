import AppRoutes from "./routes/AppRoutes";
import AppLayout from "./routes/AppLayout";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/tokens.css";
import "./index.css";

function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
