export default interface IReservationTable {
    reservationId: number;
    tableNumber: number;
    seats: number;
    date: string;
    hour: number;
    isAvailable: boolean;
}