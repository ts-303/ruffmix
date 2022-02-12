import { Avatar, Box, Button, Checkbox, Divider, FormControlLabel, Input, InputAdornment, Slide, TextField, Tooltip } from "@material-ui/core";
import { AccountCircle, ArrowForwardIos } from "@material-ui/icons";
import PublishIcon from '@material-ui/icons/Publish';
import React from "react";
import firebase from "../../firebase";
import { AccountView } from "./AccountView";
import './AccountSettings.css';
import PropTypes from 'prop-types';

/**
 * The AccountSettings window allows the current user to make common changes to their account, such as to their display name, roles, and avatar image.
 */
export class AccountSettings extends React.Component {
    static propTypes = {
        /**
         * The router component to be used, use MainWindowController for most cases
         */
        router: PropTypes.elementType
    }

    constructor(props) {
        super(props)

        this.state = {
            userEmail: '',
            userDisplayName: '',
            userDescription: '',
            userGenres: '',
            userRoles: [],
            userLocation: '',
            userPrivacySettings: [],
            selection: 0,
            changesMade: false,
            avatarImage: '',
            avatarURL: '',
        };

        this.fileInput = React.createRef();
    }

    /**
     * Will load user data and avatar image.
     */
    componentDidMount() {
        const userRef = firebase.database().ref('users/' + this.props.router.getUserID());
        var userParse = '';

        userRef.on('value', (snapshot) => {
            userParse = snapshot.exportVal();
            if (userParse) {
                this.setState({
                    userEmail: userParse.email,
                    userDisplayName: userParse.displayname,
                    userDescription: (userParse.description) ? userParse.description : '',
                    userGenres: (userParse.genres) ? userParse.genres : '',
                    userRoles: JSON.parse(userParse.roles),
                    userLocation: (userParse.location) ? userParse.location : '',
                    userPrivacySettings: JSON.parse(userParse.privacysettings),
                }, () => {
                    //userRef.off('value');
                });
            }
        });

        const avatarRef = firebase.storage().ref('images/' + this.props.router.getUserID());
        if (avatarRef) {
            avatarRef.getDownloadURL()
                .then((url) => {
                    this.setState({ avatarImage: url });
                })
                .catch((error) => {
                    console.log('Avatar image fetch failed: ' + error)
                });
        }
    }

    /**
     * Submits changes and redirects to the current user's AccountView.
     */
    submitChanges = (event) => {
        this.props.router.setLoadingState(true);

        const userRef = firebase.database().ref('users/' + this.props.router.getUserID());
        userRef.update({ 
            //email: this.state.userEmail,
            displayname: this.state.userDisplayName,
            description: this.state.userDescription,
            //genres: this.state.userGenres,
            roles: JSON.stringify(this.state.userRoles),
            location: this.state.userLocation,
            privacysettings: JSON.stringify(this.state.userPrivacySettings),
        }, () => {
            this.props.router.setLoadingState(false)
            this.props.router.updateContent(<AccountView router={this.props.router} user={this.props.router.getUserID()}/>);
        });

        if (this.state.avatarURL) {
            firebase.storage().ref().child('images/' + this.props.router.getUserID()).put(this.state.avatarImage).then((snapshot) => {
                console.log('Avatar image upload success');
            }).then(() => {
                this.props.router.setLoadingState(false)
                this.props.router.updateContent(<AccountView router={this.props.router} user={this.props.router.getUserID()}/>);
            }).catch((error) => {
                console.log('Avatar image upload fail' + error);
            });
        }

    }

    handleFileSelect = (event) => {
        if (this.fileInput.current.files[0] !== this.state.avatarImage) {
            this.setState({
                avatarImage: this.fileInput.current.files[0],
                avatarURL: URL.createObjectURL(this.fileInput.current.files[0]),
                changesMade: true,
            });
        }

        event.preventDefault();
    }

    handleChange = (event) => {
        this.setState({changesMade: true});

        if (event.target.name.match('Producer|Engineer|Composer|Artist')) {
            if (this.state.userRoles) {
                var roles = this.state.userRoles;

                if (event.target.checked) roles[event.target.name] = true;
                else roles[event.target.name] = false;

                this.setState({
                    userRoles: roles,
                });
            }
        }
        else if (event.target.name.match('BrowseUsers|TracksPublic')) {
            if (this.state.userPrivacySettings) {
                var settings = this.state.userPrivacySettings;

                if (event.target.checked) settings[event.target.name] = true;
                else settings[event.target.name] = false;

                this.setState({
                    userPrivacySettings: settings,
                });
            }
        }
        else {
            this.setState({ [event.target.name]: event.target.value });
        }
    }

