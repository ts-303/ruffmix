import { CardHeader, Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import firebase from "firebase";
import React from "react";
import UserCard from "./UserCard";
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';

/**
 * The BrowseUsers window displays the latest newly registered users as UserCards. Selecting a UserCard will load that user's AccountView.
 */
export class BrowseUsers extends React.Component {
    static propTypes = {
        /**
         * The router component to be used, use MainWindowController for most cases
         */
        router: PropTypes.elementType
    }

    constructor(props){
        super(props);

        this.state = {
            userList: [],
        }
    }

    componentWillUnmount() {
        firebase.database().ref('users/').off('value');
    }

    /**
     * Will load all user information from Firebase for parsing.
     */
    componentDidMount() {
        var userRef = firebase.database().ref('users/');

        userRef.on('value', (snapshot) => {
            const users = snapshot.exportVal();
            this.getUsers(users);
        });

    }

    /**
     * Reads all users to be shown, using only those that chose to be shown publicly on the BrowseUsers window.
     * @param {*} uRef A Firebase reference for the list of users to load.
     */
    getUsers(uRef) {
        if (!uRef) return;
        const users = Object.entries(uRef);

        var getUsersArr = [];
            
        users.map((currentUser) => {

            if (currentUser[1].displayname) {
                var parsedRoles = JSON.parse(currentUser[1].roles);
                var parsedSettings = JSON.parse(currentUser[1].privacysettings);

                const userElement = <UserCard
                    router={this.props.router}
                    user={currentUser[0]}
                    displayName={currentUser[1].displayname}
                    roles={(currentUser[1].roles) ? Object.keys(parsedRoles).filter(role => parsedRoles[role] === true).join(" | ") : ''}
                    location={(currentUser[1].location) ? currentUser[1].location : ''}
                />

                if (parsedSettings['BrowseUsers']) getUsersArr.push(userElement);
            }
        });

        this.setState({
            userList: getUsersArr
        });
    }

    render() {
        return (
            <Grow in={true}>
                <Box display='flex' flexDirection='column' alignItems='center' height='100%'
                justifyContent='space-between' style={{position:'absolute', left: 0, top: 0, right: 0, overflowY: 'auto'}} >
                    <Box height='10%' style={{minHeight: '50px', position: 'sticky', top: 0}}>
                        <CardHeader className={this.props.router.getStyles('appBackground')} title="Recent Users" />
                    </Box>
                    <Grid height='80%' container justify="center" alignContent='center'>
                        {this.state.userList}
                    </Grid>
                    <Box height='10%'/>
                </Box>
            </Grow>
        )
    }
}