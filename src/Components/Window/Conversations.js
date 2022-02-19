import { Box, Button, Card, Divider, Fade, Menu, Grid, Slide, TextField, CardHeader } from "@material-ui/core";
import { AccountCircleOutlined, ArrowForwardIos, Send } from "@material-ui/icons";
import React from "react";
import firebase from "../../firebase";
import CommentObject from "./CommentObject";
import './Conversations.css';
import PropTypes, { arrayOf } from 'prop-types';
import { isMobile } from "react-device-detect";

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuIcon from '@material-ui/icons/Menu';

/**
 * Returns a representation of selectable conversations between other users.
 * @param {Object} router The router component
 * @param {Function} setActive - The setConvo function which is used in the Conversations class to set the currently selected and available conversations,
 * @param {Object} convos - Contains the list of available conversations set from the setConvo function.
 * @returns A representation of current conversations between users.
 */
const ActiveConvoSection = (args) => {
    var listConvos = '';

    if (args.convos) {
        const convos = args.convos;
        var namesList = '';

        namesList = convos.map((convo) => {
            var asdf = '';
            const userRef = firebase.database().ref('users/' + convo + '/displayname');
            userRef.on('value', (snapshot) => {
                asdf = snapshot.val();
            })

            return [convo, asdf];
        });

        //REMOVE
        // namesList = [
        //     ['id', 'user 1'], ['id', 'user 2'], ['id', 'user 3'], ['id', 'user 4'], ['id', 'user 5'], ['id', 'user 6'],
        //     ['id', 'user 7'], ['id', 'user 8'], ['id', 'user 9'], ['id', 'user 4'], ['id', 'user 5'], ['id', 'user 6'],
        // ];

        listConvos = namesList.map((val, index) => {
            const selectedID = val[0];
            const displayName = val[1];

            return (
                <div>
                    <Box display='flex' flexDirection='row'>
                        <Button
                            onClick={() => args.setActive(selectedID, displayName, index)} style={{ justifyContent: 'left', minWidth: '100%' }}
                            startIcon={args.currentIndex === index ? <ArrowForwardIos /> : false}
                            style={{ color: '#90a4ae', justifyContent: 'flex-start' }}
                            fullWidth
                        >
                            <AccountCircleOutlined />{displayName}
                        </Button>
                    </Box>
                    <Divider />
                </div>
            )
        });
    }

    return (<div>{listConvos}</div>);
}

/**
 * Displays the messages between two users.
 * @param {Array} messageArray The array of messages between two users 
 * @param {Object} router The router component
 * @param {Object} player The player component to be linked via message using the CommentObject component (not yet implemented, in this case it is null)
 * @returns A representation of the messages between two users.
 */
export function MessageSection(args) {

    var listMessages = '';

    if (args.messageArray.length > 0) {
        const messages = args.messageArray;

        listMessages = messages.map((newMessage) => {
            if (newMessage !== '') return (
                <Fade in={true} timeout={500}>
                    <Box display='flex' flexDirection='row' justifyContent={(newMessage.author === args.router.getUserID()) ? 'flex-end' : 'flex-start'}>
                        <CommentObject userID={newMessage.author} comment={newMessage.body} player={args.player} />
                    </Box>
                </Fade>
            )
        });
    }

    return (<div>{listMessages}</div>);
}

 export function MobileUserSelect(props) {
    
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
            <Button onClick={handleToggle} style={{color:"#90a4ae"}} startIcon={<ArrowForwardIos style={{scale:'-1'}}/>}/>
            <div ref={anchorRef}/>
            
            <Menu
                anchorEl={anchorRef}
                open={open}
                onClick={handleClose}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#2f3847',
                    }
                }}
            >
                <Box style={{position: 'sticky', top: 0, zIndex: 2, minHeight: '40px', fontSize: '24px',
                backgroundColor: '#2f3847', color: '#90a4ae', display: 'flex', flexDirection: 'column', justifyContent:'center', textAlign: 'center'}}>
                    Active Conversations
                </Box>
                <Box>
                    {props.userList}
                </Box>
            </Menu>

            {/* <Popper open={open} anchorEl={anchorRef.current} transition>
                {({ TransitionProps }) => (
                    <Grow
                    {...TransitionProps}
                    in={open}
                    style={{ transformOrigin: 'right'}}
                    >
                        <Card style={{position: 'relative', right: 0}}>
                            <ClickAwayListener onClickAway={handleClose}>
                                {props.userList}
                            </ClickAwayListener>
                        </Card>
                    </Grow>
                )}
            </Popper> */}
        </div>
    );
}

/**
 * The Conversations window allows for instant messaging between registered users
 */
