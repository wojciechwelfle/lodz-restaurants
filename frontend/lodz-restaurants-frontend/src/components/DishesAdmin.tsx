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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDish, getAllMenus } from "../data/api";
import type IMenu from "../types/IMenu";

export default function DishesAdmin() {
    const [menus, setMenus] = useState<IMenu[]>([]);

    useEffect(() => {
        getAllMenus().then(setMenus);
    }, []);

    const handleDelete = async (menuId: number, dishId: number) => {
        try {
            await deleteDish(dishId);
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

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4">
            <Typography variant="h6" className="mb-4 text-center">
                Menu i Dania
            </Typography>

            {menus.map((menu) => (
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
    );
}
