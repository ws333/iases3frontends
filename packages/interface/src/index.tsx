import ReactDOM from "react-dom/client";

import "./css/browser-style.css";
import "./css/email-preview.css";
import { Root } from "./components/Root";

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement!).render(<Root />);
