import { Divider, IconButton } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Conversations } from './Window/Conversations';
import { PropTypes } from 'prop-types';

/**
 * The HeaderMenu returns navigation elements for managing the current user
 * @returns User navigation elements
 */
export default function HeaderMenu(props) {
    
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const accountView = (event) => {
        props.header.accountView();
        handleClose(event);
        event.preventDefault();
    }

    const accountSettings = (event) => {
        props.header.accountSettings();
        handleClose(event);
        event.preventDefault();
    }

    const viewMessages = (event) => {
        props.router.updateContent(<Conversations router={props.router} user={props.router.getUserID()}/>);
        handleClose(event);
        event.preventDefault();
    }

    const logOut = (event) => {

        props.router.signOut();
        setOpen(false);

        event.preventDefault();

    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div>
            <IconButton className={props.router.getStyles('b_MenuIcon')} onClick={handleToggle}>
                <MenuIcon />
            </IconButton>
            <div ref={anchorRef}/>
            
            <Popper open={open} anchorEl={anchorRef.current} transition >
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        in={open}
                        style={{ transformOrigin: 'right' }}
                    >
                        <Paper square elevation={0} className={props.router.getStyles('headerMenu')}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open}>
                                    <div hidden={(props.router.getUserID() === '') ? true : false}>
                                        <MenuItem onClick={accountView}>Profile</MenuItem>
                                        <Divider light={true} variant='middle' className={props.router.getStyles('divider')} />
                                        <MenuItem onClick={viewMessages}>View Messages</MenuItem>
                                        <Divider light={true} variant='middle' className={props.router.getStyles('divider')} />
                                        <MenuItem onClick={accountSettings} >My account</MenuItem>
                                        <Divider variant='middle' className={props.router.getStyles('divider')} />
                                        <MenuItem onClick={logOut}>Logout</MenuItem>
                                    </div>
                                    <div>
                                        <MenuItem onClick={handleClose}>---</MenuItem>
                                        <Divider variant='middle' className={props.router.getStyles('divider')} />
                                        <MenuItem onClick={handleClose}>About</MenuItem>
                                    </div>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}

            </Popper>
        </div>
    );
}

HeaderMenu.propTypes = {
    /**
     * The router component to be used, use MainWindowController for most cases
     */
    router: PropTypes.elementType,
    /**
     * The Header component parent to be used
     */
    header: PropTypes.elementType
}