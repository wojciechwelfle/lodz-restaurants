import {
    Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Box,
    TextField, Pagination, Stack, InputAdornment, CircularProgress
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { deleteRestaurant, getPaginatedRestaurants } from "../data/api";
import type IRestaurant from "../types/IRestaurant.ts";
import EditRestaurant from "./EditRestaurant";

export default function RestaurantsAdmin({token} : { token: string }) {
    const [restaurants, setRestaurants] = useState([] as IRestaurant[]);
    const [editRestaurantId, setEditRestaurantId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(0);
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getPaginatedRestaurants(page, pageSize, debouncedSearchTerm);
                setRestaurants(data.content);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error("Błąd pobierania restauracji:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, pageSize, debouncedSearchTerm]);

    const handleDelete = async (id: number) => {
        try {
            await deleteRestaurant(id, token);
            const data = await getPaginatedRestaurants(page, pageSize, debouncedSearchTerm);
            setRestaurants(data.content);
            setTotalPages(data.totalPages);
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

    const handleSaveEdit = async () => {
        setEditRestaurantId(null);
        setIsCreating(false);
        const data = await getPaginatedRestaurants(page, pageSize, debouncedSearchTerm);
        setRestaurants(data.content);
        setTotalPages(data.totalPages);
    }

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

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
            
            <Box sx={{ mb: 3 }}>
                <TextField
                    label="Wyszukaj restaurację"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: loading ? (
                            <InputAdornment position="end">
                                <CircularProgress size={24} />
                            </InputAdornment>
                        ) : null
                    }}
                />
            </Box>
            
            {restaurants.length > 0 ? (
                <>
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
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            onClick={() => handleDelete(r.id)}
                                        >
                                            Usuń
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    <Stack spacing={2} sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                        <Pagination 
                            count={totalPages} 
                            page={page + 1} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Stack>
                </>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Typography>Brak restauracji do wyświetlenia</Typography>
                    )}
                </Box>
            )}
        </>
    );
}
