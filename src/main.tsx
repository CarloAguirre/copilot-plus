import { createRoot } from "react-dom/client";
import WorkspaceApp from "./app/WorkspaceApp.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<WorkspaceApp />);
