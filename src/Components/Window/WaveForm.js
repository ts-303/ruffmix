import { Box, Button, Chip, CircularProgress, Collapse, IconButton, Paper, TextField, Tooltip } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PauseCircleOutlineRoundedIcon from '@material-ui/icons/PauseCircleOutlineRounded';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import firebase from 'firebase';
import React, { useEffect, useRef } from 'react';
import WaveSurfer from "wavesurfer.js";
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CommentObject from './CommentObject';
import { UploadTrack } from './UploadTrack';
import './WaveForm.css';
import PropTypes from 'prop-types';

/**
 * Displays the comment section of a Waveform component
 * @param {Array.<Object>} args The array of comments to be displayed
 * @returns A representation of the comment section which includes CommentObject components
 */
export function CommentSection(args) {

    var listComments = '';

    if (args.commentArray !== '') {
        const comments = args.commentArray;
        listComments = comments.map((newComment) => {
            if (newComment !== '') return (
                <Box display='flex' flexDirection='row' justifyContent={(newComment.author === args.router.getUserID()) ? 'flex-end' : 'flex-start'}>
                    <CommentObject router={args.router} userID={newComment.author} comment={newComment.body} player={args.player} />
                </Box>
            )
        });
    }

    return (<div>{listComments}</div>);
}

/**
 * Creates a new Wavesurfer instance  
 * @param {*} args Defines various parameters for how the instance is created
 * @param {boolean} args.isChild Determines if this instance is a child within a list of tracks and sizes it accordingly
 * @param {boolean} args.playState Toggles pause/play 
 * @param {Function} args.handleReady Callback function to be used when the Wavesurfer instance is ready
 * @param {Function} args.setTime Callback function to be used when the user seeks on the Wavesurfer instance
 * @param {File} args.audiofile The audio file to be loaded into the Wavesurfer instance
 * @param {Function} args.setLoadingProgress Callback function to be used while the Wavesurfer instance is loading, receives integer loading progress (0..100)
 * @param {boolean} args.asPreview Omittable boolean to determine if this instance is to be used as a preview. Disables drag selection when set to true.
 * @param {Function} args.identifier Omittable callback function used to show the display name of a user when hovering the mouse over a commented region
 * @returns A new Wavesurfer instance
 */
export function MakeWave(args) {
    const waveformRef = useRef();
    const timelineRef = useRef();

    const playerHeight = args.isChild ? 64 : 96;

    useEffect(() => {
        if (waveformRef.current) {
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                height: playerHeight,
                progressColor: 'lightgrey',
                waveColor: 'lightgreen',
                responsive: 'true',
                plugins: [
                    TimelinePlugin.create({
                        container: timelineRef.current,
                        height: playerHeight,
                        timeInterval: 7.5,
                    }),
                    CursorPlugin.create({
                        showTime: 'true',
                        opacity: '1',

                    }),
                    RegionsPlugin.create({
                        regionsMinLength: 2,
                    })
                ]
            });

            if (args.asPreview === false) wavesurfer.enableDragSelection({ color: 'hsla(400, 100%, 30%, 0.1)', id: 'dragSelection' });

            wavesurfer.on('ready', () => args.handleReady(wavesurfer));
            wavesurfer.on('seek', () => args.setTime());
            wavesurfer.on('loading', (progress) => args.setLoadingProgress(progress));
            //Draw user info over region
            wavesurfer.on('region-mouseenter', (region) => {

                const commentIndex = (region.id.substring(region.id.indexOf('[') + 1, region.id.indexOf(']')));
                const parsed = region.id.substring(region.id.indexOf('_') + 1, region.id.length)
                const ref = firebase.database().ref('users/' + parsed + '/displayname');

                var regionUser = '';
                ref.on('value', (snapshot) => {
                    regionUser = snapshot.val();
                });

                var identifierObj = {
                    xPos: 0,
                    user: regionUser
                }

                region.on('mouseenter', (mouseEvent) => {
                    identifierObj.xPos = mouseEvent.pageX;
                    args.identifier(identifierObj);
                })

            });


            var storage = firebase.storage().ref();

                                                                                                //Might not have use case for loading preview in non-local file
            if (args.audiofile) {
                if (args.audiofile instanceof File) wavesurfer.loadBlob(args.audiofile);
                else {
                    storage.child(args.audiofile).getDownloadURL().then((url) => {
                        var xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = (event) => {
                            var blob = xhr.response;
                        };
                        xhr.open('GET', url);
                        xhr.send();
    
                        wavesurfer.load(url);
                    }).catch((error) => {
                        alert('Waveform download error: ' + error);
                    });
                }  
            }
        }
    }, []);

    return (
        <div>
            <Box position='relative' zIndex='5' ref={waveformRef} />
            <div style={{ opacity: '20%', marginTop: -playerHeight, pointerEvents: 'none', }} ref={timelineRef} />
        </div>
    )
}

