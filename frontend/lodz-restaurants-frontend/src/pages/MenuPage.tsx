import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Card,
    CardContent,
    Divider,
    Stack
} from '@mui/material';
import { API_URL, ONLINE_MODE } from "../constants.ts";
import type IMenu from "../types/IMenu.ts";

const MenuPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [menu, setMenu] = useState<IMenu | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        if (ONLINE_MODE) {
            fetch(`${API_URL}/v1/menu/${id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setMenu(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Failed to fetch online data:", error);
                    setError("Nie udało się pobrać menu restauracji.");
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!menu) {
        return (
            <Container maxWidth="sm">
                <Alert severity="info">Menu jest niedostępne dla tej restauracji.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                Menu Restauracji
            </Typography>

            <Stack spacing={2}>
                {menu.dishes.map((dish) => (
                    <Card key={dish.dishName} variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight={500}>
                                    {dish.dishName}
                                </Typography>
                                <Typography variant="subtitle1" color="primary">
                                    {dish.dishPrice.toFixed(2)} zł
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {dish.dishDescription || "Brak opisu"}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Container>
    );
};

export default MenuPage;
