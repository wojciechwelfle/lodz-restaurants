export default interface IRestaurant {
    id: number;
    name: string;
    description: string;
    position: [number, number]; // [latitude, longitude]
    website?: string;
}