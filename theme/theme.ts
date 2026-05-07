'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

// Cargamos la fuente Roboto para asegurar consistencia
const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2C5F9E', // Un azul médico profesional, no tan oscuro
            light: '#5B8AD9',
            dark: '#1A3E6D',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00A896', // Verde azulado clínico (evoca higiene y salud)
            light: '#4FBFA8',
            dark: '#007A6C',
        },
        error: {
            main: '#D32F2F', // Para alertas críticas en el expediente
        },
        warning: {
            main: '#F57C00', // Alergias o advertencias médicas
        },
        info: {
            main: '#0288D1',
        },
        success: {
            main: '#2E7D32',
        },
        background: {
            default: '#F4F7F9', // Gris azulado muy tenue para el fondo general
            paper: '#ffffff',   // Blanco puro para las tarjetas de expediente
        },
        text: {
            primary: '#1A2027', // Casi negro para legibilidad máxima
            secondary: '#5F6D7E',
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: { fontSize: '2.5rem', fontWeight: 600, color: '#1A3E6D' },
        h2: { fontSize: '2rem', fontWeight: 600, color: '#1A3E6D' },
        h5: { fontWeight: 500 },
        body1: { fontSize: '1rem', lineHeight: 1.6 },
        button: { textTransform: 'none', fontWeight: 600 }, // Botones sin mayúsculas forzadas
    },
    shape: {
        borderRadius: 8, // Bordes ligeramente redondeados para una UI amigable
    },
    components: {
        // Personalización de componentes específicos
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: 'none',
                    //'&:hover': {
                    //    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                    //},
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)', // Sombra suave para las "fichas" médicas
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small', // Más compacto para formularios densos
            },
        },
    },
});

export default theme;