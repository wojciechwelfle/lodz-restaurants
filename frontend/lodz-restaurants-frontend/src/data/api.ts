import {API_URL} from "../constants.ts";

export async function getRestaurants() {
    const res = await fetch(`${API_URL}/v1/restaurants`);
    if (!res.ok) throw new Error("Błąd podczas pobierania restauracji");
    return res.json();
}

export async function deleteRestaurant(id: number) {
    const res = await fetch(`${API_URL}/v1/restaurants/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Błąd usuwania restauracji");
}

// export async function createRestaurant(data: any) {
//     const res = await fetch(`${API_URL}/v1/restaurants`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//     });
//     if (!res.ok) throw new Error("Błąd tworzenia restauracji");
//     return res.json();
// }

export async function getAllMenus() {
    const res = await fetch(`${API_URL}/v1/menu`);
    if (!res.ok) throw new Error("Błąd pobierania menu");
    return res.json();
}

export async function deleteDish(dishId: number): Promise<void> {
    const res = await fetch(`${API_URL}/v1/dishes/${dishId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Błąd usuwania dania");
}