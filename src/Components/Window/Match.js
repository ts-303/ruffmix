import { Box, Button, CardHeader, Checkbox, CircularProgress, Collapse, Divider, FormControlLabel, Grow, IconButton, Input, InputAdornment, MobileStepper, Slide, Step, StepLabel, Stepper, TextField, Tooltip } from "@material-ui/core";
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import PublishIcon from '@material-ui/icons/Publish';
import React from "react";
import { isMobile } from "react-device-detect";
import firebase from '../../firebase';
import { NewAccount } from "./NewAccount";
import WaveForm from "./WaveForm";
import { DoubleArrow } from "@material-ui/icons";
import { isThisTypeNode } from "typescript";

/**
 * Titles for describing the steps 
 */
const steps = ['Upload Your Track', 'Describe This Track', 'Identify Problem Areas', 'Now Matching . . .', 'Review', 'Your Feedback'];

/**
 * Definition for the initial state which is used if Matching is repeated
 */
const initialState = {
    activeStep: 0,
    inProp: true,
    slideStep: 0,
    matching: false,
    sectionValid: false,
    matchingStatus: '',
    trackPreviewPlayer: '',
    trackName: '',
    trackDescription: '',
    trackMetaData: ['', '', '', ''],
    userID: '',
    audioFile: '',
    metaDataOther: '',
    other: false,
    trackIsPublic: false,
    trackMatchPlayer: '',
    prevPlayer: "",
    mFolderID: '',
    mTrackID: '',
    mTrackName: '',
    mMetaData: ['', '', '', ''],
    mTrackDescription: '',
    currentUserID: '',
    currentFolderID: '',
    currentTrackID: '',
    reviewedTrackPlayer: '',
    matchedUserID: '',
    keepTracks: false,
    anonymousID: '',
};

/**
 * The Match window allows two users to exchange a work-in-progress track for immediate feedback.
 */
