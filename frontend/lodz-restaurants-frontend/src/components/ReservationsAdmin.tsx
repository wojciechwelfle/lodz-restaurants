import {useState, useEffect} from "react";
import {Box, Button, Typography, TextField, Select, MenuItem} from "@mui/material";
import {generateReservationTables, getRestaurants} from "../data/api.ts";
import type IRestaurant from "../types/IRestaurant.ts";

const ReservationsAdmin = ({token}: { token: string }) => {
    const [restaurantId, setRestaurantId] = useState(1);
    const [restaurants, setRestaurants] = useState([] as IRestaurant[]);
    const [numberOfTables, setNumberOfTables] = useState(5);
    const [seats, setSeats] = useState(4);
    const [date, setDate] = useState("");
    const [fromHour, setFromHour] = useState(8);
    const [toHour, setToHour] = useState(10);

    useEffect(() => {
        getRestaurants().then(
            (data: IRestaurant[]) => {
                setRestaurants(data);
                if (data.length > 0) {
                    setRestaurantId(data[0].id);
                }
            }
        ).catch((error) => {
                console.error("Error fetching restaurants:", error);
                alert("Failed to load restaurants. Please try again later.");
            }
        )
    }, [token]);

    const handleGenerateTables = async () => {
        if (!date) {
            alert("Please select a valid date.");
            return;
        }
        if (fromHour < 0 || fromHour > 24 || toHour < 0 || toHour > 24) {
            alert("Hours must be between 0 and 24.");
            return;
        }
        if (numberOfTables <= 0 || seats <= 0) {
            alert("Number of tables and seats per table must be greater than zero.");
            return;
        }
        try {
            await generateReservationTables(
                restaurantId,
                numberOfTables,
                seats,
                date,
                fromHour,
                toHour,
                token
            );
            alert("Reservation tables generated successfully!");
        } catch {
            alert("Error generating reservation tables");
        }
    };

    return (
        <Box sx={{padding: 2}}>
            <Typography variant="h4" gutterBottom>
                Reservations Management
            </Typography>
            <Typography variant="h6" gutterBottom>
                Generate Reservation Tables
            </Typography>
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                <Box sx={{flex: "1 1 calc(50% - 16px)"}}>
                    <Select
                        value={restaurantId}
                        onChange={(e) => setRestaurantId(Number(e.target.value))}
                        fullWidth
                        variant={"outlined"}>
                        {restaurants.map((restaurant: IRestaurant) => (
                            <MenuItem key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box sx={{flex: "1 1 calc(50% - 16px)"}}>
                    <TextField
                        label="Number of Tables"
                        type="number"
                        value={numberOfTables}
                        onChange={(e) => setNumberOfTables(Math.max(1, Number(e.target.value)))}
                        fullWidth
                    />
                </Box>
                <Box sx={{flex: "1 1 calc(50% - 16px)"}}>
                    <TextField
                        label="Seats per Table"
                        type="number"
                        value={seats}
                        onChange={(e) => setSeats(Math.max(1, Number(e.target.value)))}
                        fullWidth
                    />
                </Box>
                <Box sx={{flex: "1 1 calc(50% - 16px)"}}>
                    <TextField
                        label="Date"
                        type="date"
                        InputLabelProps={{shrink: true}}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box sx={{flex: "1 1 calc(50% - 16px)"}}>
                    <TextField
                        label="From Hour"
                        type="number"
                        value={fromHour}
                        onChange={(e) => setFromHour(Math.max(0, Math.min(24, Number(e.target.value))))}
                        fullWidth
                    />
                </Box>
                <Box sx={{flex: "1 1 calc(50% - 16px)"}}>
                    <TextField
                        label="To Hour"
                        type="number"
                        value={toHour}
                        onChange={(e) => setToHour(Math.max(0, Math.min(24, Number(e.target.value))))}
                        fullWidth
                    />
                </Box>
            </Box>
            <Button
                variant="contained"
                color="primary"
                sx={{marginTop: 2}}
                onClick={handleGenerateTables}
            >
                Generate Tables
            </Button>
        </Box>
    );
};

export default ReservationsAdmin;
