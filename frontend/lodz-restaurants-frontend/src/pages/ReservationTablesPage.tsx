import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {getAllReservationTables} from "../data/api.ts";
import type IReservationTable from "../types/IReservationTable.ts";
import {Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Switch, FormControlLabel, Box} from "@mui/material";

const ReservationTablesPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [reservationTables, setReservationTables] = React.useState<IReservationTable[]>([]);
    const [showAvailableOnly, setShowAvailableOnly] = React.useState<boolean>(false);

    useEffect(() => {
        getAllReservationTables(Number(id)).then(
            (tables: IReservationTable[]) => {
                setReservationTables(tables);
            }
        ).catch((error) => {
                console.error("Error fetching reservation tables:", error);
            }
        )
    }, [id]);

    const handleReserve = (tableId: number) => {
        console.log(`Reserving table with ID: ${tableId}`);
    };

    const filteredTables = showAvailableOnly
        ? reservationTables.filter(table => table.isAvailable)
        : reservationTables;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Reservation Tables
            </Typography>
            <FormControlLabel
                control={
                    <Switch
                        checked={showAvailableOnly}
                        onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    />
                }
                label="Show Available Tables Only"
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Stolik</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Siedzenia</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Zarezerwuj</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredTables.map((table: IReservationTable) => (
                        <TableRow key={table.tableNumber}>
                            <TableCell>{table.reservationId}</TableCell>
                            <TableCell>{table.tableNumber}</TableCell>
                            <TableCell>{table.hour}:00 {table.date}</TableCell>
                            <TableCell>{table.seats}</TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            backgroundColor: table.isAvailable ? "green" : "red",
                                            marginRight: 1,
                                        }}
                                    />
                                    {table.isAvailable ? "Dostępne" : "Niedostępne"}
                                </Box>
                            </TableCell>
                            <TableCell>
                                {table.isAvailable ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleReserve(table.reservationId)}
                                    >
                                        Rezerwuj
                                    </Button>
                                ) : (
                                    <Button variant="contained" disabled>
                                        Zajęte
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}

export default ReservationTablesPage;

