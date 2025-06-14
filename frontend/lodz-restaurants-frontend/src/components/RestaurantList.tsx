import React, { useRef, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, Typography, Button, CardActions, Box, Rating, CircularProgress} from "@mui/material";
import StarIcon from '@mui/material/Icon';
import type IRestaurant from "../types/IRestaurant";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

interface RestaurantListProps {
    restaurants: IRestaurant[];
    onSelectRestaurant: (restaurant: IRestaurant) => void;
    highlightedRestaurantId?: number | null;
    onLoadMore: () => void;
    isLoading?: boolean;
    hasMore?: boolean;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
    restaurants, 
    onSelectRestaurant, 
    highlightedRestaurantId,
    onLoadMore,
    isLoading = false,
    hasMore = true
}) => {
    const navigate = useNavigate();
    const listEndRef = useRef<HTMLDivElement>(null);
    
    useInfiniteScroll(
        listEndRef,
        onLoadMore, 
        { threshold: 300 },
        isLoading,
        hasMore
    );

    useEffect(() => {
        console.log("RestaurantList rendered with:", {
            restaurantsCount: restaurants?.length || 0,
            isLoading,
            hasMore
        });
    }, [restaurants, isLoading, hasMore]);

    const switchPageToMenu = (restaurant: IRestaurant) => {
        navigate(`/menu/${restaurant.menuId}`);
    }

    const handleManualLoadMore = () => {
        if (!isLoading && hasMore) {
            onLoadMore();
        }
    };

    if (!restaurants || restaurants.length === 0) {
        return (
            <div className="restaurant-list">
                <Box sx={{ 
                    padding: 3, 
                    textAlign: 'center', 
                    marginTop: 3,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 1
                }}>
                    {isLoading ? (
                        <CircularProgress size={40} sx={{ marginBottom: 2 }} />
                    ) : (
                        <Typography variant="body1">
                            Nie znaleziono restauracji pasujących do podanych kryteriów
                        </Typography>
                    )}
                </Box>
            </div>
        );
    }

    return (
        <div className="restaurant-list">
            {restaurants.map((restaurant) => (
                <Card
                    key={restaurant.id}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: 2,
                        boxShadow: restaurant.id === highlightedRestaurantId ? "0 0 10px 2px rgba(0, 123, 255, 0.8)" : 3,
                        transition: "box-shadow 1.3s ease-in-out",
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" component="div" sx={{fontWeight: "bold"}}>
                                {restaurant.name}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Rating
                                    value={restaurant.rating || 0}
                                    readOnly
                                    precision={0.5}
                                    size="small"
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit"></StarIcon>}
                                />
                                {restaurant.rating ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                        {restaurant.rating.toFixed(1)}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                        Brak ocen
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {restaurant.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Box sx={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                            <Button size="small" onClick={() => onSelectRestaurant(restaurant)} color="primary">
                                Wybierz
                            </Button>
                            <Button size="small" onClick={() => switchPageToMenu(restaurant)} disabled={restaurant.menuId === null} color="primary">
                                Menu
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            ))}
            <div 
                ref={listEndRef} 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    marginBottom: 20,
                    gap: '10px'
                }}
            >
                {hasMore && (
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        disabled={isLoading}
                        onClick={handleManualLoadMore}
                        sx={{ width: '80%', marginTop: 2, marginBottom: 2 }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} sx={{ marginRight: 1 }} />
                        ) : null}
                        {isLoading ? "Ładowanie..." : "Załaduj więcej"}
                    </Button>
                )}
                
                {isLoading && !hasMore && (
                    <CircularProgress size={24} />
                )}
                
                {!isLoading && hasMore && restaurants.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                        Przewiń lub kliknij przycisk powyżej aby załadować więcej
                    </Typography>
                )}
                
                {!isLoading && !hasMore && restaurants.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                        To wszystkie dostępne restauracje
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default RestaurantList;
