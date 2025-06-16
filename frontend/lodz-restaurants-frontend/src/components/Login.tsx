import {useState} from "react";
import {Box, Button, TextField, Typography, Paper, Container} from "@mui/material";
import {login} from "../data/api.ts";
import {Link, useLocation, useNavigate} from "react-router-dom";

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
        <Container component="main" maxWidth="xs">
            <Paper 
                elevation={3}
                sx={{
                    mt: 8,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2, width: "100%" }}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2, width: "100%" }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    sx={{ width: "100%" }}
                >
                    Login
                </Button>
                
                {location.pathname === '/login' && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                        <Link to="/register">
                            <Typography variant="body2" color="primary">
                                Nie masz konta? Zarejestruj się
                            </Typography>
                        </Link>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default Login;
