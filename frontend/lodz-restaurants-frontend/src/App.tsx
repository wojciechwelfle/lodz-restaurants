import './App.css'
import AppPage from "./pages/AppPage.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import MenuPage from "./pages/MenuPage.tsx";
import Navbar from "./components/Navbar.tsx";
import AdminPage from "./pages/AdminPage.tsx";

function App() {
  return (
    <>
        <BrowserRouter basename={"/lodz-restaurants"}>
            <Navbar/>
            <Routes>
                <Route path="/" element={<AppPage />} />
                <Route path="/menu/:id" element={<MenuPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
