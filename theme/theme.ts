'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    spacing: 4,
    palette: {
        mode: 'light',
        primary: {
            main: '#2563EB',
            dark: '#1E40AF',
            light: '#DBEAFE',
        },
        secondary: {
            main: '#0D9488',
        },
        error: {
            main: '#E11D48',
        },
        warning: {
            main: '#F59E0B',
        },
        background: {
            default: '#F1F5F9',
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        fontSize: 13,
        h6: { fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '0.85rem' },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: "#cbd5e1 transparent",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": { width: 8, height: 8 },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#cbd5e1",
                        minHeight: 24,
                        border: "2px solid transparent",
                        backgroundClip: "content-box",
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": { backgroundColor: "#94a3b8" },
                },
            },
        },
        // --- INPUTS: OUTLINED PROFESIONAL ---
        MuiTextField: {
            defaultProps: {
                size: 'small',
                variant: 'outlined', // Cambiado a Outlined
                slotProps: { htmlInput: { step: 'any' } }
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        //backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                        transition: 'all 0.2s',
                        '& fieldset': {
                            //borderColor: '#E2E8F0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#2563EB',
                        },
                        // Solución al problema del Focus y el Label
                        //'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        //    borderColor: '#2563EB',
                        //    borderWidth: '2px',
                        //    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                        //},
                    },
                    // Asegura que el label no se encime con la sombra
                    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                        //backgroundColor: '#FFFFFF',
                        padding: '0 4px',
                        marginLeft: '-2px',
                    },
                },
            },
        },
        // --- BOTONES: FIX HOVER OUTLINED ---
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                },
                outlined: {
                    '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        color: '#1E40AF',
                        borderColor: '#1E40AF',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 6, fontWeight: 500 },
                colorSecondary: { backgroundColor: '#CCFBF1', color: '#115E59' },
                colorError: { backgroundColor: '#FFE4E6', color: '#9F1239' },
            },
        },
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme;