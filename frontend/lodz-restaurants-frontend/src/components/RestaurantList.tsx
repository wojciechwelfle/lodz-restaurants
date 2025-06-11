import React from "react";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, Typography, Button, CardActions, Box} from "@mui/material";
import type IRestaurant from "../types/IRestaurant";

interface RestaurantListProps {
    restaurants: IRestaurant[];
    onSelectRestaurant: (restaurant: IRestaurant) => void;
    highlightedRestaurantId?: number | null;
}

const RestaurantList: React.FC<RestaurantListProps> = ({restaurants, onSelectRestaurant, highlightedRestaurantId}) => {
    const navigate = useNavigate();

    const switchPageToMenu = (restaurant: IRestaurant) => {
        navigate(`/menu/${restaurant.menuId}`);
    }

    return (
        <div>
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
                        <Typography variant="h6" component="div" sx={{fontWeight: "bold"}}>
                            {restaurant.name}
                        </Typography>
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
        </div>
    );
};

export default RestaurantList;

