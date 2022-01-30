import { Box, Button, Divider, Fade, Slide, TextField } from "@material-ui/core";
import { AccountCircleOutlined } from "@material-ui/icons";
import React from "react";
import firebase from "../../firebase";
import CommentObject from "./CommentObject";
import './Conversations.css';
import PropTypes from 'prop-types';

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

    
        listConvos = namesList.map((val) => {
                        
            return (
                <div>
                    <Box display='flex' flexDirection='row' alignItems='center'>
                        <Button onClick={() => args.setActive(val[0])} style={{ justifyContent: 'left', minWidth: '100%' }}>
                            <AccountCircleOutlined/>{val[1]}
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
            messageContent: '',
            activeConvos: '',
        };

        this.setConvo = this.setConvo.bind(this);
    }

    /**
     * Loads the active conversations and allows the messages of a conversation to be loaded via ActiveConvoSection
     * @param {*} args Should contain a reference to the user whose active conversations will be loaded
     */
    setConvo = (args) => {

        var setCurrentConvo = '';

        this.setState({
            currentMessages: [],
        },() => {
            if (args !== this.props.router.getUserID()) {
                if (this.state.userConvos.length !== 0) {
                    var userIndex = 0;
    
                    const convos = Object.keys(this.state.userConvos);
    
                    for (const convo in convos) {
                        
                        if (args === convos[convo]) break;
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
                        currentConvo: args,
                        currentMessages: ['']
                    });
    
                    const newConvoLocation =
                        firebase.database().ref('users/' + this.props.router.getUserID() + '/conversations/' + args);
    
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
            },() => {
                        receiverLocation.update({messages: this.state.currentMessages});
                        senderLocation.update({messages: this.state.currentMessages});
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
                    this.setConvo(Object.keys(this.state.userConvos)[0]);
                });
            }
            else {
                this.setState({
                    userConvos: [],
                }, () => this.setConvo(this.props.user));
            }
        }, ()=>{userRef.off()});
    }

    render() {

        return (
            <div className="conversations">
                <Box className="convo-section">
                    <div>
                        <Slide in={true} direction="right">
                            <Box>
                                Active Conversations
                                <ActiveConvoSection router={this.props.router} setActive={this.setConvo} convos={Object.keys(this.state.userConvos)}/>
                            </Box>
                        </Slide>
                    </div>
                </Box>
                    <div className="user-convo">
                        <Box mr={'4%'}style={{overflowY: 'auto'}}>
                            <MessageSection messageArray={this.state.currentMessages} player={null} router={this.props.router} />
                        </Box>
                        <Box display='flex' flexDirection='row' justifyContent='flex-end' mt={'2%'} mr={'4%'}>
                            <form onSubmit={this.handleMessageSend}>
                                <Box display='flex' flexDirection='row' alignItems='flex-end'>
                                    <TextField
                                        label="New Message"
                                        placeholder='. . .'
                                        require={true}
                                        value={this.state.messageContent}
                                        onChange={this.handleTextChange}
                                        size='small'
                                        fullWidth
                                    />
                                    <Box><Button size='small' type='submit' variant='outlined' className={this.props.router.getStyles('b_MainWindow')}>Send</Button></Box>
                                </Box>
                            </form>
                        </Box>
                    </div>
            </div>
        );
    }
}