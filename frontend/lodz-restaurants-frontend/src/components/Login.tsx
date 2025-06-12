import {useState} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import {login} from "../data/api.ts";
import {useLocation, useNavigate} from "react-router-dom";

const Login = ({ onLogin, title }: { onLogin: (token: string|null) => void, title: string }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = () => {
        login(username, password)
            .then((token) => {
                onLogin(token);
                if (location.pathname === '/login') {
                    navigate("/");
                }
            })
            .catch(() => {
                onLogin(null);
                alert("Login failed. Please check your credentials.");
            });
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 8 }}
        >
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 2, width: "300px" }}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2, width: "300px" }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ width: "300px" }}
            >
                Login
            </Button>
        </Box>
    );
};

export default Login;