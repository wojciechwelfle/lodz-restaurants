import React, {useState, useMemo, useEffect} from "react";
import Map from "../components/Map.tsx";
import restaurantsData from "../data/restaurants.ts";
import type IRestaurant from "../types/IRestaurant.ts";
import RestaurantSearch from "../components/RestaurantSearch.tsx";
import RestaurantList from "../components/RestaurantList.tsx";
import {useDebounce} from "../hooks/useDebounce.ts";
import RestaurantDetails from "../components/RestaurantsDetails.tsx";
import {API_URL, ONLINE_MODE} from "../constants.ts";

const AppPage: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [selected, setSelected] = useState<IRestaurant | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        if (ONLINE_MODE) {
            fetch(`${API_URL}/v1/restaurants`)
                .then((response) => response.json())
                .then((data) => setRestaurants(data))
                .catch((error) => {
                    console.error("Failed to fetch online data:", error);
                    setRestaurants(restaurantsData);
                });
        }
    }, []);

    const filteredRestaurants = useMemo(() =>
            restaurants.filter((restaurant) =>
                restaurant.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            ),
        [debouncedSearchQuery, restaurants]
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
            <div className="flex flex-col md:flex-row flex-1">
                <div
                    className="w-full md:w-1/3 p-4 overflow-y-auto bg-gradient-to-r from-blue-100 to-blue-50 shadow-lg">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">📍 Restauracje</h2>

                    <RestaurantSearch onSearch={handleSearch}/>

                    <RestaurantList
                        restaurants={filteredRestaurants}
                        onSelectRestaurant={handleRestaurantSelect}
                    />
                </div>

                <div className="w-full md:w-2/3 h-[300px] md:h-auto bg-white shadow-lg rounded-lg">
                    <Map restaurants={restaurants} selected={selected}/>
                </div>

                {selected && (
                    <RestaurantDetails restaurant={selected} onClose={handleCloseDetails}/>
                )}
            </div>
        </div>
    );
};

export default AppPage;