export class Conversations extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            userDisplayName: "",
            userConvos: '',
            convoNames: '',
            currentMessages: [],
            currentConvo: "",
            currentDisplayName: '',
            messageContent: '',
            activeConvos: '',
            selectedIndex: 0,
        };

        this.setConvo = this.setConvo.bind(this);
    }

    /**
     * Loads the active conversations and allows the messages of a conversation to be loaded via ActiveConvoSection
     * @param {*} args Should contain a reference to the user whose active conversations will be loaded
     */
    setConvo = (id, displayName, index) => {

        var setCurrentConvo = '';

        this.setState({
            currentMessages: [],
            selectedIndex: index,
        }, () => {

            if (id !== this.props.router.getUserID()) {
                if (this.state.userConvos.length !== 0) {
                    var userIndex = 0;

                    const convos = Object.keys(this.state.userConvos);

                    for (const convo in convos) {

                        if (id === convos[convo]) break;
                        else userIndex++;
                    }

                    setCurrentConvo = Object.entries(this.state.userConvos)[userIndex];

                    if (setCurrentConvo) {
                        const setCurrentMessages = setCurrentConvo[1];

                        this.setState({
                            currentConvo: setCurrentConvo[0],
                            currentMessages: Object.values(setCurrentMessages.messages),
                        });
                    }
                }
                if (this.state.userConvos.length === 0 || !setCurrentConvo) {

                    this.setState({
                        currentConvo: id,
                        currentMessages: [''],
                        currentDisplayName: displayName,
                    });

                    const newConvoLocation =
                        firebase.database().ref('users/' + this.props.router.getUserID() + '/conversations/' + id);

                    newConvoLocation.update({ messages: [''] });
                }
            }
        });
    }

    /**
     * Sends a new message, adding the message to both the sending and receiving users' conversations
     */
    handleMessageSend = (event) => {
        event.preventDefault();

        if (this.state.messageContent && this.state.currentConvo && this.state.currentConvo !== this.props.router.getUserID()) {

            const receiverLocation =
                firebase.database().ref('users/' + this.state.currentConvo + '/conversations/' + this.props.router.getUserID());

            const senderLocation =
                firebase.database().ref('users/' + this.props.router.getUserID() + '/conversations/' + this.state.currentConvo);

            var newMessageData = {
                author: this.props.router.getUserID(),
                body: this.state.messageContent
            };

            var newCurrentMessages = [];
            if (this.state.currentMessages[0] !== '') newCurrentMessages = this.state.currentMessages.concat(newMessageData);
            else newCurrentMessages[0] = newMessageData;

            this.setState({
                currentMessages: newCurrentMessages,
                messageContent: '',
            }, () => {
                receiverLocation.update({ messages: this.state.currentMessages });
                senderLocation.update({ messages: this.state.currentMessages });
            });
        }
    }

    handleTextChange = (event) => {
        this.setState({
            messageContent: event.target.value,
        })

        event.preventDefault();
    }

    componentDidMount() {
        const userRef = firebase.database().ref('users/' + this.props.router.getUserID());
        var userParse = '';

        userRef.on('value', (snapshot) => {
            userParse = snapshot.exportVal();
            if (userParse.conversations) {

                // var startConvo = this.props.user;
                // if (this.state.currentConvo) startConvo = this.state.currentConvo; 

                this.setState({
                    userConvos: userParse.conversations,
                }, () => {
                    this.setConvo(Object.keys(this.state.userConvos)[0], 'Convos loaded', 0);
                });
            }
            else if (this.props.user) {
                this.setState({
                    userConvos: [],
                }, () => this.setConvo(this.props.user, 'New convo', 0));
            }
        }, () => { userRef.off() });
    }

    render() {

        //REMOVE
        // const MESSAGE_TEST = [{ 'author': this.props.router.getUserID(), 'body': 'current user comment' },
        // { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'other user comment blah blah' }, { 'author': 'user', 'body': 'other user comment blah blah' },
        // { 'author': 'user', 'body': 'FINAL TEXT' },
        // ];

        return (
            <div className={isMobile ? 'conversations-mobile' : 'conversations'}>
                <Box className={isMobile ? 'convo-section-mobile' : 'convo-section'}>
                        <Slide in={true} direction="right">
                            <Box className={isMobile ? '' : 'convo-section-text'}>
                                {
                                    isMobile 
                                    ? <Box display='flex' flexDirection='row'>
                                        <div style={{position: 'absolute', left: '1%', alignSelf: 'center'}}>
                                            <MobileUserSelect 
                                                router={this.props.router}
                                                userList={
                                                    <Box display='flex' flexDirection='column' className={this.props.router.getStyles('defaultBar')}>
                                                        <ActiveConvoSection
                                                            router={this.props.router}
                                                            setActive={this.setConvo}
                                                            convos={Object.keys(this.state.userConvos)}
                                                            currentIndex={this.state.selectedIndex}
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </div>
                                        <div>{this.state.currentDisplayName}</div>
                                    </Box>
                                    : <div>
                                        <div style={{ fontWeight: 'bold' }}>
                                            Active Conversations
                                        </div>
                                        <ActiveConvoSection
                                            router={this.props.router}
                                            setActive={this.setConvo}
                                            convos={Object.keys(this.state.userConvos)}
                                            currentIndex={this.state.selectedIndex}
                                        />
                                    </div>
                                }
                            </Box>
                        </Slide>
                </Box>
                <Box className={isMobile ? 'user-convo-mobile' : 'user-convo'}>
                    <Box pb={5} style={{ overflowY: 'auto', height: isMobile ? '85%' : ''}}>
                        <MessageSection messageArray={this.state.currentMessages}
                            player={null}
                            router={this.props.router}
                        />
                    </Box>
                    <Box display='flex'
                        flexDirection='column'
                        justifyContent='center'
                        mt={isMobile ? 0 : '3%'}
                        className={isMobile ? 'textfield-mobile' : ''}
                    >
                        <form onSubmit={this.handleMessageSend}>
                            <Box display='flex' flexDirection='row' >
                                <TextField
                                    label="New Message"
                                    placeholder='. . .'
                                    size="small"
                                    variant='outlined'
                                    require={true}
                                    fullWidth
                                    value={this.state.messageContent}
                                    onChange={this.handleTextChange}
                                    style={{ marginRight: '2%', display: 'flex', flexDirection: 'row' }}
                                />
                                <Button endIcon={<Send />} size='large' type='submit' variant='outlined' className={this.props.router.getStyles('b_MainWindow')}>
                                    Send
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </div>
        );
    }
}