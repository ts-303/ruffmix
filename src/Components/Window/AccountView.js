import { Avatar, Box, Button, Fade, Slide, Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import React from "react";
import firebase from "../../firebase";
import './AccountView.css';
import { Conversations } from './Conversations';
import WaveForm from "./WaveForm";
import PropTypes from 'prop-types';


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

    /**
     * Populates the user's track list using WaveForm components.
     */
    getTracks() {
        this.setState({ 
            userTracks: []
        })

        var newTracksArr = [];

        const folders = (this.state.userAudio);
            
        for (var folder in folders) {
            var currentFolder = folders[folder];
            var index = 0;
            var total = Object.values(folders[folder]).length;

            for (var track in currentFolder) {
                
                const newTrackFile = currentFolder[track].userID + '/audio/' + currentFolder[track].folderID + '/' + currentFolder[track].trackID;

                newTracksArr = newTracksArr.concat(
                    <WaveForm 
                    isChild={index === total-1 ? false : true} 
                    controller={this}
                    router={this.props.router} 
                    audiofile={newTrackFile}
                    trackname={currentFolder[track].trackname}
                    metadata={currentFolder[track].metadata}
                    description={currentFolder[track].description}
                    folderID={currentFolder[track].folderID}
                    trackID={currentFolder[track].trackID}
                    userID={currentFolder[track].userID}
                    />
                );

                index++;
            }
        }

        this.setState({ 
            userTracks: newTracksArr.reverse(),                                                     //probably not efficient operation
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
            }, () => this.getTracks());
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

        return (
            <div className="account-view">
                <Box className="user-info" style={{ backgroundColor: "" }}>
                    <div>
                        <Slide in={true} direction="right">
                            <Box display='flex' flexDirection='row' alignItems='center'>
                                <Avatar
                                    style={{ marginRight: '10px', width: '96px', height: '96px', }}
                                    src={this.state.avatarURL}
                                />
                                <Box
                                    display='flex'
                                    flexDirection='column'
                                    justifyContent='center'
                                    alignItems='flex-start'
                                    style={{ height: '96px', }}>
                                    <Box className='userName' >{this.state.userDisplayName}</Box>
                                    <Box className='userRole'>
                                        {(this.state.userRole) ? 
                                            Object.keys(this.state.userRole).filter(role => this.state.userRole[role] === true).join("|") 
                                            : ''}
                                    </Box>
                                    <Box className='userRole'>{(this.state.userLocation) ? this.state.userLocation : ''}</Box>
                                </Box>
                            </Box>
                        </Slide>
                        <Slide in={true} direction="right">
                            <Box display='flex'
                                flexDirection='column'
                                alignItems='center'
                                justifyContent='flex-start'
                                height='100%'
                            >
                                <Box 
                                display='flex' 
                                marginTop='12px' 
                                flexDirection='row' 
                                style={{ 
                                    display: this.props.user === this.props.router.getUserID() ? "none" : "true",
                                }}
                                >
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
                                    <Button
                                    variant='outlined'
                                    size='small'
                                    className={this.props.router.getStyles('b_MainWindow')} 
                                    >
                                        Add To Contacts
                                    </Button>
                                </Box>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align='left'><b>Genres</b></TableCell>
                                            <TableCell>{this.state.userGenres}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align='left'><b>Description</b></TableCell>
                                            <TableCell >{this.state.userDescription}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Slide>
                    </div>
                </Box>
                <Fade in={true} timeout={1000}>
                    <Box className="user-track" style={{ backgroundColor: "" }}>
                        {( (this.props.user === this.props.router.getUserID()) 
                            || ((firebase.auth().currentUser && firebase.auth().currentUser.email) && !this.state.userPrivacySettings['TracksPublic'])
                            || (!(firebase.auth().currentUser && firebase.auth().currentUser.email) && this.state.userPrivacySettings['TracksPublic'])) ? 
                            this.state.userTracks : "Please sign in to view this user's tracks"}
                    </Box>
                </Fade>
            </div>
        );
    }
}