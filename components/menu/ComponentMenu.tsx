import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react'
import { ArrayMenu } from './ArrayMenu';
import Link from 'next/link';

const ComponentMenu = ({ open }: { open: boolean }) => {
    return (
        <List>

            {
                ArrayMenu.map((value, idex) => {
                    return (
                        <ListItem key={idex} disablePadding sx={{ display: 'block' }} component={Link} href={value.path ?? "/admin"}>
                            <ListItemButton
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                    },
                                    open
                                        ? {
                                            justifyContent: 'initial',
                                        }
                                        : {
                                            justifyContent: 'center',
                                        },
                                ]}

                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: 'center',
                                        },
                                        open
                                            ? {
                                                mr: 3,
                                            }
                                            : {
                                                mr: 'auto',
                                            },
                                    ]}
                                >
                                    {value.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={value.label}
                                    sx={[
                                        open
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                })
            }

        </List>
    )
}

export default ComponentMenu
