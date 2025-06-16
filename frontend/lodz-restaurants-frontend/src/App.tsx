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
import {Snackbar, Alert} from "@mui/material";

function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [token]);

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setSnackbarMessage("Wylogowano pomyślnie!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <BrowserRouter basename={"/lodz-restaurants"}>
                <Navbar isLogin={token !== null} onLogout={handleLogout} />
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
                <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbarSeverity} 
                        sx={{ width: '100%' }}
                        variant="filled"
                        elevation={6}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </BrowserRouter>
        </>
    )
}

export default App
