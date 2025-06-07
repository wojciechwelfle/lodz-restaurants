import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getAllReservationTables, makeReservation} from "../data/api.ts";
import type IReservationTable from "../types/IReservationTable.ts";
import type IReservationRequest from "../types/IReservationRequest.ts";
import {
    Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Switch, 
    FormControlLabel, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    Snackbar, Alert
} from "@mui/material";

const ReservationTablesPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [reservationTables, setReservationTables] = useState<IReservationTable[]>([]);
    const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [selectedTableNumber, setSelectedTableNumber] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    
    const [formData, setFormData] = useState<Omit<IReservationRequest, "reservationTableId">>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: ""
    });

    useEffect(() => {
        loadReservationTables();
    }, [id, setReservationTables]);

    const loadReservationTables = () => {
        getAllReservationTables(Number(id)).then(
            (tables: IReservationTable[]) => {
                setReservationTables(tables);
            }
        ).catch((error) => {
                console.error("Error fetching reservation tables:", error);
            }
        );
    };

    const handleReserve = (tableId: number, tableNumber: number) => {
        setSelectedTableId(tableId);
        setSelectedTableNumber(tableNumber as unknown as string);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setFormData({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: ""
        });
        setFormErrors({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        
        if (!formData.firstName.trim()) {
            errors.firstName = "Imię jest wymagane";
        }
        
        if (!formData.lastName.trim()) {
            errors.lastName = "Nazwisko jest wymagane";
        }
        
        const phoneRegex = /^\+?[0-9]{9,15}$/;
        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Numer telefonu jest wymagany";
        } else if (!phoneRegex.test(formData.phoneNumber.trim())) {
            errors.phoneNumber = "Nieprawidłowy format numeru telefonu";
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = "Email jest wymagany";
        } else if (!emailRegex.test(formData.email.trim())) {
            errors.email = "Nieprawidłowy format adresu email";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitReservation = async () => {
        if (!validateForm() || selectedTableId === null) return;
        
        try {
            const reservationData: IReservationRequest = {
                reservationTableId: selectedTableId,
                ...formData
            };
            console.log(reservationData)
            await makeReservation(reservationData);
            handleCloseDialog();
            setSnackbarMessage("Stolik został zarezerwowany pomyślnie!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            loadReservationTables(); // Refresh the table data
        } catch (error) {
            console.error("Error making reservation:", error);
            setSnackbarMessage("Wystąpił błąd podczas rezerwacji stolika.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const filteredTables = showAvailableOnly
        ? reservationTables.filter(table => table.isAvailable)
        : reservationTables;

    return (
        <Container>
            <br/>
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
                        <TableRow key={table.reservationId}>
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
                                        onClick={() => handleReserve(table.reservationId, table.tableNumber)}
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

            {/* Reservation Dialog */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Rezerwacja stolika {selectedTableNumber}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
                        <TextField
                            label="Imię"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.firstName}
                            helperText={formErrors.firstName || ""}
                            required
                        />
                        <TextField
                            label="Nazwisko"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.lastName}
                            helperText={formErrors.lastName || ""}
                            required
                        />
                        <TextField
                            label="Numer telefonu"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.phoneNumber}
                            helperText={formErrors.phoneNumber || ""}
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.email}
                            helperText={formErrors.email || ""}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Anuluj</Button>
                    <Button 
                        onClick={handleSubmitReservation} 
                        color="primary" 
                        variant="contained"
                    >
                        Zarezerwuj
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ReservationTablesPage;
