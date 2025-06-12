import {useState} from "react";
import Login from "../components/Login.tsx";
import AdminView from "../components/AdminView.tsx";

export default function AdminPage() {
    const [token, setToken] = useState<string | null>(null);

    return (
        <>
            {!token && (<Login onLogin={(token) => setToken(token)} title={"Panel administratora"}/>)}
            {token && (<AdminView token={token} />)}
        </>
    );
}
