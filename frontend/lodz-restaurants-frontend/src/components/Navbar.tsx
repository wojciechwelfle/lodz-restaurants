import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar: React.FC = () => {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    🍽️ Łódzkie Restauracje
                </Typography>
                <Button color="inherit">Kontakt</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
