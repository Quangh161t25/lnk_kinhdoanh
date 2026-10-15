import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// Không bọc StrictMode: các tab cũ thao tác DOM trực tiếp và không chịu được
// việc effect bị chạy hai lần trong chế độ dev.
createRoot(document.getElementById("root")).render(<App />);
