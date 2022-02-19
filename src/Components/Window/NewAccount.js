import { Box, Button, CardHeader, Checkbox, FormControlLabel, Grid, Grow, IconButton, MobileStepper, Slide, Step, StepLabel, Stepper, TextField, Tooltip} from "@material-ui/core";
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import React from "react";
import { isThisTypeNode } from "typescript";
import firebase from '../../firebase';
import { AccountView } from "./AccountView";

/**
 * Titles for account creation steps
 */
const steps = ['Credentials', 'Personalization', 'Privacy Settings'];

/**
 * The NewAccount window allows the user to register a new account and set up publicly displayed information and privacy settings
 */
export class NewAccount extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeStep: 0,
            inProp: true,
            slideStep: 0,
            userEmail: '',
            userPassword: '',
            userDescription: '',
            userDisplayName: '',
            userGenres: [],
            userLocation: '',
            userRoles: {'Producer': false, 'Engineer': false, 'Composer': false, 'Artist': false},
            userPrivacySettings: {'BrowseUsers': true, 'TracksPublic': true},
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleAccountCreation = this.handleAccountCreation.bind(this);
    }

    handleChange = (event) => {

        if (event.target.name.match('Producer|Engineer|Composer|Artist')) {
            var roles = this.state.userRoles;

            if (event.target.checked) roles[event.target.name] = true;
            else roles[event.target.name] = false;

            this.setState({
                userRoles: roles,
            });
        }
        else if (event.target.name.match('BrowseUsers|TracksPublic')) {
            var privacy = this.state.userPrivacySettings;

            if (event.target.checked) privacy[event.target.name] = true;
            else privacy[event.target.name] = false;

            this.setState({
                userPrivacySettings: privacy,
            });
        }
        else this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        })

    }

    checkValid() {
        return (this.state.slideStep === 0 && this.state.userEmail && this.state.userPassword 
            && this.state.userEmail.includes('@') && this.state.userPassword.length >= 8) 
            || (this.state.slideStep === 1 && this.state.userDisplayName);
    }

    /**
     * Creates a new account using Firebase's Auth service. If a user matched anonymously, the anonymous session account can be linked and an uploaded track 
     * will be added to the new account automatically.
     */
    handleAccountCreation = (event) => {

        const userData = {
            email: this.state.userEmail,
            displayname: this.state.userDisplayName,
            description: this.state.userDescription,
            genres: this.state.userGenres,
            roles: JSON.stringify(this.state.userRoles),                                                                          
            location: this.state.userLocation,
            privacysettings: JSON.stringify(this.state.userPrivacySettings),     
        }

        //If linking new account from anonymous 
        if (firebase.auth().currentUser) {
            var credential = firebase.auth.EmailAuthProvider.credential(this.state.userEmail, this.state.userPassword);
            firebase.auth().currentUser.linkWithCredential(credential)
                .then((usercred) => {
                    var user = usercred.user;
                    firebase.database().ref('users/' + user.uid).update(userData);
                    this.props.router.setUser(user);
                    this.props.router.updateContent(<AccountView router={this.props.router} user={user.uid} />)
                }).catch((error) => {
                    console.log("Error upgrading anonymous account", error);
                });
        }
        //If creating new account
        else firebase.auth().createUserWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
            .then((userCredential) => {
                var user = userCredential.user;
                firebase.database().ref('users/' + user.uid).set(userData);
                this.props.router.setUser(user);
            })
            .catch((error) => {
                alert('Account creation error: ' + error);
        });
            
        event.preventDefault();
    }

    returnButton = () => {
        this.props.router.previousHandler();
    };

    backButton = (event) => {
        event.preventDefault();

        const { activeStep } = this.state;

        if (activeStep > 0) {
            this.setState({
                activeStep: activeStep - 1,
                inProp: true,
            }, () => this.setState({inProp: false, sectionValid: this.checkValid()}));
        }
    }

    nextButton = (event) => {
        event.preventDefault();

        const { activeStep } = this.state;

        if (activeStep < steps.length-1) {
            this.setState({
                activeStep: activeStep + 1,
                inProp: true,
            }, () => this.setState({inProp: false, sectionValid: this.checkValid()}));
        }

    }

    render() {
        return (
            <Grow in={true}>
                <Box display='flex' flexDirection='column' justifyContent='stretch' alignItems='stretch' height='100%' style={{position: 'absolute', top: 0, left: 0, right: 0}}>
                    <Box display='flex' justifyContent='center' textAlign='center' style={{width:'100%', height: '10%', }}>
                        <CardHeader title="Create New Account"/>
                    </Box>

                    <Box display='flex' flexDirection='column' justifyContent='center' textAlign='center' m='auto' style={{width: '40%', height: '80%', }}>
                        <Slide
                            in={this.state.inProp}
                            onExited={() => this.setState({ inProp: !this.state.inProp, slideStep: this.state.activeStep })}
                            direction="up"
                        >
                            <div>
                                <div hidden={(this.state.slideStep === 0 ? false : true)}>
                                    <Box display='flex' flexDirection='column'>
                                        <TextField
                                            label="New Email"
                                            name='userEmail'
                                            placeholder='. . .'
                                            size='medium'
                                            type='email'
                                            required='true'
                                            fullWidth
                                            onChange={this.handleChange}
                                        />
                                        <TextField
                                            label="New Password"
                                            name='userPassword'
                                            placeholder='. . .'
                                            size='medium'
                                            type='password'
                                            required='true'
                                            fullWidth
                                            onChange={this.handleChange}
                                        />
                                    </Box>
                                </div>

                                <div hidden={(this.state.slideStep === 1 ? false : true)} >
                                    <Box display='flex' flexDirection='column' style={{ minWidth: '100px' }}>
                                        <TextField
                                            label="Display Name"
                                            name='userDisplayName'
                                            placeholder='. . .'
                                            size='medium'
                                            required='true'
                                            onChange={this.handleChange}
                                        />
                                        <TextField
                                            label="Description"
                                            name='userDescription'
                                            placeholder='. . .'
                                            size='medium'
                                            onChange={this.handleChange}
                                        />
                                        <TextField
                                            label="Genres"
                                            name='userGenres'
                                            placeholder='. . .'
                                            size='medium'
                                            onChange={this.handleChange}
                                        />
                                        <TextField
                                            label="Location"
                                            name='userLocation'
                                            placeholder='. . .'
                                            size='medium'
                                            onChange={this.handleChange}
                                        />
                                        <h3>User Roles:</h3>
                                        <Box display='flex' flexDirection='row' justifyContent='center' flexWrap='wrap'>
                                            <FormControlLabel
                                                control={<Checkbox id='0' name="Producer" onChange={this.handleChange} />}
                                                label="Producer"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox id='1' name="Engineer" onChange={this.handleChange} />}
                                                label="Engineer"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox id='2' name="Composer" onChange={this.handleChange} />}
                                                label="Composer"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox id='3' name="Artist" onChange={this.handleChange} />}
                                                label="Artist"
                                            />
                                        </Box>
                                    </Box>
                                </div>

                                <div hidden={(this.state.slideStep === 2 ? false : true)}>
                                    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                                        <FormControlLabel
                                            control={<Checkbox id='4' name="BrowseUsers" defaultChecked={true} onChange={this.handleChange} />}
                                            label="Show your profile on the public browse users page?"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox id='5' name="TracksPublic" defaultChecked={true} onChange={this.handleChange} />}
                                            label="Allow unregistered users to view your tracks?"
                                        />
                                        <form onSubmit={this.handleAccountCreation}>
                                            <Box m={2}>
                                                <Button variant='outlined' className={this.props.router.getStyles('b_MainWindow')} type='submit'>Finish</Button>
                                            </Box>
                                        </form>
                                    </Box>
                                </div>
                            </div>
                        </Slide>
                    </Box>

                    <Box display='flex' flexDirection='row' justifyContent='center' textAlign='center' style={{width: '100%', height: '10%', zIndex: 1}} className={this.props.router.getStyles('defaultBar')}>
                        <MobileStepper
                            variant="dots"
                            steps={3}
                            position="static"
                            activeStep={this.state.activeStep}
                            className={this.props.router.getStyles('defaultBar')}
                            backButton={
                                <Button startIcon={<NavigateBeforeRoundedIcon fontSize='large'/>} 
                                size="medium" onClick={this.backButton} disabled={this.state.activeStep === 0}
                                style={{position: 'absolute', left: '2%'}}
                                className={this.props.router.getStyles('defaultBar')}
                                >
                                    Back
                                </Button>
                            }
                            nextButton={
                                <Tooltip
                                    title='Please fill out all required fields'
                                    arrow={true}
                                    placement='top'
                                    disableHoverListener={this.state.sectionValid}
                                >
                                    <Button endIcon={<NavigateNextRoundedIcon fontSize='large' />}
                                        size="medium" onClick={this.nextButton} disabled={!this.checkValid()}
                                        style={{ position: 'absolute', right: '2%' }}
                                        className={this.props.router.getStyles('defaultBar')}
                                    >
                                        Next
                                    </Button>
                                </Tooltip>
                            }
                        />
                    </Box>

                </Box>
            </Grow>
        );
    }
}