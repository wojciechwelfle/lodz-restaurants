import { useEffect, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    IconButton,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Button,
    Pagination,
    Select,
    MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDish, getAllMenus, addDish } from "../data/api";
import type IMenu from "../types/IMenu";
import type IDish from "../types/IDish";

export default function DishesAdmin({ token }: { token: string }) {
    const [menus, setMenus] = useState<IMenu[]>([]);
    const [newDish, setNewDish] = useState<IDish>({
        dishId: 0,
        dishName: "",
        dishDescription: "",
        dishPrice: 0,
        vip: false,
    });
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [filteredMenus, setFilteredMenus] = useState<IMenu[]>([]);
    const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
    const [showAddDishForm, setShowAddDishForm] = useState(false);

    useEffect(() => {
        getAllMenus().then(setMenus);
    }, []);

    useEffect(() => {
        const filtered = menus.filter((menu) =>
            menu.menuName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredMenus(filtered.slice((page - 1) * 5, page * 5));
    }, [menus, search, page]);

    const handleDelete = async (menuId: number, dishId: number) => {
        try {
            await deleteDish(dishId, token);
            setMenus((prevMenus) =>
                prevMenus.map((menu) =>
                    menu.menuId === menuId
                        ? {
                              ...menu,
                              dishes: menu.dishes.filter((dish) => dish.dishId !== dishId),
                          }
                        : menu
                )
            );
        } catch (err) {
            console.error("Błąd usuwania dania:", err);
        }
    };

    const handleAddDish = async () => {
        if (!newDish.dishName || !selectedMenuId) return;
        try {
            const dishPayload = {
                dishName: newDish.dishName,
                dishDescription: newDish.dishDescription,
                dishPrice: newDish.dishPrice,
                vip: newDish.vip,
            };
            const addedDish = await addDish(selectedMenuId, dishPayload, token);
            setMenus((prevMenus) =>
                prevMenus.map((menu) =>
                    menu.menuId === selectedMenuId
                        ? { ...menu, dishes: [...menu.dishes, addedDish] }
                        : menu
                )
            );
            setNewDish({
                dishId: 0,
                dishName: "",
                dishDescription: "",
                dishPrice: 0,
                vip: false,
            });
        } catch (err) {
            console.error("Błąd dodawania dania:", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4">
            <Typography variant="h6" className="mb-4 text-center">
                Menu i Dania
            </Typography>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <TextField
                    label="Szukaj menu"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: "1 1 auto", marginRight: "16px" }}
                />
            </div>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAddDishForm((prev) => !prev)}
                className="mb-4"
            >
                {showAddDishForm ? "Ukryj formularz dodawania dania" : "Dodaj nowe danie"}
            </Button>

            {showAddDishForm && (
                <div className="mb-8">
                    <Typography variant="h6" className="mb-4 text-center p-4">
                        Dodaj nowe danie
                    </Typography>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
                        <Select
                            value={selectedMenuId || ""}
                            onChange={(e) => setSelectedMenuId(Number(e.target.value))}
                            displayEmpty
                            style={{ flex: "1 1 200px" }}
                            variant={"outlined"}>
                            <MenuItem value="" disabled>
                                Wybierz menu
                            </MenuItem>
                            {menus.map((menu) => (
                                <MenuItem key={menu.menuId} value={menu.menuId}>
                                    {menu.menuName}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Nazwa dania"
                            variant="outlined"
                            value={newDish.dishName}
                            onChange={(e) => setNewDish({ ...newDish, dishName: e.target.value })}
                            style={{ flex: "1 1 200px" }}
                        />
                        <TextField
                            label="Cena"
                            variant="outlined"
                            type="number"
                            value={newDish.dishPrice}
                            onChange={(e) => setNewDish({ ...newDish, dishPrice: parseFloat(e.target.value) })}
                            style={{ flex: "1 1 100px" }}
                        />
                        <TextField
                            label="Opis dania"
                            variant="outlined"
                            value={newDish.dishDescription || ""}
                            onChange={(e) => setNewDish({ ...newDish, dishDescription: e.target.value })}
                            style={{ flex: "2 1 300px" }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Typography variant="body1">VIP:</Typography>
                            <input
                                type="checkbox"
                                checked={newDish.vip}
                                onChange={(e) => setNewDish({ ...newDish, vip: e.target.checked })}
                            />
                        </div>
                        <Button variant="contained" color="primary" onClick={handleAddDish}>
                            Dodaj danie
                        </Button>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <Typography variant="h6" className="mb-4 text-center">
                    Lista menu
                </Typography>
                {filteredMenus.map((menu) => (
                    <Accordion key={menu.menuId}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {menu.menuName}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {menu.dishes.length === 0 ? (
                                <Typography variant="body2" color="textSecondary">
                                    Brak dań w tym menu.
                                </Typography>
                            ) : (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nazwa dania</TableCell>
                                            <TableCell>Cena</TableCell>
                                            <TableCell>Akcje</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {menu.dishes.map((dish) => (
                                            <TableRow key={dish.dishId}>
                                                <TableCell>{dish.dishName}</TableCell>
                                                <TableCell>{dish.dishPrice.toFixed(2)} zł</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="Usuń"
                                                        onClick={() =>
                                                            handleDelete(menu.menuId, dish.dishId)
                                                        }
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>

            <Pagination
                count={Math.ceil(menus.length / 5)}
                page={page}
                onChange={(_e, value) => setPage(value)}
                className="mt-4 mb-12"
            />
        </div>
    );
}
