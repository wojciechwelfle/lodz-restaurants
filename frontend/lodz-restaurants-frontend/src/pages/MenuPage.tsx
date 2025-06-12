import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    FormControlLabel,
    Stack,
    Switch,
    Typography
} from '@mui/material';
import {API_URL, ONLINE_MODE} from "../constants.ts";
import type IMenu from "../types/IMenu.ts";
import StarIcon from '@mui/icons-material/Star';

const MenuPage = ({token}: {token: string | null    }) => {
    const { id } = useParams<{ id: string }>();
    const [menu, setMenu] = useState<IMenu | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showOnlyVip, setShowOnlyVip] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if (ONLINE_MODE) {
            fetch(`${API_URL}/v1/menu/${id}`, {
                headers: {
                    // eslint-disable-next-line no-constant-binary-expression
                    Authorization: `Bearer ${token}` || "",
                },
            })
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
    }, [id, token]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress color="primary" size={50}/>
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

    // Check if there are any VIP dishes
    const hasVipDishes = menu.dishes.some(dish => dish.vip);

    // Filter dishes based on showOnlyVip state
    const displayedDishes = showOnlyVip 
        ? menu.dishes.filter(dish => dish.vip) 
        : menu.dishes;

    return (
        <Container maxWidth="md">
            <br />
            <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                {menu.menuName ? menu.menuName : "Menu Restauracji"}
            </Typography>

            {hasVipDishes && (
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                        <StarIcon sx={{ color: 'gold', mr: 1 }} />
                        <Typography variant="body2">
                            Dania oznaczone gwiazdką są dostępne tylko dla klientów VIP
                        </Typography>
                    </Box>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={showOnlyVip}
                                onChange={(e) => setShowOnlyVip(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Tylko dania VIP"
                    />
                </Box>
            )}

            {displayedDishes.length === 0 ? (
                <Alert severity="info">Brak dań spełniających wybrane kryteria.</Alert>
            ) : (
                <Stack spacing={2}>
                    {displayedDishes.map((dish) => (
                        <Card 
                            key={dish.dishName} 
                            variant="outlined" 
                            sx={{ 
                                borderRadius: 3,
                                ...(dish.vip && { 
                                    borderColor: 'gold', 
                                    boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' 
                                })
                            }}
                        >
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography 
                                        variant="h6" 
                                        fontWeight={500}
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        {dish.dishName}
                                        {dish.vip && (
                                            <Chip 
                                                icon={<StarIcon />} 
                                                label="VIP" 
                                                size="small" 
                                                sx={{ 
                                                    ml: 1, 
                                                    backgroundColor: 'gold', 
                                                    color: 'black',
                                                    fontWeight: 'bold'
                                                }} 
                                            />
                                        )}
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
            )}
        </Container>
    );
};

export default MenuPage;
