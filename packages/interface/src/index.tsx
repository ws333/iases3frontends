import ReactDOM from "react-dom/client";
import { Root } from "./components/Root";
import "./css/browser-style.css";
import "./css/email-preview.css";

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement!).render(<Root />);