/**
 * 
 * @param {Array.<string>} props.array The metadata array associated with this Waveform component
 * @returns A representation of the metadata
 */
export function MetaDataSection(props) {
    if (props.array) {
        const dataArray = props.array;
    
        const colors = ['#FFAB91', '#CE93D8', '#80CBC4', '#FFE082'];
    
        const chips = dataArray.map((data, index) => {
            if (data !== '') return <Box mx={0.5}><Chip style={{ backgroundColor: colors[index] }} size="small" label={data} /></Box>
        }
        );
    
        return chips;
    }
}

/**
 * The WaveForm class organizes the various parts of a WaveForm component which is the main way audio is played on Ruffmix. 
 * The component includes areas for audio playback, comments, metadata tags, title and description, and can be deleted or updated with a new version
 * of the track, which is shown in a track 'timeline'.
 * @returns The representation of the Waveform component, either as a preview (which only allows for basic playback and seeking) or with the full
 * content as described above.
 */
class WaveForm extends React.Component {
    static propTypes = {
        /**
         * The audio file to be loaded and played. Supported formats are .mp3, .wav, .aac, .m4a, .flac 
         */
        audiofile: PropTypes.instanceOf(File),
        /**
         * The component which is intended to handle the playback of more than one WaveForm component. If the WaveForm component is not a preview, this 
         * property should be the AccountView window component
         */
        controller: PropTypes.elementType,
        /**
         * A brief description of the track
         */
        description: PropTypes.string,
        /**
         * The folder ID for a track on Firebase storage 
         */
        folderID: PropTypes.string,
        /**
         * Determines if this WaveForm component is a child in a list of tracks, and passes this value to the MakeWave function
         */
        isChild: PropTypes.bool,
        /**
         * The array of metadata associated with the track
         */
        metadata: PropTypes.array,
        /**
         * The router component to be used, use MainWindowController for most cases
         */
        router: PropTypes.elementType,
        /**
         * The ID of a track on Firebase storage
         */
        trackID: PropTypes.string,
        /**
         * The displayed name of the track
         */
        trackname: PropTypes.string,
        /**
         * The ID of a user on Firebase
         */
        userID: PropTypes.string,
    }

    constructor(props) {
        super(props)

        this.state = {
            playState: false,
            expand: false,
            isChild: this.props.isChild,
            trackIsPreview: (this.props.preview ? this.props.preview : false),
            commentArr: [],
            commentContent: '',
            playerObject: '',
            playerDuration: '',
            currentTime: '',
            controller: this.props.controller,
            containsPreviews: false,
            audioFile: this.props.audiofile,
            trackName: this.props.trackname,
            metaData: this.props.metadata,
            description: this.props.description,
            folderID: this.props.folderID,
            trackID: this.props.trackID,
            userID: this.props.userID,
            loadingProgress: 0,
            regionIdentifier: '',
            authorControls: ((this.props.userID === this.props.router.getUserID()) ? true : false),
        };
        this.handleReady = this.handleReady.bind(this);
        this.setTime = this.setTime.bind(this);
        this.setLoadingProgress = this.setLoadingProgress.bind(this);
        this.setRegionIdentifier = this.setRegionIdentifier.bind(this);
    }

    /**
     * Loads the comments associated with this track
     */
    componentDidMount() {
        const trackRef = firebase.database().ref('users/' + this.state.userID + '/audio/' + this.state.folderID + '/' + this.state.trackID);
        var trackParse = '';

        trackRef.on('value', (snapshot) => {
            trackParse = snapshot.val();
            if (trackParse) {
                this.setState({
                    commentArr: trackParse.commentdata,
                });
            }

        });
    }

    componentWillUnmount() {
        this.stopPlay();
    }

