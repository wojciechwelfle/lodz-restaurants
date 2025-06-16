import {Box, Container, Tab, Tabs, Typography} from "@mui/material";
import RestaurantsAdmin from "./RestaurantsAdmin.tsx";
import DishesAdmin from "./DishesAdmin.tsx";
import {useState} from "react";
import ReservationsAdmin from "./ReservationsAdmin.tsx";


const AdminView = ({token} : { token: string }) => {
    const [tab, setTab] = useState(0);

    return (
        <Container>
            <Typography variant="h4" sx={{my: 4}}>Panel Administratora</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                <Tab label="Restauracje"/>
                <Tab label="Dania i Menu"/>
                <Tab label="Rezerwacje" />
            </Tabs>
            <Box sx={{mt: 4}}>
                {tab === 0 && <RestaurantsAdmin token={token}/>}
                {tab === 1 && <DishesAdmin token={token}/>}
                {tab === 2 && <ReservationsAdmin token={token}/>}
            </Box>
        </Container>
    );
}

export default AdminView;