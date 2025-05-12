import React from "react";
import { Card, CardContent, Typography, Button, CardActions } from "@mui/material";
import type IRestaurant from "../types/IRestaurant";

interface RestaurantListProps {
    restaurants: IRestaurant[];
    onSelectRestaurant: (restaurant: IRestaurant) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, onSelectRestaurant }) => {
    return (
        <div>
            {restaurants.map((r) => (
                <Card
                    key={r.id}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: 2,
                        boxShadow: 3,
                        ":hover": {
                            boxShadow: 6,
                        },
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                            {r.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {r.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => onSelectRestaurant(r)} color="primary">
                            Wybierz
                        </Button>
                        {r.website && (
                            <Button
                                size="small"
                                href={r.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="secondary"
                            >
                                Strona
                            </Button>
                        )}
                    </CardActions>
                </Card>
            ))}
        </div>
    );
};

export default RestaurantList;