    /**
     * Allows the user to add an updated version of a track into its 'timeline'
     */
    newTrackVersion() {
        if (this.props.router.getUserID() && this.state.authorControls) this.props.router.updateContent(<UploadTrack router={this.props.router} newVersionFolder={this.state.folderID} />);
        else this.login();
    }

    /**
     * Deletes the track
     */
    deleteTrack() {
        if (this.state.authorControls) {
            this.props.router.setLoadingState(true);

            firebase.database().ref('users/' + this.state.userID + '/audio/' + this.state.folderID + '/' + this.state.trackID).remove().then(() => {
                console.log('Deleted track from realtime DB');
            }).catch((error) => {
                alert('Realtime DB track delete error: ' + error)
            });

            firebase.storage().ref().child('audio/' + this.state.folderID + '/' + this.state.trackID).delete().then(() => {
                console.log('Deleted track from storage');
                this.state.controller.getTracks();
            }).then(() => this.props.router.setLoadingState(false)).catch((error) => {
                alert('Storage track delete error: ' + error)
            });
        }
    }

    /**
     * Removes any regions selected on a track while writing a comment before the comment is submitted
     */
    clearPreviewRegions() {
        if (this.state.playerObject) {
            var currentRegions = this.state.playerObject.regions.list;
            Object.keys(currentRegions).forEach(function (key) {
                if (currentRegions[key].id.includes('preview')) currentRegions[key].remove();
            });
        }
    }

    /**
     * Parses the comments and draws all referenced regions onto the track's Wavesurfer instance
     */
    drawExistingRegions() {
        if (this.state.playerObject) {
            this.state.playerObject.clearRegions();

            var parseCommentObjects = this.state.commentArr;

            var index = 0;

            parseCommentObjects.forEach(comment => {
                //Parse each comment for region display
                if (comment) {
                    const timeRegex = new RegExp('^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d\\s|^\\d\\:\\d\\d\\-\\d\\:\\d\\d\\s'
                        + '| \\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d|\\d\\:\\d\\d\\-\\d\\:\\d\\d '
                        + '|\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|\\d\\:\\d\\d\\-\\d\\:\\d\\d$'
                        + '|^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|^\\d\\:\\d\\d\\-\\d\\:\\d\\d$', 'g');
                    var found = JSON.stringify(comment.body).match(timeRegex);

                    if (found) {
                        found.forEach(
                            timeString => {
                                const duration = timeString.split('-', 2);
                                const from = duration[0];
                                const to = duration[1];

                                const fromSplit = from.split(":");
                                const startTime = fromSplit[0] * 60 + fromSplit[1] * 1;

                                const toSplit = to.split(":");
                                const endTime = toSplit[0] * 60 + toSplit[1] * 1;

                                const trackDuration = this.state.playerObject.getDuration();
                                if (startTime >= 0 && endTime >= 0 && startTime <= trackDuration && endTime <= trackDuration) {
                                    this.state.playerObject.addRegion({
                                        id: '[' + index + ']' + (Math.random().toString()).substring(2, 8) + '_' + comment.author,
                                        start: startTime,
                                        end: endTime,
                                        resize: false,
                                        drag: false,
                                        color: 'hsla(200, 50%, 70%, 0.4)',
                                    });
                                }
                            }
                        );
                    }

                    index++;
                }
            });
        }
        this.checkRegions();
    }

