'use client';

import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';

import ComponentMenu from '@/components/menu/ComponentMenu';
import { logoutUser } from '@/app/actions/auth/auth';

const drawerWidth = 240;
const closedDrawerWidth = 56;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
});

const closedMixin = (theme: Theme): CSSObject => ({
    width: closedDrawerWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
});

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: open
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
    }),

    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: open ? drawerWidth : closedDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',

    ...(open ? openedMixin(theme) : closedMixin(theme)),

    '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        borderRight: `1px solid ${theme.palette.divider}`,
        ...(open ? openedMixin(theme) : closedMixin(theme)),
    },
}));

interface AdminShellProps {
    children: React.ReactNode;
    user: {
        fullName: string;
        email: string;
        role: string;
    };
}

export default function AdminShell({ children, user }: AdminShellProps) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleOpenDrawer = () => setOpen(true);
    const handleCloseDrawer = () => setOpen(false);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            <AppBar position="fixed" open={open} elevation={1}>
                <Toolbar variant="dense">
                    <IconButton
                        color="inherit"
                        aria-label="Abrir menú"
                        onClick={handleOpenDrawer}
                        edge="start"
                        sx={{
                            mr: 2,
                            display: open ? 'none' : 'inline-flex',
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            flexGrow: 1,
                            fontSize: { xs: 16, sm: 18 },
                            fontWeight: 700,
                            textTransform: 'uppercase',
                        }}
                    >
                        Sistema Clínico
                    </Typography>

                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 4 }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.1, fontWeight: 600 }}>
                                {user.fullName}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                {user.role}
                            </Typography>
                        </Box>

                        <Button
                            color="error"
                            variant="contained"
                            size="small"
                            startIcon={<LogoutIcon />}
                            onClick={() => logoutUser()}
                            sx={{
                                minWidth: { xs: 36, sm: 'auto' },
                                px: { xs: 1, sm: 1.5 },
                                '& .MuiButton-startIcon': {
                                    mr: { xs: 0, sm: 0.5 },
                                },
                            }}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                Salir
                            </Box>
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <Toolbar
                    variant="dense"
                    sx={{
                        justifyContent: open ? 'flex-end' : 'center',
                        px: 1,
                    }}
                >
                    <IconButton
                        aria-label="Cerrar menú"
                        onClick={handleCloseDrawer}
                        size="small"
                        sx={{
                            width: 40,
                            height: 40,
                            display: open ? 'inline-flex' : 'none',
                        }}
                    >
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </Toolbar>

                <Divider />

                <ComponentMenu open={open} />
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    minHeight: '100vh',
                    bgcolor: 'grey.50',
                    p: { xs: 2, sm: 3 },
                }}
            >
                <Toolbar variant="dense" />
                {children}
            </Box>
        </Box>
    );
}
