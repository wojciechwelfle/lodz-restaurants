import React, {useState, useMemo} from "react";
import Map from "./Map";
import Navbar from "./Navbar";
import restaurantsData from "../data/restaurants";
import type IRestaurant from "../types/IRestaurant";
import RestaurantSearch from "./RestaurantSearch";
import RestaurantList from "./RestaurantList";
import {useDebounce} from "../hooks/useDebounce";
import RestaurantDetails from "./RestaurantsDetails.tsx";

const AppPage: React.FC = () => {
    const [selected, setSelected] = useState<IRestaurant | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const filteredRestaurants = useMemo(
        () => restaurantsData.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ),
        [debouncedSearchQuery]
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleRestaurantSelect = (restaurant: IRestaurant) => {
        setSelected(restaurant);
    };

    const handleCloseDetails = () => {
        setSelected(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar/>

            <div className="flex flex-col md:flex-row flex-1">
                <div
                    className="w-full md:w-1/3 p-4 overflow-y-auto bg-gradient-to-r from-purple-100 to-blue-50 shadow-lg">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">📍 Restauracje</h2>

                    <RestaurantSearch onSearch={handleSearch}/>

                    <RestaurantList
                        restaurants={filteredRestaurants}
                        onSelectRestaurant={handleRestaurantSelect}
                    />
                </div>

                <div className="w-full md:w-2/3 h-[300px] md:h-auto bg-white shadow-lg rounded-lg">
                    <Map restaurants={restaurantsData} selected={selected}/>
                </div>

                {selected && (
                    <RestaurantDetails restaurant={selected} onClose={handleCloseDetails}/>
                )}
            </div>
        </div>
    );
};

export default AppPage;
