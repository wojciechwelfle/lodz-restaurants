import React from "react";
import {TextField, Select, MenuItem, FormControl, InputLabel, Box} from "@mui/material";

interface RestaurantSearchProps {
    onSearch: (query: string) => void;
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({
                                                               onSearch,
                                                               categories,
                                                               selectedCategory,
                                                               onCategoryChange,
                                                           }) => {
    return (
        <>
            <Box display="flex" flexDirection="row" gap={2}>
                <TextField
                    label="Szukaj"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => onSearch(e.target.value)}
                />
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="category-label">Kategoria</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category-select"
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        label="Kategoria"
                        fullWidth
                        variant={"outlined"}>
                        <MenuItem value="">Wszystkie</MenuItem>
                        {categories && categories.length > 0 ? (
                            categories.map((category, index) => (
                                <MenuItem key={`${category}-${index}`} value={category}>
                                    {category}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No categories available</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Box>
            <br/>
        </>
    );
};

export default RestaurantSearch;