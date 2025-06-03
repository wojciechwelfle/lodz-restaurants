import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import RestaurantsAdmin from "../components/RestaurantsAdmin";
import DishesAdmin from "../components/DishesAdmin";

export default function AdminPage() {
    const [tab, setTab] = useState(0);

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 4 }}>Panel Administratora</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                <Tab label="Restauracje" />
                <Tab label="Dania i Menu" />
            </Tabs>
            <Box sx={{ mt: 4 }}>
                {tab === 0 && <RestaurantsAdmin />}
                {tab === 1 && <DishesAdmin />}
            </Box>
        </Container>
    );
}
