import { MenuItem } from "./menu-item";
import { Biotech, Event, PeopleAlt, PersonalInjury } from '@mui/icons-material';

export const ArrayMenu: MenuItem[] = [
    {
        label: "Pacientes",
        icon:<PersonalInjury />,
        path:"/admin/patient/index",
        title: "patient",
        permission: "",
    },
    {
        label: "Citas",
        icon:<Event />,
        path:"/admin/appointmen/index",
        title: "appointment",
        permission: "",
    },
    {
        label: "Estudios",
        icon:<Biotech />,
        path:"/admin/studies/index",
        title: "studies",
        permission: "",
    },
    {
        label: "Usuarios",
        icon:<PeopleAlt />,
        path:"/admin/users/index",
        title: "users",
        permission: "",
    }
]