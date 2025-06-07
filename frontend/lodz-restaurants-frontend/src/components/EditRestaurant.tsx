import {useState, useEffect, type FormEvent, type ChangeEvent} from "react";
import {
    TextField, Button, Box, Typography, Paper,
    FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent
} from "@mui/material";
import {updateRestaurant, getRestaurantById, getAllCategories, createRestaurant} from "../data/api";
import type IRestaurant from "../types/IRestaurant";
import type ICategory from "../types/ICategory.ts";
import type IRestaurantRequest from "../types/IRestaurantRequest";

interface EditRestaurantProps {
    restaurantId: number | null;
    token: string;
    onCancel: () => void;
    onSave: () => void;
}

export default function EditRestaurant({
                                           restaurantId, token, onCancel, onSave
                                       }: EditRestaurantProps) {
    const [restaurant, setRestaurant] = useState<IRestaurant>({
        id: 0,
        name: "",
        description: "",
        position: [0, 0],
        category: "",
        menuId: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([] as ICategory[]);

    useEffect(() => {
        getAllCategories()
            .then(data => {
                setCategories(data);
            })
            .catch(err => {
                console.error("Failed to load categories:", err);
                setError("Nie można załadować kategorii");
            });
            
        if (restaurantId) {
            setLoading(true);
            getRestaurantById(restaurantId)
                .then(data => {
                    setRestaurant(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load restaurant:", err);
                    setError("Nie można załadować danych restauracji");
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [restaurantId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setRestaurant(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleCoordinateChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = parseFloat(e.target.value) || 0;
        setRestaurant(prev => {
            const newPosition = [...prev.position] as [number, number];
            newPosition[index] = value;
            return {
                ...prev,
                position: newPosition
            };
        });
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const {name, value} = e.target;
        setRestaurant(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (restaurantId) {
                await updateRestaurant(restaurant, token);
            } else {
                const restaurantRequest: IRestaurantRequest = {
                    name: restaurant.name,
                    description: restaurant.description,
                    position: restaurant.position,
                    category: restaurant.category
                };
                await createRestaurant(restaurantRequest, token);
            }
            onSave();
        } catch (err) {
            console.error("Error saving restaurant:", err);
            setError(restaurantId 
                ? "Nie udało się zaktualizować restauracji" 
                : "Nie udało się utworzyć restauracji");
        }
    };

    if (loading) return <Typography>Ładowanie...</Typography>;

    return (
        <Paper sx={{p: 3, maxWidth: 600, mx: "auto", mt: 3}}>
            <Typography variant="h6" gutterBottom>
                {restaurantId ? "Edytuj restaurację" : "Nowa restauracja"}
            </Typography>

            {error && (
                <Typography color="error" sx={{mb: 2}}>
                    {error}
                </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Nazwa restauracji"
                    name="name"
                    value={restaurant.name}
                    onChange={handleChange}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    id="description"
                    label="Opis"
                    name="description"
                    multiline
                    rows={4}
                    value={restaurant.description}
                    onChange={handleChange}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="latitude"
                        label="Szerokość geograficzna"
                        type="number"
                        value={restaurant.position[0]}
                        onChange={(e) => handleCoordinateChange(e as ChangeEvent<HTMLInputElement>, 0)}
                        inputProps={{ step: 'any' }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="longitude"
                        label="Długość geograficzna"
                        type="number"
                        value={restaurant.position[1]}
                        onChange={(e) => handleCoordinateChange(e as ChangeEvent<HTMLInputElement>, 1)}
                        inputProps={{ step: 'any' }}
                    />
                </Box>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Kategoria</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={restaurant.category}
                        label="Kategoria"
                        onChange={handleSelectChange}
                        variant="outlined">
                        {categories.map(category => (
                            <MenuItem key={category.restaurantCategoryId} value={category.categoryName}>
                                {category.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{mt: 3, display: "flex", justifyContent: "space-between"}}>
                    <Button type="button" variant="outlined" onClick={onCancel}>
                        Anuluj
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Zapisz
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}

