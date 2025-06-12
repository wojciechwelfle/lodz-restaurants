import {useState} from "react";
import Login from "../components/Login.tsx";
import AdminView from "../components/AdminView.tsx";

export default function AdminPage() {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = (receivedToken: string | null) => {
        if (!receivedToken) {
            setError("Brak tokenu uwierzytelniającego");
            setToken(null);
            return;
        }
        
        try {
            const tokenPayload = JSON.parse(atob(receivedToken.split('.')[1]));
            if (tokenPayload?.role && tokenPayload.role === 'ADMIN') {
                setToken(receivedToken);
                setError(null);
            } else {
                setError("Brak uprawnień administratora");
                setToken(null);
            }
        } catch {
            setError("Nieprawidłowy token");
            setToken(null);
        }
    };

    return (
        <>
            {!token && (
                <>
                    <Login onLogin={handleLogin} title={"Panel administratora"}/>
                    {error && <div className="error-message" style={{color: 'red', textAlign: 'center', marginTop: '10px'}}>{error}</div>}
                </>
            )}
            {token && (<AdminView token={token} />)}
        </>
    );
}
