import React, {useState, useMemo, useEffect, useCallback} from "react";
import Map from "../components/Map.tsx";
import restaurantsData from "../data/restaurants.ts";
import type IRestaurant from "../types/IRestaurant.ts";
import RestaurantSearch from "../components/RestaurantSearch.tsx";
import RestaurantList from "../components/RestaurantList.tsx";
import {useDebounce} from "../hooks/useDebounce.ts";
import RestaurantDetails from "../components/RestaurantsDetails.tsx";
import {API_URL, ONLINE_MODE} from "../constants.ts";

const AppPage: React.FC = () => {
    const [allRestaurants, setAllRestaurants] = useState<IRestaurant[]>([]);
    const [displayedRestaurants, setDisplayedRestaurants] = useState<IRestaurant[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selected, setSelected] = useState<IRestaurant | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [highlightedRestaurantId, setHighlightedRestaurantId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const ITEMS_PER_PAGE = 3;

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        if (ONLINE_MODE) {
            setIsLoading(true);
            Promise.all([
                fetch(`${API_URL}/v1/restaurants`).then((response) => response.json()),
                fetch(`${API_URL}/v1/restaurants/categories`).then((response) => response.json()),
            ])
                .then(([restaurantsData, categoriesData]) => {
                    setAllRestaurants(restaurantsData);
                    setCategories(categoriesData.map((category: { categoryName: string }) => category.categoryName));
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Failed to fetch data:", error);
                    setAllRestaurants(restaurantsData); // Fallback to local data
                    setIsLoading(false);
                });
        } else {
            setAllRestaurants(restaurantsData);
            const uniqueCategories = [...new Set(restaurantsData.map(r => r.category))].filter(Boolean);
            setCategories(uniqueCategories);
        }
    }, []);

    const filteredRestaurants = useMemo(() =>
            allRestaurants.filter((restaurant) =>
                restaurant.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) &&
                (selectedCategory === "" || restaurant.category === selectedCategory)
            ),
        [debouncedSearchQuery, allRestaurants, selectedCategory]
    );

    useEffect(() => {
        setPage(1);
        const initialItems = filteredRestaurants.slice(0, ITEMS_PER_PAGE);
        setDisplayedRestaurants(initialItems);
        setHasMore(filteredRestaurants.length > ITEMS_PER_PAGE);

        console.log("Filtered restaurants:", filteredRestaurants.length);
        console.log("Displaying:", initialItems.length);
    }, [filteredRestaurants]);

    const loadMoreRestaurants = useCallback(() => {
        if (isLoading || !hasMore) return;

        console.log("Loading more restaurants...");
        setIsLoading(true);

        setTimeout(() => {
            const nextPage = page + 1;
            const endIndex = nextPage * ITEMS_PER_PAGE;

            const newDisplayedRestaurants = [
                ...displayedRestaurants,
                ...filteredRestaurants.slice(displayedRestaurants.length, endIndex)
            ];

            console.log("New displayed restaurants:", newDisplayedRestaurants.length);
            setDisplayedRestaurants(newDisplayedRestaurants);
            setPage(nextPage);
            setHasMore(endIndex < filteredRestaurants.length);
            setIsLoading(false);
        }, 500);
    }, [filteredRestaurants, page, isLoading, hasMore, displayedRestaurants]);

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
                    className="w-full md:w-1/3 p-4 bg-gradient-to-r from-blue-100 to-blue-50 shadow-lg overflow-y-auto h-screen sidebar-container">
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
                        restaurants={displayedRestaurants}
                        onSelectRestaurant={handleRestaurantSelect}
                        highlightedRestaurantId={highlightedRestaurantId}
                        onLoadMore={loadMoreRestaurants}
                        isLoading={isLoading}
                        hasMore={hasMore}
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

