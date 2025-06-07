import {
    Table, TableHead, TableRow, TableCell, TableBody, Button, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import {deleteRestaurant, getRestaurants} from "../data/api";
import type IRestaurant from "../types/IRestaurant.ts";

export default function RestaurantsAdmin({token} : { token: string }) {
    const [restaurants, setRestaurants] = useState([] as IRestaurant[]);

    useEffect(() => {
        getRestaurants().then(setRestaurants);
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteRestaurant(id, token);
            setRestaurants((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Błąd usuwania restauracji:", err);
        }
    }

    return (
        <>
            <Typography variant="h6">Lista restauracji</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nazwa</TableCell>
                        <TableCell>Opis</TableCell>
                        <TableCell>Kategoria</TableCell>
                        <TableCell>Akcje</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {restaurants.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{r.name}</TableCell>
                            <TableCell>{r.description}</TableCell>
                            <TableCell>{r.category}</TableCell>
                            <TableCell>
                                <Button variant="outlined">Edytuj</Button>
                                {" "}
                                <Button variant="outlined" color="error" onClick={() => handleDelete(r.id)}>Usuń</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
