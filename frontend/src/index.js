import { StrictMode } from 'react';
import { createRoot } from "react-dom/client"
import App from './App';
import "./index.css"
import { SidebarProvider } from './Providers/SidebarProvider';

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <SidebarProvider children={<App />}/>
    </StrictMode>
);