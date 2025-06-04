import {useState} from "react";
import AdminLogin from "../components/AdminLogin.tsx";
import AdminView from "../components/AdminView.tsx";

export default function AdminPage() {
    const [token, setToken] = useState<string | null>(null);

    return (
        <>
            {!token && (<AdminLogin onLogin={(token) => setToken(token)}/>)}
            {token && (<AdminView />)}
        </>
    );
}