    /**
     * Draws a preview of the regions to be added onto the Wavesurfer instance when a new comment is being written
     */
    previewRegion() {
        this.clearPreviewRegions();

        const timeRegex = new RegExp('^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d\\s|^\\d\\:\\d\\d\\-\\d\\:\\d\\d\\s'
            + '| \\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d|\\d\\:\\d\\d\\-\\d\\:\\d\\d '
            + '|\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|\\d\\:\\d\\d\\-\\d\\:\\d\\d$'
            + '|^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|^\\d\\:\\d\\d\\-\\d\\:\\d\\d$', 'g');
        var found = this.state.commentContent.match(timeRegex);

        if (found) {
            found.forEach(
                timeString => {
                    const duration = timeString.split('-', 2);
                    const from = duration[0];
                    const to = duration[1];

                    const fromSplit = from.split(":");
                    const startTime = fromSplit[0] * 60 + fromSplit[1] * 1;

                    const toSplit = to.split(":");
                    const endTime = toSplit[0] * 60 + toSplit[1] * 1;

                    const trackDuration = this.state.playerObject.getDuration();
                    if (startTime >= 0 && endTime >= 0 && startTime <= trackDuration && endTime <= trackDuration) {
                        var currentRegions = this.state.playerObject.regions.list;

                        //Adds new preview regions
                        if (currentRegions) {
                            let count = 0;
                            var wasFound = false;
                            Object.keys(currentRegions).forEach(function (key) {
                                count++;
                                if (currentRegions[key].start === startTime && currentRegions[key].end === endTime && currentRegions[key].id.includes('preview')) {
                                    wasFound = true;
                                }
                            });

                            if (!wasFound) {
                                this.state.playerObject.addRegion({
                                    id: 'preview ' + count,
                                    start: startTime,
                                    end: endTime,
                                    resize: false,
                                    color: 'hsla(400, 100%, 30%, 0.1)'
                                });
                            }
                        }
                    }
                }
            );
        }

    }

    /**
     * Ensures a comment correctly specifies a full range for a region preview 
     * @example 0:30-1:00 //The correct format for a region to be commented on
     */
    checkRegions() {

        const currentRegions = this.state.playerObject.regions.list;
        const comment = this.state.commentContent;

        var previewCheck = false;

        Object.keys(currentRegions).forEach(function (key) {
            const start = currentRegions[key].start;
            const end = currentRegions[key].end;
            const startCheck = new Date(start * 1000).toISOString().substr(15, 4);
            const endCheck = new Date(end * 1000).toISOString().substr(15, 4);

            if (currentRegions[key].id.includes('preview')) {
                previewCheck = true;
            }

            if (currentRegions[key].id.includes('preview') && !comment.includes(startCheck + '-' + endCheck)) {
                currentRegions[key].remove();
            }
        });

        this.setState({
            containsPreviews: previewCheck
        })
    }

    /**
     * Gets the playback time of a track in seconds, as required by Wavesurfer in order to create/modify regions
     * @param {string} time The string representation of a playback time in mm:ss
     * @returns The total seconds of the time in integer form
     */
    getSeconds(time) {
        const str = time.split(':');
        const minutes = str[0], seconds = str[1];
        const total = parseInt(minutes * 60) + parseInt(seconds);
        return total;
    }

    handleTextChange = (event) => {
        this.setState({
            commentContent: event.target.value,
        })

        this.previewRegion();
        this.checkRegions();
        event.preventDefault();
    }

    handleCommentSubmit = (event) => {
        event.preventDefault();

        if (this.state.commentContent) {
            if (!this.state.expand) this.toggleExpand();

            var newCommentData = {
                author: this.props.router.getUserID(),
                body: this.state.commentContent
            };

            var newArr = [];

            if (this.state.commentArr.length === 0) newArr[0] = newCommentData;
            else newArr = this.state.commentArr.concat(newCommentData);

            firebase.database()
                .ref('users/' + this.state.userID + '/audio/' + this.state.folderID + '/' + this.state.trackID)
                .update({ commentdata: newArr });

            this.setState({
                commentContent: '',
                inputTime: '',
            }, () => this.drawExistingRegions());
        }

    }

    /**
     * Callback function used with MakeWave to set a track's loading progress 
     * @param {int} props The integer progress returned from the Wavesurfer instance
     */
    setLoadingProgress(props) {
        this.setState({
            loadingProgress: props,
        })
    }

    /**
     * Callback function used with MakeWave to set the current time when a user seeks on the Wavesurfer instance
     */
    setTime() {
        this.setState({
            currentTime: new Date(this.state.playerObject.getCurrentTime() * 1000).toISOString().substr(11, 8),
            playState: true
        }, () => this.togglePlay(this.state.playerObject.getCurrentTime()))
    }

    /**
     * Callback function that allows the WaveForm component to show the display name of the author of a comment's region 
     * @param {Object} props An object that contains information about a region
     * @param {float} props.xPos The x position of the region in the window
     * @param {string} props.user The user's display name
     */
    setRegionIdentifier(props) {
        this.setState({
            regionIdentifier: props
        })
    }

