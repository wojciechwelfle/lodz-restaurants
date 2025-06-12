import './App.css'
import AppPage from "./pages/AppPage.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import MenuPage from "./pages/MenuPage.tsx";
import Navbar from "./components/Navbar.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import ReservationTablesPage from "./pages/ReservationTablesPage.tsx";
import {useEffect, useState} from "react";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";

function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [token]);

    return (
        <>
            <BrowserRouter basename={"/lodz-restaurants"}>
                <Navbar isLogin={token !== null}/>
                <div className="overflow-y-auto bg-gradient-to-r from-blue-100 to-blue-50 shadow-lg min-h-screen">
                    <Routes>
                        <Route path="/" element={<AppPage/>}/>
                        <Route path="/login" element={<Login onLogin={(token) => setToken(token)} title={"Zaloguj się!"}/>}/>
                        <Route path="/register" element={<Register title={"Zarejestruj się!"}/>}/>
                        <Route path="/menu/:id" element={<MenuPage token={token}/>}/>
                        <Route path="/reservation/:id" element={<ReservationTablesPage token={token}/>}/>
                        <Route path="/admin" element={<AdminPage/>}/>
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}

export default App
