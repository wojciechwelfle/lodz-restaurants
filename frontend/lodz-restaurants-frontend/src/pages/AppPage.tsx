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
    const [categories, setCategories] = useState<string[]>([]);
    const [selected, setSelected] = useState<IRestaurant | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [highlightedRestaurantId, setHighlightedRestaurantId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        if (ONLINE_MODE) {
            Promise.all([
                fetch(`${API_URL}/v1/restaurants`).then((response) => response.json()),
                fetch(`${API_URL}/v1/restaurants/categories`).then((response) => response.json()),
            ])
                .then(([restaurantsData, categoriesData]) => {
                    setRestaurants(restaurantsData);
                    setCategories(categoriesData.map((category: { categoryName: string }) => category.categoryName));
                })
                .catch((error) => {
                    console.error("Failed to fetch data:", error);
                    setRestaurants(restaurantsData); // Fallback to local data
                });
        }
    }, []);

    const filteredRestaurants = useMemo(() =>
            restaurants.filter((restaurant) =>
                restaurant.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) &&
                (selectedCategory === "" || restaurant.category === selectedCategory)
            ),
        [debouncedSearchQuery, restaurants, selectedCategory]
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const handleRestaurantSelect = (restaurant: IRestaurant) => {
        setSelected(restaurant);
    };

    const handleMarkerClick = (restaurant: IRestaurant) => {
        setSelected(restaurant);
        setRestaurants((prevRestaurants) => {
            const updatedRestaurants = prevRestaurants.filter((r) => r.id !== restaurant.id);
            return [restaurant, ...updatedRestaurants];
        });
    };

    const handleMarkerHighlight = (restaurantId: number) => {
        setHighlightedRestaurantId(restaurantId);
        setTimeout(() => setHighlightedRestaurantId(null), 3000);
    };

    const handleCloseDetails = () => {
        setSelected(null);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col md:flex-row flex-1">
                <div
                    className="w-full md:w-1/3 p-4 bg-gradient-to-r from-blue-100 to-blue-50 shadow-lg overflow-y-auto h-screen">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">📍 Restauracje</h2>

                    <div className="w-full">
                        <RestaurantSearch
                            onSearch={handleSearch}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>

                    <RestaurantList
                        restaurants={filteredRestaurants}
                        onSelectRestaurant={handleRestaurantSelect}
                        highlightedRestaurantId={highlightedRestaurantId}
                    />
                </div>

                <div className="w-full md:w-2/3 h-full bg-white shadow-lg rounded-lg">
                    <Map
                        restaurants={filteredRestaurants}
                        selected={selected}
                        onMarkerClick={handleMarkerClick}
                        onMarkerHighlight={handleMarkerHighlight}
                    />
                </div>

                {selected && (
                    <RestaurantDetails restaurant={selected} onClose={handleCloseDetails}/>
                )}
            </div>
        </div>
    );
};

export default AppPage;
