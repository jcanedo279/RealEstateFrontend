import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    CssBaseline,
    Drawer,
    Box,
    Toolbar,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../util/AuthContext';
import StyledIconButton from './material/StyledIconButton';
import StyledButton from './material/StyledButton';
import { useTheme } from '@mui/material/styles';


const Layout = ({ children, alignTop = 'space', opacity = 1 }) => {
    const { authState: { isAuthSession } } = useAuth();
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const theme = useTheme();

    let mt;
    switch (alignTop) {
        case 'align':
            mt = theme.spacingFactor.double;
            break;
        case 'space':
            mt = theme.spacingFactor.double + theme.spacingFactor.single;
            break;
        case 'none':
        default:
            mt = 0;
            break;
    }

    const toggleDrawer = (drawer, open) => () => {
        if (drawer === 'left') {
        setLeftDrawerOpen(open);
        } else {
        setRightDrawerOpen(open);
        }
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" sx={{ backgroundColor: 'primary.main', opacity: opacity }}>
                <Toolbar>
                    <StyledIconButton
                        edge="start"
                        onClick={toggleDrawer('left', true)}
                    >
                        <MenuIcon fontSize='medium' />
                    </StyledIconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <StyledButton
                            children = {<>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/logo_rounded_white.png`} alt="Logo" style={{ height: theme.spacing(4), marginRight: theme.spacing(1) }} />
                                <Typography variant="h3" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                                    Real Estate Rover
                                </Typography>
                            </>}
                            textStyle = 'secondary'
                            component={Link}
                            to='/'
                            sx={{ textTransform: 'none', boxShadow: 'none' }}
                        />
                    </Box>
                    <StyledIconButton
                        edge="end"
                        onClick={toggleDrawer('right', true)}
                    >
                        <AccountCircle fontSize='medium' />
                    </StyledIconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={leftDrawerOpen} onClose={toggleDrawer('left', false)}>
                <Box sx={{ width: 250 }}>
                    <List>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Home
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <ListItem button component={Link} to="/explore">
                            <ListItemIcon><ExploreIcon /></ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Explore
                                    </Typography>
                                }
                            />
                        </ListItem>
                            <ListItem button component={Link} to="/search">
                            <ListItemIcon><SearchIcon /></ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Property Search
                                    </Typography>
                                }
                            />
                        </ListItem>
                        {isAuthSession && (
                            <ListItem button component={Link} to="/saved">
                                <ListItemIcon><FavoriteIcon /></ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            Saved
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>

            <Drawer anchor="right" open={rightDrawerOpen} onClose={toggleDrawer('right', false)}>
                <Box sx={{ width: 250 }}>
                    <List>
                        {isAuthSession ? (
                            <>
                                <ListItem button component={Link} to="/profile">
                                    <ListItemIcon><PersonIcon /></ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                Your Profile
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem button component={Link} to="/logout">
                                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                Logout
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </>
                        ) : (
                            <ListItem button component={Link} to="/login">
                                <ListItemIcon><LoginIcon /></ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            Login
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ mt: mt, gap: theme.spacingFactor.single, height: '100%' }}>
                {children}
            </Box>
        </>
    );
};

export default Layout;