export class Match extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState;

        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.handleMatch = this.handleMatch.bind(this);
        this.finishReview = this.finishReview.bind(this);
        this.drawMatchTrack = this.drawMatchTrack.bind(this);
        this.cleanup = this.cleanup.bind(this);
        this.matchAgain = this.matchAgain.bind(this);

        this.fileInput = React.createRef();
        this.previewRef = React.createRef();
    }

    /**
     * Calls the cleanup function, initializes state, and detaches the firebase child_added callback
     */
    componentWillUnmount() {
        this.cleanup();
        this.state = initialState;
        firebase.database().ref('matching/').off('child_added');
        
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
     * @returns A promise to remove matching data on firebase when necessary
     */
    cleanup = (errorStatus) => {
        return new Promise((resolve, reject) => {
            if (this.state.currentUserID) {
                firebase.database().ref('matching/' + this.state.currentUserID).remove().catch((error) => {
                    console.log('Matching DB cleanup error: ' + error);
                });

                if (!this.props.router.getUserID() && !this.state.keepTracks) {
                    firebase.database().ref('users/' + this.state.currentUserID).remove().catch(function (error) {
                        console.log("User DB cleanup fail: " + error.message)
                    });
                }

                if ((!this.state.trackIsPublic && !this.state.keepTracks) || errorStatus) {
                    firebase.database().ref('users/' + this.state.currentUserID + '/audio/'
                        + this.state.currentFolderID + '/' + this.state.currentTrackID).remove().catch(function (error) {
                            console.log("User DB cleanup fail: " + error.message)
                        });

                    firebase.storage().ref().child(this.state.currentUserID + '/audio/' + this.state.currentFolderID + '/' + this.state.currentTrackID).delete().catch((error) => {
                        console.log('Storage cleanup error: ' + error);
                    });
                }
            }
        })
    }

    /**
     * Begins a new matching session
     */
    matchAgain = () => {
        this.cleanup().then(
            this.props.router.updateContent(<Match router={this.props.router} user={this.props.router.getUserID()} />)
        ).catch((error) => {
            console.log('Cleanup error: ' + error);
        });
    }

    backButton = (event) => {
        const { activeStep } = this.state;

        if (activeStep > 0) {
            this.setState({
                activeStep: activeStep - 1,
                inProp: true,
            }, () => { this.checkSection(); this.setState({ inProp: false }); });
        }

        if (event) event.preventDefault();
    }

    nextButton = (event) => {
        const { activeStep } = this.state;

        if (activeStep < steps.length - 1) {
            this.setState({
                activeStep: activeStep + 1,
                inProp: true,
            }, () => this.setState({ inProp: false, sectionValid: false }));
        }

        if (event) event.preventDefault();
    }

    /**
     * Checks to see if a step's required fields are filled
     */
    checkSection() {
        if (this.state.activeStep === 1 && this.state.trackName
            || this.state.activeStep === 0 && this.state.trackPreviewPlayer)
            this.setState({ sectionValid: true });
    }

    handleChange = (event) => {
        if (event.target.name.match('Mixing|Mastering|Arrangement')) {
            var metaDataArr = [...this.state.trackMetaData];
            const index = parseInt(event.target.id);
            if (event.target.checked) metaDataArr[index] = event.target.name;
            else metaDataArr[index] = '';

            this.setState({
                trackMetaData: metaDataArr,
            })
        }

        else {
            this.setState({
                ...this.state,
                [event.target.name]: event.target.value,
            }, () => {
                if (event.target.name.match('metaDataOther')) {
                    var metaDataArr = [...this.state.trackMetaData]
                    metaDataArr[3] = this.state.metaDataOther;
                    this.setState({ trackMetaData: metaDataArr });
                }
                this.checkSection();
            })
        }
    }

    handleFileSelect = (event) => {
        if (this.fileInput.current.files[0] !== this.state.audioFile) {
            this.setState({
                audioFile: this.fileInput.current.files[0]
            }, () => this.drawPreview(this.fileInput.current.files[0]))
        }

        event.preventDefault();
    }

    /**
     * Draws a Waveform preview of the track to be shared
     */
    drawPreview = (args) => {
        const waveObj = <WaveForm
            isChild={false}
            preview={true}
            previewSize={isMobile ? window.innerWidth*0.7 : window.innerWidth*0.4}
            router={this.props.router}
            audiofile={args}
            trackname={this.state.trackName}
            metadata={[]}
            description=''
        />;

        this.setState({
            trackPreviewPlayer: ''
        }, () => this.setState({ trackPreviewPlayer: waveObj, sectionValid: true }))
    }

    /**
     * Draws the Waveform of a track obtained from a matched user
     */
    drawMatchTrack = () => {

        const matchingRef = firebase.database().ref('matching/' + this.state.currentUserID + '/matchObject');

        let matchingListener = matchingRef.once('value', (snapshot) => {
            const matchObj = snapshot.val();

            const usersRef = firebase.database().ref('users/' + matchObj.matchID + '/audio/' + matchObj.folder + '/' + matchObj.track);
            const commentRef = firebase.database().ref('users/' + matchObj.matchID + '/audio/' + matchObj.folder + '/' + matchObj.track + '/commentdata/1');

            let usersListener = usersRef.once('value', (snapshot) => {
                if (snapshot.exists()) {
                    const trackData = snapshot.val();

                    const waveObj = <WaveForm
                        isChild={false}
                        router={this.props.router}
                        audiofile={matchObj.matchID + '/audio/' + matchObj.folder + '/' + matchObj.track}
                        trackname={trackData.trackname}
                        metadata={trackData.metadata}
                        description={trackData.description}
                        folderID={matchObj.folder}
                        trackID={matchObj.track}
                        userID={matchObj.matchID}
                        expanded={true}
                    />;

                    this.setState({
                        trackMatchPlayer: waveObj,
                        mFolderID: trackData.folderID,
                        mTrackID: trackData.trackID,
                        mTrackName: trackData.trackname,
                        mMetaData: trackData.metadata,
                        mTrackDescription: trackData.description,
                    }, () => {
                        //Allows user to continue after a comment is made
                        commentRef.once('child_added', (snapshot) => {
                            this.setState({ sectionValid: true })
                        });
                    });

                    firebase.database().ref('matching/' + this.state.currentUserID).remove().catch(function (error) {
                        console.log("Matching DB cleanup fail: " + error.message)
                    });

                }
            });
        });
    }

    /**
     * @summary Begins a new matching session. 
     * @description Firebase contains a /matching/ directory which queues new users waiting for a match. In this function, a firebase listener
     * waits for a new child to be added in /matching/ whose user ID does not belong to the current user. When one is found, a 'matchObject' is added to that user's
     * directory in /matching/. For the user that just queued, a listener is added to their own /matching/ directory looking for a matchObject created from a
     * waiting user. When one is found, this completes the session and the two users exchange tracks and account info when available. Users can match anonymously
     * when not using a registered account.
     */
    handleMatch = (event) => {
        this.nextButton();

        var newSessionID = '';

        function anonymousAuth() {
            firebase.auth().signInAnonymously().then(() => {
                firebase.auth().onAuthStateChanged((user) => {
                    //this.props.router.setUser(user);
                    newSessionID = user.uid;
                    this.setState({ anonymousID: user.uid });
                    createMatchSession();
                });
            })
        }

        function createMatchSession() {

            var newFolderID = '';
            var fRef = firebase.database().ref().push();
            newFolderID = fRef.key;

            var tRef = firebase.database().ref().push();
            var newTrackID = tRef.key;

            // Use hooks to set/clear timeout as needed 
            // var matchTimeOut = setTimeout(() => {
            //     alert('Session timeout');
            //     this.matchAgain();
            // }, 5000);

            if (newSessionID) {
                this.setState({
                    matchingStatus: 'Uploading your track . . .',
                    currentUserID: newSessionID,
                    currentFolderID: newFolderID,
                    currentTrackID: newTrackID,
                }, () => {
                    const storageRef = firebase.storage().ref().child(this.state.currentUserID + '/audio/' + newFolderID + '/' + newTrackID);
                    var newAudioFile = this.state.audioFile;

                    const storageTask = storageRef.put(newAudioFile);

                    storageTask.on('state_changed', function progress(snapshot) {
                        this.setState({
                            matchingStatus: 'Uploading track... ' + parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '%'
                        });
                    }.bind(this));
                    
                    storageTask.then(() => {
                        if (this.state.currentUserID) {
                            console.log('File upload success');

                            this.setState({ matchingStatus: 'Searching for match . . .' });

                            firebase.database().ref('users/' + this.state.currentUserID + '/audio/' + newFolderID + '/' + newTrackID).set({
                                folderID: newFolderID,
                                trackID: newTrackID,
                                userID: this.state.currentUserID,
                                trackname: this.state.trackName,
                                description: this.state.trackDescription,
                                metadata: this.state.trackMetaData,
                                commentdata: ['']
                            }).then(() => {
                                firebase.database().ref('matching/' + this.state.currentUserID).set({
                                    test: true
                                }).catch((error) => {
                                    console.log('Matching queue fail - ' + error);
                                });

                                const matchData = {
                                    matchID: this.state.currentUserID,
                                    folder: newFolderID,
                                    track: newTrackID
                                };

                                const newMatchUserRef = firebase.database().ref('matching/').limitToLast(1)

                                let newMatchUserListener = newMatchUserRef.on('child_added', (data) => {
                                    if (data.key !== this.state.currentUserID) {
                                        firebase.database().ref('matching/' + data.key).update({ matchObject: matchData });
                                    }
                                });

                                const currentUserRef = firebase.database().ref('matching/' + this.state.currentUserID);

                                let currentUserListener = currentUserRef.on('child_added', (data) => {
                                    if (data.key === 'matchObject') {
                                        const matchedUser = firebase.database().ref('matching/' + data.child('matchID').val());
                                        if (data.child('matchID').val() !== this.state.currentUserID) {
                                            matchedUser.update({ matchObject: matchData });
                                            this.setState({ matchedUserID: data.child('matchID').val() });
                                            console.log('Matched user ID: ' + this.state.matchedUserID);

                                            newMatchUserRef.off('child_added', newMatchUserListener);
                                            currentUserRef.off('child_added', currentUserListener);

                                            this.nextButton();
                                            this.drawMatchTrack();
                                        }
                                    }
                                });
                            }).catch((error) => {
                                alert('Matching fail' + error);
                            });
                        }
                        else {
                            console.log('Match session creation fail - session cancelled during upload');
                            storageRef.delete();
                        }
                    }).catch((error) => {
                        this.cleanup(true);
                        alert('File Upload fail' + error);
                    });

                });
            }
            else {
                alert('Cannot match - user auth failure');
                this.matchAgain();
            }
        }

        createMatchSession = createMatchSession.bind(this);
        anonymousAuth = anonymousAuth.bind(this);

        if (this.props.router.getUserID()) {
            newSessionID = this.props.router.getUserID();
            createMatchSession();
        }
        else {
            anonymousAuth()
        };

        event.preventDefault();
    }

    /**
     * Finishes the matching session and shows the current user's reviewed track
     */
    finishReview = (event) => {

        const reviewedTrack = <WaveForm
            isChild={false}
            controller={this}
            router={this.props.router}
            audiofile={this.state.currentUserID + '/audio/' + this.state.currentFolderID + '/' + this.state.currentTrackID}
            trackname={this.state.trackName}
            metadata={this.state.trackMetaData}
            description={this.state.trackDescription}
            folderID={this.state.currentFolderID}
            trackID={this.state.currentTrackID}
            userID={this.state.currentUserID}
            expanded={true}
            disableComment={true}
        />;

        this.setState({ reviewedTrackPlayer: reviewedTrack, sectionValid: false }, () => {
            this.nextButton();

            const commentRef = 
                firebase.database().ref('users/' + this.state.currentUserID + '/audio/' + this.state.currentFolderID + '/' 
                + this.state.currentTrackID + '/commentdata/1');

            commentRef.once('child_added', (snapshot) => {
                this.setState({ sectionValid: true })
            });
        });

        event.preventDefault();
    }

    render() {
        return (
            <Grow in={true}>
                <Box display='flex' flexDirection='column' justifyContent='center' textAlign='center'
                style={{position:'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#2f384770'}}
                >
                    {/*Header*/}
                    <Box height='10%' style={{position: 'absolute', top: 0, left: 0, right: 0}}>
                        <Box><CardHeader title="Instant Matching" className={this.props.router.getStyles('appBackground')} /></Box>
                        <Box display='flex' flexDirection='column' alignContent='center' className={this.props.router.getStyles('appBackground')}
                            style={{ position: 'absolute', top: '32px', width: '100%' }}
                        >
                            <h3>{steps[this.state.activeStep]}</h3>
                        </Box>
                    </Box>

                    {/*Content and Prevew*/}
                    <Box height='80%' display='flex' flexDirection='column' justifyContent='flex-start' alignItems='center' 
                    marginTop='72px' marginBottom={isMobile ? '72px' : 0} style={{overflowY: 'auto'}}>
                        <Box height={(this.state.slideStep >= 3) ? 0 : '40%'} display='flex' flexDirection='column' justifyContent='center' alignItems='center' marginTop='16px'>
                            <div hidden={(this.state.slideStep >= 3) ? true : false}>
                                <Collapse in={this.state.trackPreviewPlayer}>
                                    <Box>{this.state.trackPreviewPlayer}</Box>
                                </Collapse>
                            </div>
                        </Box>

                        {/* Sliding Content */}
                        <Box display='flex' width='80%' flexDirection='column' justifyContent='flex-start' alignSelf='center' marginTop='12px' marginBottom='68px'
                        height='60%'>
                            <Slide
                                in={this.state.inProp}
                                onExited={() => this.setState({ inProp: !this.state.inProp, slideStep: this.state.activeStep })}
                                direction="up"
                            >
                                <div>
                                    <div hidden={(this.state.slideStep === 0 ? false : true)}>
                                        <Box display='flex' flexDirection='row' justifyContent='center'>
                                            <Input
                                                type="file"
                                                inputProps={{ ref: this.fileInput, accept: 'audio/flac, audio/m4a, audio/wav, audio/mp3, audio/aac' }}
                                                required={true}
                                                onChange={this.handleFileSelect}
                                                startAdornment={
                                                    <InputAdornment>
                                                        <PublishIcon />
                                                    </InputAdornment>
                                                }
                                                style={{width: isMobile ? '90%' : '50%'}}
                                            />
                                        </Box>
                                    </div>
                                    <div hidden={(this.state.slideStep === 1 ? false : true)}>
                                        <Box display='flex' flexDirection='column' alignItems='center'>
                                            <TextField
                                                label="Track Name"
                                                name='trackName'
                                                placeholder='. . .'
                                                size='medium'
                                                required='true'
                                                value={this.state.trackName}
                                                onChange={this.handleChange}
                                                fullWidth
                                                style={{width: isMobile ? '90%' : '50%'}}
                                            />
                                            <TextField
                                                label="Description"
                                                name='trackDescription'
                                                placeholder='. . .'
                                                size='medium'
                                                value={this.state.trackDescription}
                                                onChange={this.handleChange}
                                                fullWidth
                                                style={{width: isMobile ? '90%' : '50%'}}
                                            />
                                        </Box>
                                    </div>
                                    <div hidden={(this.state.slideStep === 2 ? false : true)}>
                                        <Box display='flex' flexDirection='column' mt='12px'>
                                            <div>
                                                <FormControlLabel
                                                    control={<Checkbox id='0' name="Mixing" onChange={this.handleChange} />}
                                                    label="Mixing"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox id='1' name="Mastering" onChange={this.handleChange} />}
                                                    label="Mastering"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox id='2' name="Arrangement" onChange={this.handleChange} />}
                                                    label="Arrangement"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox name="other" onClick={() => { this.setState({ other: !this.state.other }) }} />}
                                                    label="Other"
                                                />
                                                <Collapse in={this.state.other ? true : false} display='flex' flexDirection='column'>
                                                    <div style={{color: '#e6eaff'}}>Please specify "Other" tag (Limit 12 characters):</div>
                                                    <TextField
                                                        name='metaDataOther'
                                                        placeholder='. . .'
                                                        size='medium'
                                                        inputProps={{ maxLength: 12 }}
                                                        value={this.state.metaDataOther}
                                                        onChange={this.handleChange}
                                                    />
                                                </Collapse>
                                                <div hidden={(this.props.router.getUserID() ? false : true)}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                name="trackIsPublic"
                                                                onClick={() => { this.setState({ trackIsPublic: !this.state.trackIsPublic }) }}
                                                            />
                                                        }
                                                        label="Save track to account"
                                                    />
                                                </div>
                                            </div>
                                        </Box>
                                    </div>
                                    <div hidden={(this.state.slideStep === 3 ? false : true)}>
                                        <Box display='flex' flexDirection='column' alignItems='center'>
                                            <h2 className={this.props.router.getStyles('appBackground')}>{this.state.matchingStatus}</h2>
                                            <CircularProgress />
                                        </Box>
                                    </div>
                                    <div hidden={(this.state.slideStep === 4 ? false : true)}>
                                        <Box display='flex' flexDirection='column'>
                                            <div style={{ color: '#e6eaff' }}>
                                                You can click and drag to specify sections to comment on.
                                                Please offer constructive criticism.
                                            </div>
                                            {this.state.trackMatchPlayer}

                                            <div>
                                                <Tooltip
                                                    title='Please contribute feedback to continue'
                                                    arrow={true}
                                                    placement='right'
                                                    disableHoverListener={this.state.sectionValid}
                                                >
                                                    <div>
                                                        <Button onClick={this.finishReview} variant='outlined' className={this.props.router.getStyles('b_MainWindow')}
                                                            style={{ width: '50%' }}
                                                            endIcon={<DoubleArrow />}
                                                            disabled={!this.state.sectionValid}
                                                        >
                                                            Continue
                                                        </Button>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </Box>
                                    </div>
                                    <div hidden={(this.state.slideStep === 5 ? false : true)}>
                                        <Box display='flex' flexDirection='column'>
                                                {this.state.sectionValid ? 
                                                <div>
                                                    <div style={{color: '#e6eaff'}}>Your feedback is here:</div>
                                                    {this.state.reviewedTrackPlayer} 
                                                </div>
                                                : 
                                                <div>
                                                    <Box mx={2} style={{color: '#e6eaff'}}>Matched user is still typing ...</Box>
                                                    <Box mx={4}><CircularProgress /></Box>
                                                </div>}
                                            <div>
                                                <Button onClick={this.matchAgain} variant='outlined' className={this.props.router.getStyles('b_MainWindow')}
                                                style={{width:'50%'}}>
                                                    Match Again
                                                </Button>
                                            </div>
                                            <div hidden={(this.props.router.getUserID() ? true : false)}>
                                                <Button
                                                    onClick={() => {
                                                        this.setState({ keepTracks: true },
                                                            () => this.props.router.updateContent(<NewAccount router={this.props.router} anonymousID={this.state.anonymousID} />))
                                                        }
                                                    }
                                                    variant='outlined'
                                                    className={this.props.router.getStyles('b_MainWindow')}
                                                    style={{width: '50%', marginTop: '12px'}}
                                                >
                                                    Create An Account
                                                </Button>
                                            </div>
                                        </Box>
                                    </div>

                                    {/*Desktop Navigation*/}
                                    <Box display={isMobile ? 'none' : 'flex'} flexDirection='row' justifyContent='space-evenly' alignContent='center' alignItems='center' width='100%'
                                    paddingTop='24px'>
                                        <Box width='30%'>
                                            <div style={{ visibility: (this.state.activeStep === 0 || this.state.activeStep >= 3 ? 'hidden' : 'visible') }}>
                                                <Button
                                                    onClick={() => this.backButton()}
                                                    startIcon={<NavigateBeforeRoundedIcon />}
                                                    className={this.props.router.getStyles('b_MainWindow')}
                                                    variant='outlined'
                                                    fullWidth
                                                >
                                                    Back
                                                </Button>
                                            </div>
                                        </Box>
                                        <Box width='30%'>
                                            <Tooltip
                                                title='Please fill out all required fields'
                                                arrow={true}
                                                placement='right'
                                                disableHoverListener={this.state.sectionValid || this.state.activeStep === 2}
                                            >
                                                <div style={{ visibility: (this.state.activeStep >= 3 ? 'hidden' : 'visible') }}>
                                                    <Button
                                                        disabled={!this.state.sectionValid && (this.state.activeStep !== 2)}
                                                        onClick={(this.state.activeStep === 2) ? this.handleMatch : () => this.nextButton()}
                                                        endIcon={<NavigateNextRoundedIcon />}
                                                        className={this.props.router.getStyles('b_MainWindow')}
                                                        variant='outlined'
                                                        fullWidth
                                                    >
                                                        {(this.state.activeStep === 2) ? 'Match' : 'Next'}
                                                    </Button>
                                                </div>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    
                                </div>
                            </Slide>
                        </Box>
                    </Box>

                    {/* Stepper & Mobile Navigation */}
                    {isMobile ? 
                        <Box height='10%' minHeight='48px' display='flex' flexDirection='row' width='100%' justifyContent='flex-end' alignSelf='center' 
                        alignItems='center' marginBottom='16px' className={this.props.router.getStyles('defaultBar')}
                        style={{position: 'absolute', bottom: 0}}
                        >
                            <Box style={{width: '50%'}}>
                                <div style={{ visibility: (this.state.activeStep === 0 || this.state.activeStep >= 3 ? 'hidden' : 'visible') }}>
                                    <Button
                                        onClick={() => this.backButton()}
                                        startIcon={<NavigateBeforeRoundedIcon/>}
                                        className={this.props.router.getStyles('b_AccentSecondary')}
                                        fullWidth
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Box>
                            <Divider orientation="vertical"  flexItem className={this.props.router.getStyles('blueGreyFade')}/>
                            <Box style={{width:'50%'}}>
                                <Tooltip
                                    title='Please fill out all required fields'
                                    arrow={true}
                                    placement='right'
                                    disableHoverListener={this.state.sectionValid}
                                >
                                    <div style={{ visibility: (this.state.activeStep >= 3 ? 'hidden' : 'visible') }}>
                                        <Button
                                            onClick={(this.state.activeStep === 2) ? this.handleMatch : () => this.nextButton()}
                                            disabled={!this.state.sectionValid && (this.state.activeStep !== 2)}
                                            endIcon={<NavigateNextRoundedIcon/>}
                                            className={this.props.router.getStyles('b_AccentSecondary')}
                                            fullWidth
                                        >
                                            {(this.state.activeStep === 2) ? 'Match' : 'Next'}
                                        </Button>
                                    </div>
                                </Tooltip>
                            </Box>
                        

                            <div>
                                <MobileStepper
                                    variant="progress"
                                    steps={6}
                                    activeStep={this.state.activeStep}
                                    className={this.props.router.getStyles('defaultBar')}
                                />
                            </div>
                        </Box>
                        :
                        <div>
                            <Stepper
                                activeStep={this.state.activeStep}
                                alternativeLabel={true}
                                className={this.props.router.getStyles('defaultBar')}
                            >
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel orientation="vertical">{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                    }
                </Box>
            </Grow>
        );
    }
}