    /**
     * Callback function called when the Wavesurfer instance's ready event is fired, which sets up the WaveForm component's playback functionality and display
     * @param {Object} args The Wavesurfer object to be used with this WaveForm component
     */
    handleReady(args) {
        const duration = new Date(args.getDuration() * 1000).toISOString().substr(11, 8);

        this.setState({
            playerObject: args,
            playerDuration: duration,
            currentTime: new Date(args.getCurrentTime() * 1000).toISOString().substr(11, 8)
        })

        if (!this.state.trackIsPreview) {
            this.state.playerObject.on('region-update-end', (region) => {
                if (region.id === 'dragSelection') {
                    const start = region.start;
                    const end = region.end;

                    const startConvert = new Date(start * 1000).toISOString().substr(15, 4);
                    const endConvert = new Date(end * 1000).toISOString().substr(15, 4);

                    const newTimeStr = this.state.commentContent.concat(startConvert + '-' + endConvert + ' ');
                    this.setState({ commentContent: newTimeStr });
                    region.remove();
                    this.previewRegion();
                    this.checkRegions();
                }
            });

            this.checkRegions();
            this.drawExistingRegions();
        }

        this.state.playerObject.on('pause', () => { if (this.state.playState !== false) this.setState({ playState: !this.state.playState }) });
    }

    stopPlay() {
        if (this.state.playerObject) {
            this.setState({
                playState: false,
            })
            this.state.playerObject.pause();
        }
    }

    /**
     * Begins playback at a certain point of a track
     * @param {string} time The playback time of a track in mm:ss format
     */
    playFrom(time) {
        const playFromTime = time.split('-');
        const from = this.getSeconds(playFromTime[0]);
        const to = this.getSeconds(playFromTime[1]);
        this.togglePlay(from, to);
    }

    /**
     * Handles the pause/play functionality of a track. Can be overloaded with a start and end range to only play a certain section of the track.
     * @param {int} start 
     * @param {int} end 
     */
    togglePlay(start, end) {
        if (this.state.playerObject) {

            if (start) this.state.playerObject.play(start);
            else if (start && end) this.state.playerObject.play(start, end);
            else this.state.playerObject.playPause();

            if (!start && !end) {
                this.setState({playState: !this.state.playState})
            }
            else this.setState({playState: true})

            if (!this.state.trackIsPreview && this.state.controller) {
                if (this.state.controller.getPrevPlayer() === "") {
                    this.state.controller.setPrevPlayer(this);
                }
                else if (this !== this.state.controller.getPrevPlayer()) {
                    this.state.controller.getPrevPlayer().stopPlay();
                    this.state.controller.setPrevPlayer(this);
                }
            }
        }
    }

    /**
     * Opens or closes the comment section of the WaveForm component
     */
    toggleExpand() {
        this.setState({
            expand: !this.state.expand,
        })
    }

