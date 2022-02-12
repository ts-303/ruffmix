import { Avatar, Button, Card, CardActionArea } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import firebase from "firebase";
import React from "react";
import { AccountView } from "./AccountView";
import '../../index.css'
import theme from '../../Theme';

/**
 * A Card component that displays basic information about a user which can be clicked to open their corresponding AccountView.
 * 
 */
export default class UserCard extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            avatarURL: '',
            raised: false,
        }
    }

    /**
     * Will reference Firebase to display the user's avatar image.
     */
    componentDidMount() {
        const avatarLocation = firebase.storage().ref().child('images/' + this.props.user);

        if (avatarLocation) avatarLocation.getDownloadURL().then((url) => {
            this.setState({
                avatarURL: url
            });
        }).catch((error) => {
            console.log('Avatar image fetch error: ' + error);
        })
    }

    render() {
        return (
            <Box
                display='flex'
                flexDirection='row'
                alignItems='center' m={4}
                onClick={() => this.props.router.updateContent(<AccountView router={this.props.router} user={this.props.user} />)}
            >
                <Card 
                onMouseOver={() => this.setState({raised: true})}
                onMouseLeave={() => this.setState({raised: false})}
                elevation={this.state.raised ? '8' : '4'}
                >
                    <CardActionArea>
                    <Box display='flex' flexDirection='row' alignItems='center' p={2}>
                        <Avatar style={{width: '96px', height: '96px', }} src={this.state.avatarURL}/>

                        <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='flex-start'
                        m={2}
                        >
                            <div style={{ fontSize: '24px', fontFamily: 'Quicksand-Regular' }}>
                                {this.props.displayName}
                            </div>
                            <div style={{ fontSize: '18px', fontFamily: 'Quicksand-Regular' }}>
                                {this.props.roles}
                            </div>
                            <div style={{ fontSize: '18px', fontFamily: 'Quicksand-Regular' }}>
                                {this.props.location}
                            </div>
                        </Box>
                    </Box>
                </CardActionArea>
                </Card>
            </Box>
        )
    }
}