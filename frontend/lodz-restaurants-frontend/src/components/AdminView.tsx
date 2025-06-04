import {Box, Container, Tab, Tabs, Typography} from "@mui/material";
import RestaurantsAdmin from "./RestaurantsAdmin.tsx";
import DishesAdmin from "./DishesAdmin.tsx";
import {useState} from "react";


const AdminView = () => {
    const [tab, setTab] = useState(0);

    return (
        <Container>
            <Typography variant="h4" sx={{my: 4}}>Panel Administratora</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                <Tab label="Restauracje"/>
                <Tab label="Dania i Menu"/>
            </Tabs>
            <Box sx={{mt: 4}}>
                {tab === 0 && <RestaurantsAdmin/>}
                {tab === 1 && <DishesAdmin/>}
            </Box>
        </Container>
    );
}

export default AdminView;