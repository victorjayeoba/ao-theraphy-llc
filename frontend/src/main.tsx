import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS (Animate On Scroll)
AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic' });

createRoot(document.getElementById("root")!).render(<App />);
