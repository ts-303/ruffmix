import { Avatar, Box, Button, CircularProgress, Collapse, Divider, Fade, Grid, IconButton, Slide, Table, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import React from "react";
import firebase from "../../firebase";
import './AccountView.css';
import { Conversations } from './Conversations';
import WaveForm from "./WaveForm";
import PropTypes from 'prop-types';
import { isMobile } from "react-device-detect";
import { MoreVert } from "@material-ui/icons";
import { AddComment } from "@material-ui/icons";

/**
 * Populates the user's track list using WaveForm components
 */
export function GetTracks(props) {

    if (!props.tracks) return (<div style={{color: '#e6eaff'}}>This user has not uploaded any tracks yet</div>);

    const objTracks = Object.values(props.tracks);
    var tracksArr = [];

    
    objTracks.map((folder) => {

        var total = Object.values(folder).length;
        
        Object.values(folder).map((track, index) => {
            const newTrackFile = track.userID + '/audio/' + track.folderID + '/' + track.trackID;

            tracksArr = tracksArr.concat(
                <div style={{width: '100%', marginTop: '12px', marginBottom: '12px'}}>
                    <WaveForm
                        isChild={index === total - 1 ? false : true}
                        controller={props.controller}
                        router={props.router}
                        audiofile={newTrackFile}
                        trackname={track.trackname}
                        metadata={track.metadata}
                        description={track.description}
                        folderID={track.folderID}
                        trackID={track.trackID}
                        userID={track.userID}
                    />
                    <Divider/>
                </div>
            );

        });
    });

    return (<div>{tracksArr.reverse()}</div>);
}

/**
 * The AccountView window displays a user's public information and track list. From here other users can listen to and
 * comment on their public tracks and initiate conversations.
 */
export class AccountView extends React.Component {
    static propTypes = {
        /**
         * The router component to be used, use MainWindowController for most cases
         */
        router: PropTypes.elementType,
        /**
         * The user ID to be used for generating the AccountView
         */
        user: PropTypes.string
    }

    constructor(props) {
        super(props)

        this.state = {
            prevPlayer: "",
            userDisplayName: "",
            userDescription: "",
            userGenres: "",
            userRole: "",
            userLocation: "",
            userAudio: "",
            userTracks: [],
            avatarURL: '',
            userPrivacySettings: false,
            waveformArr: [],
            expand: isMobile ? false : true,
            loadingAccount: true,
        };

        this.setPrevPlayer = this.setPrevPlayer.bind(this);
    }

    /**
     * 
     * @returns The player last toggled to play. This is used with the WaveForm component to stop current playback when a new player is toggled to play. 
     */
    getPrevPlayer() {
        return this.state.prevPlayer;
    }

    /**
     * Sets prevPlayer to be a new WaveForm component.
     * @param {Object} props The new WaveForm component containing a player to be paused when needed.  
     */
    setPrevPlayer = (props) => {
        this.setState({
            prevPlayer: props,
        });
    }

    handleExpand = () => {
        this.setState({
            expand: !this.state.expand
        })
    }

    /**
     * Will load all public info and tracks for this user.
     */
    componentDidMount() {

        const userRef = firebase.database().ref('users/' + this.props.user);
        var userParse = '';

        userRef.on('value', (snapshot) => {
            userParse = snapshot.val();
            
            this.setState({
                userDisplayName: userParse.displayname,
                userDescription: userParse.description,
                userGenres: userParse.genres,
                userRole: JSON.parse(userParse.roles),
                userLocation: userParse.location,
                userAudio: userParse.audio,
                userPrivacySettings: JSON.parse(userParse.privacysettings),
                loadingAccount: false,
            }, () => {
                userRef.off()
            });
        });

        const avatarRef = firebase.storage().ref('images/' + this.props.user);
        if (avatarRef) {
            avatarRef.getDownloadURL()
                .then((url) => {
                    this.setState({avatarURL: url});
                })
                .catch((error) => {
                    console.log('Avatar image fetch failed: ' + error)
                });
        }
    }

    render() {
        const avatarSize = isMobile ? '48px' : '96px';

        return (
            <div className="account-view">
                <Box className={isMobile ? 'user-info-mobile' : "user-info"}>
                    <div>
                        <Slide in={true} direction="right">
                            <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' style={{marginBottom: '10px',}}
                            onClick={isMobile ? this.handleExpand : false}
                            >
                                <div style={{width: isMobile ? '70%' : '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', overflowWrap: 'anywhere'}}>
                                    <Avatar
                                        style={{width: avatarSize, height: avatarSize}}
                                        src={this.state.avatarURL}
                                    />
                                    <Box
                                        display='flex'
                                        flexDirection='column'
                                        justifyContent='center'
                                        alignItems='flex-start'
                                        marginLeft='10px'
                                    >
                                        <Box style={{fontSize: isMobile ? '20px' : '24px', fontFamily: 'Quicksand-Regular'}} >{this.state.userDisplayName}</Box>
                                        <Box style={{fontSize: isMobile ? '16px' : '18px', fontFamily: 'Quicksand-Regular'}}>
                                            {(this.state.userRole) ? 
                                                Object.keys(this.state.userRole).filter(role => this.state.userRole[role] === true).join(" | ") 
                                                : ''}
                                        </Box>
                                        <Box style={{fontSize: isMobile ? '16px' : '18px', fontFamily: 'Quicksand-Regular'}}>{(this.state.userLocation) ? this.state.userLocation : ''}</Box>
                                    </Box>
                                </div>
                                <div hidden={isMobile ? false : true}>
                                    <IconButton 
                                    style={{color: '#90a4ae', display: (!this.props.router.getUserEmail() 
                                        || this.props.user === this.props.router.getUserID()) ? "none" : "true"}}
                                    onClick={()=> 
                                        this.props.router.updateContent(
                                            <Conversations 
                                            router={this.props.router} 
                                            user={this.props.user}
                                            />
                                        )}
                                    >
                                        <AddComment/>
                                    </IconButton>
                                    <IconButton style={{color: '#90a4ae'}}>
                                        <MoreVert/>
                                    </IconButton>
                                </div>
                            </Box>
                        </Slide>
                        <Slide in={true} direction="right">
                            <Box display='flex'
                                flexDirection='column'
                                justifyContent='flex-start'
                                height='100%'
                            >
                                <Collapse in={this.state.expand}>
                                    <Box 
                                    display='flex' 
                                    flexDirection='row' 
                                    justifyContent='center'
                                    style={{ 
                                        display: (!this.props.router.getUserEmail() || this.props.user === this.props.router.getUserID()) ? "none" : "true",
                                        marginBottom: '20px',
                                        marginTop: '10px'
                                    }}
                                    >
                                        <Box mx={2}>
                                            <Button
                                                variant='outlined'
                                                size='small'
                                                className={this.props.router.getStyles('b_MainWindow')} 
                                                onClick={()=> 
                                                this.props.router.updateContent(
                                                    <Conversations 
                                                    router={this.props.router} 
                                                    user={this.props.user}
                                                    />
                                                )}>Send Message
                                            </Button>
                                        </Box>
                                        <Box mx={2}>
                                            <Button
                                            variant='outlined'
                                            size='small'
                                            className={this.props.router.getStyles('b_MainWindow')} 
                                            >
                                                Add To Contacts
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Grid container direction="column" spacing={2}>
                                        <Divider style={{marginTop: '10px', marginBottom: '10px'}}/>
                                        <Grid item><b>Genres</b></Grid>
                                        <Grid item xs>{this.state.userGenres}</Grid>
                                        <Divider style={{marginTop: '10px', marginBottom: '10px'}}/>
                                        <Grid item><b>Description</b></Grid>
                                        <Grid item xs style={{overflowWrap: 'anywhere'}}>{this.state.userDescription}</Grid>
                                        <Divider style={{marginTop: '10px', marginBottom: '10px'}}/>
                                    </Grid>
                                </Collapse>
                            </Box>
                        </Slide>
                    </div>
                </Box>
                <Fade in={true} timeout={1000}>
                    {
                        this.state.loadingAccount ?
                        <Box display='flex' flexDirection='column' justifyContent='center'>
                            <CircularProgress />
                            <div className={this.props.router.getStyles('appBackground')}>Loading User Account...</div>
                        </Box>
                        :
                        <Box className={isMobile ? 'user-track-mobile' : 'user-track'}>
                            {((this.props.user === this.props.router.getUserID())
                                || ((firebase.auth().currentUser && firebase.auth().currentUser.email) && this.state.userPrivacySettings['TracksPublic'])
                                || (!(firebase.auth().currentUser && firebase.auth().currentUser.email) && this.state.userPrivacySettings['TracksPublic'])) ?
                                <GetTracks tracks={this.state.userAudio} controller={this} router={this.props.router} /> : "Please sign in to view this user's tracks"}

                        </Box>
                    }
                </Fade>
            </div>
        );
    }
}