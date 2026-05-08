'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material';

import { ArrayMenu } from './ArrayMenu';

interface ComponentMenuProps {
    open: boolean;
}

const ComponentMenu = ({ open }: ComponentMenuProps) => {
    const pathname = usePathname();
    const [clientPathname, setClientPathname] = useState('');

    useEffect(() => {
        setClientPathname(pathname ?? '');
    }, [pathname]);

    return (
        <List sx={{ px: 1, py: 2 }}>
            {ArrayMenu.map((item) => {
                const href = item.path ?? '/admin';
                const selected = clientPathname === href;

                return (
                    <ListItem
                        key={item.label}
                        disablePadding
                        sx={{
                            display: 'flex',
                            justifyContent: open ? 'initial' : 'center',
                            mb: 0.5,
                        }}
                    >
                        <Tooltip title={open ? '' : item.label} placement="right" arrow>
                            <ListItemButton
                                component={Link}
                                href={href}
                                selected={selected}
                                disableGutters
                                sx={{
                                    width: open ? '100%' : 40,
                                    height: 40,
                                    minHeight: 40,
                                    p: 0,
                                    px: open ? 2 : 0,
                                    borderRadius: 3,
                                    justifyContent: open ? 'flex-start' : 'center',
                                    color: selected ? 'primary.contrastText' : 'text.secondary',
                                    bgcolor: selected ? 'primary.main' : 'transparent',

                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                    },

                                    '&.Mui-selected:hover': {
                                        bgcolor: 'primary.dark',
                                    },

                                    '&:hover': {
                                        bgcolor: selected ? 'primary.dark' : 'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        width: 40,
                                        height: 40,
                                        mr: open ? 2 : 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'inherit',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.label}
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                fontSize: 14,
                                                fontWeight: selected ? 700 : 500,
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    }}
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        width: open ? 'auto' : 0,
                                        overflow: 'hidden',
                                    }}
                                />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>

                );
            })}
        </List>
    );
};

export default ComponentMenu;