    //Displays the WaveForm either as a preview or with full content
    render() {
        if (this.state.trackIsPreview) {
            return (
                <Box>
                    <Box display='flex' flexDirection='row' alignItems='center'>
                        <IconButton
                            onClick={() => { this.togglePlay() }}
                            size='small'
                            edge='start'
                            style={{ marginRight: '5px'}}
                            children={this.state.playState ?
                                <PauseCircleOutlineRoundedIcon style={{ width: '64px', height: '64px' }} />
                                : <PlayCircleOutlineRoundedIcon style={{ width: '64px', height: '64px' }} />
                            }
                        >
                        </IconButton>
                        <Box width='400px'>
                            <MakeWave
                                isChild={false}
                                playState={this.state.playState}
                                handleReady={this.handleReady}
                                setTime={this.setTime}
                                audiofile={this.state.audioFile}
                                setLoadingProgress={this.setLoadingProgress}
                            />
                        </Box>
                    </Box>
                    <Box display='flex' flexDirection='row' justifyContent='center'>
                        <MetaDataSection array={this.state.metaData}/>
                    </Box>
                </Box>
            )
        }
        else return (
            <Box display='flex' flexDirection='column' padding='10px'>
                <Box
                    style={{ display: this.state.isChild ? 'flex' : 'none' }}
                    paddingLeft='70%'
                    margin='10px'
                >
                    <MoreVertIcon style={{ color: 'lightgrey' }} fontSize='small' />
                </Box>
                <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='flex-start'
                    paddingLeft='20%'
                    style={{ display: this.state.isChild ? "none" : "true", }}
                >
                    {this.state.trackName + ' - ' + this.state.description}
                    <Paper style={{ position: 'fixed', left: this.state.regionIdentifier.xPos }}>
                        {this.state.regionIdentifier.user}
                    </Paper>
                </Box>
                <Box display='flex' flexDirection='row' alignItems='center' justifyContent='flex-end'>
                    <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='space-between'
                        style={{ visibility: this.state.authorControls ? "visible" : "hidden", zIndex: '2' }}
                    >
                        <Tooltip title='Upload a new version of this track' placement='left' arrow={true}>
                            <IconButton onClick={() => this.newTrackVersion()} style={{ display: this.state.isChild ? "none" : "true", }}>
                                <SubdirectoryArrowRightIcon style={{ transform: 'scaleY(-1)' }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete this track' placement='left' arrow={true}>
                            <IconButton onClick={() => this.deleteTrack()}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <IconButton
                        onClick={() => { this.togglePlay() }}
                        size='small'
                        edge='start'
                        style={{ marginRight: '5px' }}
                        children={this.state.playState ?
                            <PauseCircleOutlineRoundedIcon style={{ width: this.state.isChild ? '48px' : '64px', height: this.state.isChild ? '48px' : '64px' }} />
                            : <PlayCircleOutlineRoundedIcon style={{ width: this.state.isChild ? '48px' : '64px', height: this.state.isChild ? '48px' : '64px' }} />
                        }
                    >
                    </IconButton>
                    <Box width={this.state.isChild ? '60%' : '80%'}>
                        <div>
                            <Box style={{ display: (this.state.loadingProgress === 100) ? "none" : "true", }} display='flex' justifyContent='center'>
                                <CircularProgress />
                            </Box>
                            <div style={{ visibility: (this.state.loadingProgress === 100) ? "visible" : "hidden", }}>
                                <MakeWave
                                    isChild={this.state.isChild}
                                    playState={this.state.playState}
                                    handleReady={this.handleReady}
                                    setTime={this.setTime}
                                    audiofile={this.props.audiofile}
                                    setLoadingProgress={this.setLoadingProgress}
                                    asPreview={this.state.trackIsPreview}
                                    identifier={this.setRegionIdentifier}
                                />
                            </div>
                        </div>
                    </Box>
                </Box>
                <Box marginTop='-3%' display='flex' flexDirection='row-reverse' style={{ zIndex: '1' }}>{this.state.currentTime}/{this.state.playerDuration}</Box>
                <Box onClick={() => { this.toggleExpand() }} display='flex' flexDirection='row' justifyContent='flex-end' alignItems='center'>
                    <MetaDataSection array={this.state.metaData} />
                    <IconButton
                        onClick={() => { this.toggleExpand() }}
                        size='small'
                    >
                        <ExpandMoreIcon style={{ width: '24px', height: '24px' }} />
                    </IconButton>
                </Box>
                <Collapse onClick={() => { if (!this.state.expand) this.toggleExpand() }} in={this.state.expand ? true : false} collapsedHeight={15}>
                    <Box
                        display='flex'
                        marginLeft={this.state.isChild ? '40%' : '20%'}
                        flexDirection='column'
                        flexWrap='wrap'
                    >
                        <CommentSection commentArray={this.state.commentArr} player={this} router={this.props.router} />
                    </Box>
                </Collapse>
                <Box display='flex' flexDirection='row' justifyContent='flex-end' marginTop='4px'>
                    <form onSubmit={this.handleCommentSubmit}>
                        <Box display='flex' flexDirection='row' alignItems='flex-end' >
                            <TextField
                                label="New Comment"
                                placeholder='. . .'
                                require={true}
                                value={this.state.commentContent}
                                onChange={this.handleTextChange}
                                size='small'
                            />
                            <Box mx={2}><Button size='small' type='submit' variant='outlined' className={this.props.router.getStyles('b_MainWindow')}>Submit</Button></Box>
                            <Box>
                                <Button
                                    size='small'
                                    onClick={() => this.clearPreviewRegions()}
                                    style={{ display: this.state.containsPreviews ? 'flex' : 'none' }}
                                    className={this.props.router.getStyles('b_MainWindow')}
                                >
                                    Clear Regions
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Box>
        );

    }
}

export default WaveForm;