    render() {
        return (
            <div className="accountsettings">
                <Box className="selection">
                    <div>
                        <Slide in={true} direction="right">
                            <div style={{fontWeight: 'bold'}}>
                            My Account
                                <Button startIcon={this.state.selection === 0 ? <ArrowForwardIos/> : false} 
                                onClick={() => this.setState({selection: 0})} 
                                style={{ justifyContent: 'left', minWidth: '100%' }}>
                                    Account Information 
                                </Button>
                                <Divider />
                                <Button startIcon={this.state.selection === 1 ? <ArrowForwardIos/> : false}
                                onClick={() => this.setState({selection: 1})} 
                                style={{ justifyContent: 'left', minWidth: '100%' }}>
                                    Privacy Settings
                                </Button>
                                <Divider />
                                <Button startIcon={this.state.selection === 2 ? <ArrowForwardIos/> : false}
                                onClick={() => this.setState({selection: 2})} 
                                style={{ justifyContent: 'left', minWidth: '100%' }}>
                                    Display Preferences
                                </Button>
                            </div>
                        </Slide>
                    </div>
                </Box>
                <Box className="settings" width='100%' >
                    <div hidden={(this.state.selection === 0 ? false : true)}>
                        <div style={{fontWeight: 'bold', fontSize:'24px', textAlign: 'center'}}>Account Information</div>
                        <Box mt={2} mb={2} style={{fontSize:'24px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            Custom Avatar
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <Avatar
                                style={{ marginRight: '10px', width: '128px', height: '128px', }}
                                src={(this.state.avatarURL) ? this.state.avatarURL : this.state.avatarImage}
                            />
                            <Tooltip title='Upload a custom avatar' arrow={true} placement='right'>
                                <Input
                                    style={{alignSelf: 'center'}}
                                    type="file"
                                    inputProps={{ ref: this.fileInput, accept: 'image/png, image/gif, image/jpeg' }}
                                    required={true}
                                    onChange={this.handleFileSelect}
                                    startAdornment={
                                        <InputAdornment>
                                            <PublishIcon />
                                        </InputAdornment>
                                    }
                                />
                            </Tooltip>
                        </Box>
                        <Box mt={2} mb={1} style={{fontSize:'24px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            Public Information
                        </Box>
                        <Box m='auto' width='70%'>
                            <TextField
                                            label="Display Name"
                                            placeholder='. . .'
                                            name='userDisplayName'
                                            value={this.state.userDisplayName}
                                            onChange={this.handleChange}
                                            size='small'
                                            fullWidth
                            />
                            <TextField
                                            label="Description"
                                            placeholder='. . .'
                                            name='userDescription'
                                            value={this.state.userDescription}
                                            onChange={this.handleChange}
                                            size='small'
                                            fullWidth
                            />
                            <TextField
                                            label="Location"
                                            placeholder='. . .'
                                            name='userLocation'
                                            value={this.state.userLocation}
                                            onChange={this.handleChange}
                                            size='small'
                                            fullWidth
                            />
                            <Box mt={2} style={{textAlign: 'center', fontSize: '24px', }}>My Roles:</Box>
                            <Box display='flex' justifyContent='center'>
                                <Box>
                                    {() => {
                                        if (this.state.userRoles) {                                
                                            const initialRoles = ['Producer', 'Engineer', 'Composer', 'Artist'];
                                        
                                            return initialRoles.map((role) => {
                                                return <FormControlLabel
                                                        //Setting a random key seems to be the only way to make this element display the updated checked attribute
                                                        control={<Checkbox key={Math.random()} name={role} checked={this.state.userRoles[role]} onChange={this.handleChange} />}
                                                        label={role}
                                                        />
                                            });
                                        }
                                    }}
                                </Box>
                            </Box>
                        </Box>
                    </div>
                    <div hidden={(this.state.selection === 1 ? false : true)}>
                        <div style={{fontWeight: 'bold', fontSize:'24px', textAlign: 'center'}}>Privacy Settings</div> 
                        <Box mt={2} textAlign='center'>
                            <Box>
                                {() => {
                                        if (this.state.userPrivacySettings) {                                
                                            const initialPrivacySettings = ['BrowseUsers', 'TracksPublic'];
                                            const settingLabels = ['Show your profile on the public browse users page?', 'Allow unregistered users to view your tracks?']
                                        
                                            return initialPrivacySettings.map((setting, index) => {
                                                return <FormControlLabel
                                                        //Setting a random key seems to be the only way to make this element display the updated checked attribute
                                                        control={<Checkbox key={Math.random()} name={setting} checked={this.state.userPrivacySettings[setting]} onChange={this.handleChange} />}
                                                        label={settingLabels[index]}
                                                        />
                                            });
                                        }
                                }}
                            </Box>
                        </Box>
                    </div>
                    <div hidden={(this.state.selection === 2 ? false : true)}>
                    <div style={{fontWeight: 'bold', fontSize:'24px', textAlign: 'center'}}>Display Preferences (Not Functional)</div> 
                        <FormControlLabel
                            control={<Checkbox/>}
                            label="Display 1"
                        />
                    </div>
                    <Box display='flex' justifyContent='center'>
                        <Button 
                        variant='outlined'
                        className={this.props.router.getStyles('b_MainWindow')} 
                        disabled={!this.state.changesMade} 
                        onClick={this.submitChanges}
                        >
                            Submit Changes
                        </Button>
                    </Box>
                </Box>
            </div>
        );
    }
}