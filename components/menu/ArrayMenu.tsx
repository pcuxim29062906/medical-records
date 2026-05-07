import { MenuItem } from "./menu-item";
import { Biotech, Event, PersonalInjury } from '@mui/icons-material';

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
    }
]