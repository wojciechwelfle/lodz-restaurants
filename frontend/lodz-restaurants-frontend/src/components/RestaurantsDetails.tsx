import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import type IRestaurant from "../types/IRestaurant";
import {useNavigate} from "react-router-dom";

const ModalOverlay = styled("div")({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
});

const ModalContent = styled("div")({
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "15px",
});

const RestaurantDetails: React.FC<{ restaurant: IRestaurant; onClose: () => void }> = ({ restaurant, onClose }) => {
    const navigate = useNavigate();

    return (
        <ModalOverlay>
            <ModalContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                    {restaurant.name}
                </Typography>

                <Typography variant="body1" sx={{ color: "#555" }}>
                    {restaurant.description}
                </Typography>

                <Box sx={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#444" }}>
                        <strong>Adres:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#777" }}>
                        {restaurant.position[0]}, {restaurant.position[1]}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/reservation/${restaurant.id}`)}
                    sx={{
                        alignSelf: "flex-start",
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#1565c0" },
                    }}
                >
                    Przejdź do rezerwacji
                </Button>

                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#f44336",
                        "&:hover": { backgroundColor: "#d32f2f" },
                    }}
                >
                    Zamknij
                </Button>
            </ModalContent>
        </ModalOverlay>
    );
};

export default RestaurantDetails;
