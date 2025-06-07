import {API_URL} from "../constants.ts";
import type IReservationTable from "../types/IReservationTable.ts";
import type IReservationRequest from "../types/IReservationRequest.ts";
import type IRestaurantRequest from "../types/IRestaurantRequest.ts";

export async function getRestaurants() {
    const res = await fetch(`${API_URL}/v1/restaurants`);
    if (!res.ok) throw new Error("Błąd podczas pobierania restauracji");
    return res.json();
}

export async function getRestaurantById(id: number) {
    const res = await fetch(`${API_URL}/v1/restaurants/${id}`);
    if (!res.ok) throw new Error("Błąd podczas pobierania restauracji");
    return res.json();
}

export async function getAllCategories() {
    const res = await fetch(`${API_URL}/v1/restaurants/categories`);
    if (!res.ok) throw new Error("Błąd pobierania kategorii");
    return res.json();
}

export async function updateRestaurant(restaurant: any, token: string) {
    const res = await fetch(`${API_URL}/v1/restaurants/${restaurant.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(restaurant),
    });
    if (!res.ok) throw new Error("Błąd aktualizacji restauracji");
    return res.json();
}

export async function deleteRestaurant(id: number, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/v1/restaurants/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Błąd usuwania restauracji");
}

export async function createRestaurant(data: IRestaurantRequest, token: string) {
    const requestBody = {
        name: data.name,
        description: data.description,
        position: data.position,
        category: data.category
    };
    
    const res = await fetch(`${API_URL}/v1/restaurants`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    });
    if (!res.ok) throw new Error("Błąd tworzenia restauracji");
    return res.json();
}

export async function getAllMenus() {
    const res = await fetch(`${API_URL}/v1/menu`);
    if (!res.ok) throw new Error("Błąd pobierania menu");
    return res.json();
}

export async function deleteDish(dishId: number, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/v1/dishes/${dishId}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
    if (!res.ok) throw new Error("Błąd usuwania dania");
}

export async function login(username: string, password: string): Promise<string> {
    const res = await fetch(`${API_URL}/v1/authorization/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password}),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    return data.token;
}

export async function getAllReservationTables(restaurantId: number): Promise<IReservationTable[]> {
    const res = await fetch(`${API_URL}/v1/reservation-tables/${restaurantId}`);
    if (!res.ok) throw new Error("Błąd pobierania stolików rezerwacji");
    return res.json();
}

export async function makeReservation(reservationData: IReservationRequest): Promise<void> {
    const res = await fetch(`${API_URL}/v1/reservation-tables`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
    });
    if (!res.ok) throw new Error("Błąd podczas rezerwacji stolika");
}

export async function generateReservationTables(
    restaurantId: number,
    numberOfTables: number,
    seats: number,
    date: string,
    fromHour: number,
    toHour: number,
    token: string
): Promise<void> {
    const res = await fetch(`${API_URL}/v1/reservation-tables/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
            restaurantId, 
            numberOfTables, 
            seats, 
            date, 
            fromHour, 
            toHour 
        }),
    });
    if (!res.ok) throw new Error("Błąd generowania stolików rezerwacji");
}

