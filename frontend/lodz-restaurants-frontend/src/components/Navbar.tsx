import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";

interface NavbarProps {
    isLogin: boolean;
    onLogout: () => void;
}

const Navbar = ({ isLogin, onLogout }: NavbarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    🍽️ Łódzkie Restauracje
                </Typography>
                {location.pathname !== "/login" && location.pathname !== "/admin" && !isLogin && (
                    <Button color="inherit" onClick={() => {navigate("/login")}}>Zaloguj się</Button>
                )}
                {isLogin && (
                    <Button color="inherit" onClick={onLogout}>Wyloguj się</Button>
                )}
                {location.pathname !== "/" && (
                    <Button color="inherit" onClick={() => {navigate("/")}}>Strona główna</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
