import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    🍽️ Łódzkie Restauracje
                </Typography>
                {location.pathname !== "/" && (
                    <Button color="inherit" onClick={() => {navigate("/")}}>Strona główna</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
