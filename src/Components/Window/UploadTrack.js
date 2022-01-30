import { Box, Button, CardHeader, Checkbox, Collapse, FormControl, FormControlLabel, Grow, Input, InputAdornment, TextField, Tooltip } from "@material-ui/core";
import PublishIcon from '@material-ui/icons/Publish';
import React from "react";
import firebase from '../../firebase';
import { AccountView } from './AccountView';
import './UploadTrack.css';
import WaveForm from "./WaveForm";
import PropTypes from 'prop-types';

/**
 * The UploadTrack window allows a registered user to upload a new track to their profile. 
 */
export class UploadTrack extends React.Component {
    static propTypes = {
        /**
         * The router component to be used, use MainWindowController for most cases
         */
        router: PropTypes.elementType,
        /**
         * Omittable ID of a track's folder when uploading a new version of the track
         */
        newVersionFolder: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            trackName: '',
            trackDescription: '',
            trackCommentData: [''],
            trackMetaData: ['','','',''],
            userID: this.props.router.getUserID(),
            audioFile: '',
            metaDataOther: '',
            other: false,
            trackPreviewPlayer: '',
            loadingProgress: 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleTrackSubmit = this.handleTrackSubmit.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.showLoadingProgress = this.showLoadingProgress.bind(this);

        this.fileInput = React.createRef();
        this.previewRef = React.createRef();
    }

    /**
     * Handles the selection of an audio file to upload and draws a Waveform preview. Supported formats are .mp3, .wav, .aac, .m4a, and .flac
     */
    handleFileSelect = (event) => {
        if (this.fileInput.current.files[0] !== this.state.audioFile) {
            this.setState({
                audioFile: this.fileInput.current.files[0]
            }, () => this.drawPreview(this.fileInput.current.files[0]))
        }

        event.preventDefault();
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
            })
        }

       //event.preventDefault();
    }

    /**
     * Uploads the audio track to Firebase storage
     */
    handleTrackSubmit = (event) => {
        var newFolderID = '';
        if (this.props.newVersionFolder) newFolderID = this.props.newVersionFolder;
        else {
            var fRef = firebase.database().ref().push();
            newFolderID = fRef.key;
        }

        var tRef = firebase.database().ref().push();
        var newTrackID = tRef.key;

        var newAudioFile = this.fileInput.current.files[0];
        //var newFileName = this.fileInput.current.files[0].name;

        const storageRef = firebase.storage().ref().child(this.state.userID + '/audio/' + newFolderID + '/' + newTrackID);
        this.props.router.setLoadingState(true);

        firebase.database().ref('users/' + this.state.userID + '/audio/' + newFolderID + '/' + newTrackID).set({
            folderID: newFolderID,
            trackID: newTrackID,
            userID: this.state.userID,
            trackname: this.state.trackName,
            description: this.state.trackDescription,
            metadata: this.state.trackMetaData,
            commentdata: this.state.trackCommentData,
        }).catch((error) => {
            alert('Track Data Set fail' + error);
        });

        storageRef.put(newAudioFile).then((snapshot) => {
            console.log('File upload success');
            this.props.router.updateContent(<AccountView router={this.props.router} user={this.props.router.getUserID()} />);
        }).then(() => this.props.router.setLoadingState(false)).catch((error) => {
            alert('Track Upload fail' + error);
        });

        event.preventDefault();
    }

    /**
     * Draws a preview of the track to be uploaded using the Waveform component
     * @param {File} args The audio file to be used in the Waveform component
     */
    drawPreview = (args) => {
        const waveObj = <WaveForm
                        isChild={false}
                        preview={true}
                        controller={this}
                        router={this.props.router}
                        audiofile={args}
                        trackname={this.state.trackName}
                        metadata={[]}
                        description=''
                        />;

        this.setState({
            trackPreviewPlayer: ''
        }, ()=> this.setState({trackPreviewPlayer: waveObj}))
    }

    showLoadingProgress(props) {
        this.setState({ 
            loadingProgress: props,
        })
    }

    render() {
        return (
            <Grow in={true}>
                <Box display='flex' flexDirection='column' justifyContent='space-between' height='100%' textAlign='center'>
                    <CardHeader title={this.props.newVersionFolder ? 'Upload New Track Version' : 'Upload New Track'} />
                    <Box display='flex' flexDirection='column'>
                        <Collapse in={this.state.trackPreviewPlayer} display='flex' flexDirection='column' justifyContent='flex-start'>
                            <Box height='64px' pb={7}>{this.state.trackPreviewPlayer}</Box>
                        </Collapse>
                        <form onSubmit={this.handleTrackSubmit}>
                            <Box display='flex' flexDirection='column' alignItems='center' className={this.props.router.getStyles('formContent')}>
                                <FormControl>
                                    <Tooltip title='Upload your music file - Supported formats: .mp3, .wav, .aac, .m4a, .flac' arrow={true} placement='right'>
                                        <Input
                                            type="file"
                                            inputProps={{ ref: this.fileInput, accept: 'audio/flac, audio/m4a, audio/wav, audio/mp3, audio/aac'}}
                                            required={true}
                                            onChange={this.handleFileSelect}
                                            startAdornment={
                                                <InputAdornment>
                                                    <PublishIcon />
                                                </InputAdornment>
                                            }

                                        />
                                    </Tooltip>
                                    <Tooltip title='The title of your track' arrow={true} placement='right'>
                                        <TextField
                                            label="Track Name"
                                            name='trackName'
                                            placeholder='. . .'
                                            size='medium'
                                            required={true}
                                            value={this.state.trackName}
                                            onChange={this.handleChange}
                                        />
                                    </Tooltip>
                                    <Tooltip title='A description of your track' arrow={true} placement='right'>
                                        <TextField
                                            label="Description"
                                            name='trackDescription'
                                            placeholder='. . .'
                                            size='medium'
                                            value={this.state.trackDescription}
                                            onChange={this.handleChange}
                                        />
                                    </Tooltip>
                                    <Tooltip title='What problem areas do you want feedback on, or what have you been working on?' arrow={true} placement='right'>
                                        <div>
                                            <FormControlLabel
                                                control={<Checkbox id='0' name="Mixing" onChange={this.handleChange}/>}
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
                                                control={<Checkbox name="other" onClick={() => {this.setState({other: !this.state.other})}}/>}
                                                label="Other"
                                            />
                                            <Collapse in={this.state.other ? true : false} display='flex' flexDirection='column'>
                                                    <div>Please specify "Other" tag (Limit 12 characters):</div>
                                                    <TextField
                                                        name='metaDataOther'
                                                        placeholder='. . .'
                                                        size='medium'
                                                        inputProps={{ maxLength : 12 }}
                                                        value={this.state.metaDataOther}
                                                        onChange={this.handleChange}
                                                    />
                                            </Collapse>
                                        </div>
                                    </Tooltip>
                                </FormControl>
                                <Button type='submit' variant='outlined' className={this.props.router.getStyles('b_MainWindow')}>Upload Track</Button>
                            </Box>
                        </form>
                    </Box>
                    <Box></Box>
                </Box>
            </Grow>
        );
    }
}