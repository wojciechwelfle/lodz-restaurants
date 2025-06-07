import {
    Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Box
} from "@mui/material";
import { useEffect, useState } from "react";
import {deleteRestaurant, getRestaurants} from "../data/api";
import type IRestaurant from "../types/IRestaurant.ts";
import EditRestaurant from "./EditRestaurant";

export default function RestaurantsAdmin({token} : { token: string }) {
    const [restaurants, setRestaurants] = useState([] as IRestaurant[]);
    const [editRestaurantId, setEditRestaurantId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

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

    const handleEdit = (id: number) => {
        setEditRestaurantId(id);
    }

    const handleCreateNew = () => {
        setIsCreating(true);
        setEditRestaurantId(null);
    }

    const handleCancelEdit = () => {
        setEditRestaurantId(null);
        setIsCreating(false);
    }

    const handleSaveEdit = () => {
        setEditRestaurantId(null);
        setIsCreating(false);
        getRestaurants().then(setRestaurants);
    }

    if (editRestaurantId !== null || isCreating) {
        return (
            <EditRestaurant 
                restaurantId={editRestaurantId} 
                token={token} 
                onCancel={handleCancelEdit}
                onSave={handleSaveEdit}
            />
        );
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Lista restauracji</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleCreateNew}
                >
                    Dodaj nową restaurację
                </Button>
            </Box>
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
                                <Button variant="outlined" onClick={() => handleEdit(r.id)}>Edytuj</Button>
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
