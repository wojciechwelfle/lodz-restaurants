import React, { useState } from "react";
import { TextField } from "@mui/material";

interface RestaurantSearchProps {
    onSearch: (query: string) => void;
}

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <div className="mb-4">
            <TextField
                label="Wyszukaj restaurację"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ marginBottom: 3 }}
            />
        </div>
    );
};

export default RestaurantSearch;
