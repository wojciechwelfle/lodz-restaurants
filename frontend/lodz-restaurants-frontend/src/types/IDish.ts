export default interface IDish {
    dishId: number;
    dishName: string;
    dishDescription?: string;
    dishPrice: number;
    vip: boolean;
}