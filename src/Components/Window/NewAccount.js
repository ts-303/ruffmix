import { Box, Button, CardHeader, Checkbox, FormControlLabel, Grow, IconButton, Slide, Step, StepLabel, Stepper, TextField, Tooltip} from "@material-ui/core";
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

    backButton = () => {
        const { activeStep } = this.state;

        if (activeStep > 0) {
            this.setState({
                activeStep: activeStep - 1,
                inProp: true,
            }, () => this.setState({inProp: false, sectionValid: this.checkValid()}));
        }
    }

    nextButton = () => {
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
                <Box display='flex' flexDirection='column' justifyContent='space-between' height='100%' textAlign='center'>
                        <CardHeader title="Create New Account"/>
                        <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' mx={10}>
                            <Box >
                                <div style={{visibility: (this.state.activeStep === 0 ? 'hidden' : 'visible')}}>
                                    <IconButton 
                                    onClick={() => this.backButton()}
                                    >
                                        <NavigateBeforeRoundedIcon fontSize='large'/>
                                    </IconButton>
                                </div>
                            </Box>
                            <Box display='flex' width='50%' flexDirection='column' justifyContent='center' alignSelf='center'>
                                <Slide 
                                    in={this.state.inProp} 
                                    onExited={() => this.setState({inProp: !this.state.inProp, slideStep: this.state.activeStep})}
                                    direction="up"
                                >
                                    <div>
                                        <div hidden={(this.state.slideStep === 0  ? false : true)}>
                                            <Box display='flex' flexDirection='column' >
                                                <TextField
                                                    label="New Email"
                                                    name='userEmail'
                                                    placeholder='. . .'
                                                    size='medium'
                                                    type='email'
                                                    required='true'
                                                    onChange={this.handleChange}
                                                />
                                                <TextField
                                                    label="New Password"
                                                    name='userPassword'
                                                    placeholder='. . .'
                                                    size='medium'
                                                    type='password'
                                                    required='true'
                                                    onChange={this.handleChange}
                                                />
                                            </Box>
                                        </div>

                                        <div hidden={(this.state.slideStep === 1  ? false : true)}>
                                            <Box display='flex' flexDirection='column' >
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
                                                <h2 style={{textAlign: 'center'}}>
                                                User Roles:
                                                </h2>
                                                <Box display='flex' flexDirection='row' alignSelf='center'  >
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

                                        <div hidden={(this.state.slideStep === 2  ? false : true)}>
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
                            <Box>
                                <Tooltip
                                    title='Please fill out all required fields'
                                    arrow={true}
                                    placement='right'
                                    disableHoverListener={this.state.sectionValid}
                                >
                                    <div style={{visibility: (this.state.activeStep === 2 ? 'hidden' : 'visible')}}>
                                        <IconButton  
                                        onClick = {() => this.nextButton()}
                                        disabled={!this.checkValid()}
                                        >
                                            <NavigateNextRoundedIcon fontSize='large'/>
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </Box>
                        </Box>
                        <Stepper
                            activeStep={this.state.activeStep}
                            alternativeLabel
                        >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel orientation="vertical">{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                </Box>
            </Grow>
        );
    }
}