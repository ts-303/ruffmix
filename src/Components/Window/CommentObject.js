import { Box, Chip, IconButton, Paper } from '@material-ui/core';
import { AccountCircleOutlined } from '@material-ui/icons';
import React from 'react';
import firebase from "../../firebase";
import { AccountView } from "./AccountView";
import PropTypes from 'prop-types';

/**
 * The CommentObject component is used to represent either a user's comment on a public track or a message in the Conversations window.
 */
class CommentObject extends React.Component {
    static propTypes = {
        /**
         * The router component to be used, use MainWindowController for most cases
         */
        router: PropTypes.elementType,
        /**
         * The userID which is used to display information about the author
         */
        userID: PropTypes.string,
        /**
         * The comment or message
         */
        comment: PropTypes.string,
        /**
         * The WaveForm component associated with this comment
         */
        player: PropTypes.elementType
    }

    constructor(props) {
        super(props)

        this.state = ({
            comment: this.props.comment,
            userDisplayName: '',
            playerObject: this.props.player,
        });
    }

    /**
     * Will determine the CommentObject's associated user display name
     */
    componentDidMount() {
        const userRef = firebase.database().ref('users/' + this.props.userID);
        var userParse = '';

        userRef.once('value', (snapshot) => {
            userParse = snapshot.val();
            this.setState({
                userDisplayName: (userParse.displayname) ? userParse.displayname : 'Anonymous',
            });
            
        });
    }

    /** 
     * @returns The representation of a parsed comment, including text and timestamps
     */
    parsedComment() {
        const commentString = this.state.comment.split(new RegExp('(\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d\\s|\\d\\:\\d\\d\\-\\d\\:\\d\\d\\s)'));

        const timeRegex = new RegExp('^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d\\s|^\\d\\:\\d\\d\\-\\d\\:\\d\\d\\s'
                                        + '| \\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d|\\d\\:\\d\\d\\-\\d\\:\\d\\d '
                                        + '|\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|\\d\\:\\d\\d\\-\\d\\:\\d\\d$'
                                        + '|^\\d\\d\\:\\d\\d\\-\\d\\d\\:\\d\\d$|^\\d\\:\\d\\d\\-\\d\\:\\d\\d$', 'g');

        const contents = commentString.map((token) => 
            {
                if (token) return (token.match(timeRegex)) 
                ?   <div>
                        <Chip 
                            size="small" 
                            label={token} 
                            clickable
                            variant='outlined'
                            onClick={() => { this.state.playerObject.playFrom(token) }}
                            style={{backgroundColor: 'hsla(200, 50%, 70%, 0.4)', borderColor: 'hsla(200, 50%, 70%, 0.4)'}}
                        />
                    </div> 
                :   <div>{token}</div>
            });

        return contents;
    }

    render() {
        return (
                <Paper 
                display='flex' 
                flexDirection='column'
                alignItems='flex-start'
                flexWrap='wrap'
                minWidth='96px'
                elevation={0}
                style={{backgroundColor: 'lightgrey', margin:'4px', padding:'6px'}}
                borderRadius={4}
                >
                    <Box className='user' display='flex' flexDirection='row' alignItems='center'>
                        <IconButton size='small' onClick={() => this.props.router.updateContent(<AccountView router={this.props.router} user={this.props.userID}/>)}>
                            <AccountCircleOutlined />{this.state.userDisplayName}
                        </IconButton>
                    </Box>
                    <div className='comment'>{this.parsedComment()}</div>
                </Paper>
        );
    }
}

export default CommentObject;