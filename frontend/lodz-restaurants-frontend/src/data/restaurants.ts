import type IRestaurant from "../types/IRestaurant.ts";

const restaurants: IRestaurant[] = [
    {
        id: 1,
        name: "Pizza Napoli",
        description: "Najlepsza pizza w mieście.",
        position: [52.2297, 21.0122],
        category: "Pizza",
        menuId: 1,
        rating: 4.8
    },
    {
        id: 2,
        name: "Sushi Zen",
        description: "Świeże sushi codziennie.",
        position: [52.23, 21.01],
        category: "Sushi",
        menuId: 2,
        rating: 4.5
    },
    {
        id: 3,
        name: "Burgery Max",
        description: "Domowe burgery i frytki.",
        position: [52.228, 21.015],
        category: "Burgery",
        menuId: 3,
        rating: 4.0
    },
];

export default restaurants;
