import { Backdrop, Card, CircularProgress, Grid, Grow } from '@material-ui/core';
import React from 'react';
import firebase from '../../firebase';
import { Header } from '../Header';
import { AccountView } from './AccountView';
import { Introduction } from './Introduction';
import './MainWindowController.css';
import { AccountSettings } from './AccountSettings';
import { Conversations } from './Conversations';
import { isMobile } from 'react-device-detect';

/**
 * The MainWindowController is responsible for "routing" all content shown in the main window of Ruffmix.
 * This component should be passed to all other root components that will be shown in the main window in order to route content and provide 
 * information about the currently logged in user.
 * 
 * @example <AccountView user={user.uid} router={this} /> //Will pass this component as the router
 * //Then in AccountView, to get the current user ID:
 * this.props.router.getUserID();
 * //A window component should also use MainWindowController to load new content to the router:
 * this.props.router.updateContent(<Match router={this.props.router}/>);
 */
export class MainWindowController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            content: <Introduction router={this} />,
            prevContent: "",
            nextContent: "",
            // userState: false,
            userID: '',
            userDisplayName: '',
            refresh: false,
            isLoading: false,
            loadingMessage: 'Loading...',
            styleProvider: this.props.styleProviderClass,
            headerBar: <Header router={this}/>,
        };

        this.controllerRef = React.createRef();

        this.updateContent = this.updateContent.bind(this);
        this.goToPrevious = this.goToPrevious.bind(this);
        // this.updateUserState = this.updateUserState.bind(this);
        this.getUserState = this.getUserState.bind(this);
    }

    /**
     * Used to get the dimensions of the window
     * @returns The main window dimensions
     */
    getDimensions() {
        if (this.controllerRef.current) return this.controllerRef.current.offsetWidth;
        else return 0;
    }

    /**
     * Returns a style object to be used with a component
     * @param {Object} props The style definition found in Styles.js to be used with a component
     * @returns A style definition from Styles.js
     * @example <Button className={this.props.router.getStyles('b_MainWindow')} 
     */
    getStyles(props) {
        return this.state.styleProvider[props];
    }

    // updateUserState = () => { 
    //     this.setState({
    //         userState: true,
    //     })
    // }

    getUserState() {
        return this.state.userState;
    }

    /**
     * Controls the loading backdrop for the main window
     * @param {boolean} val The loading boolean
     * @param {string} message Omittable message to be displayed during loading
     * @example
     * this.props.router.setLoadingState(false) //The loading backdrop can be used when file transfers or loading is done
     */
    setLoadingState(val, message) {
        this.setState({
            isLoading: val,
            loadingMessage: message ? message : '',
        })
    }

    setUser(userObj) {
        this.setState({
            userID: userObj.uid,
            userDisplayName: userObj.displayname,
        }, () => this.refreshWindow())
    }

    /**
     * @returns The current user's ID created from a firebase key
     */
    getUserID() {
        return this.state.userID;
    }

    /**
     * @returns The current user's display name
     */
    getDisplayName() {
        return this.state.userDisplayName;
    }

    getUserEmail() {
        return this.state.userEmail;
    }

    refreshWindow(){
        this.setState({
            refresh: !this.state.refresh,
            headerBar: <Header router={this}/>
        })
    }

    /**
     * Signs out the current user
     */
    signOut() {
        firebase.auth().signOut().then(() => {
            console.log('Signout success');
            window.location.reload();
        }).catch((error) => {
            console.log('Signout fail: ' + error);
        });
    }

    /**
     * Will automatically load the currently logged in user's AccountView window, otherwise loads the Introduction window
     */
    componentDidMount() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user && !user.isAnonymous) {
                if (user) {

                    firebase.database().ref('users/' + user.uid + '/displayname').once('value').then((data) => {
                        this.setState({
                            userID: user.uid,
                            userEmail: user.email,
                            userDisplayName: data.val(),
                            content: <AccountView user={user.uid} router={this} />,
                        }, () => this.refreshWindow());
                    });

                }
            } 
            if (!user) {
                console.log('User logout or no user signed in');
                this.setState({
                    content: <Introduction router={this} />,
                }, () => this.refreshWindow());
            }

        }.bind(this));
        
    }
    
    /**
     * Changes the MainWindowController's content
     * @param {Object} props The content to be used in the update
     * @example
     * //A window component should use MainWindowController to load new content to the router:
     * this.props.router.updateContent(<Match router={this.props.router}/>);
     */
    updateContent(props) {
            this.setState({
                content: null
            },()=> {
                this.setState({
                    content: props,
                })
            })

    }

    goToPrevious() {
        this.setState({
            content: this.state.prevContent
        })
    }

    render() {
        const classes = this.props.className;

        return (
            <div>
                <Backdrop style={{zIndex: '10'}} open={this.state.isLoading}>
                    <Card 
                    style={{width: isMobile ? '50%' : '30%', height: isMobile ? '30%' : '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'space-evenly', textAlign: 'center'}}>
                        <CircularProgress/>
                        <div style={{marginLeft: '5%', marginRight: '5%'}}>{this.state.loadingMessage}</div>
                    </Card>
                </Backdrop>
                
                {this.state.headerBar}
                <Grow in={true} timeout={2000} >
                    {
                        (!isMobile) ? 
                        <Card elevation={3} className="main-window-card">
                            <img style={{zIndex: -2, position:'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src='backgroundtest.jpg'/>
                            {this.state.content}
                        </Card> :
                        <Grid 
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        style={{backgroundColor: 'white', position: 'fixed', top: '58px', bottom: '0'}}
                        zIndex='0'
                        >
                            <img style={{zIndex: -2, position:'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src='backgroundtest.jpg'/>
                            <Grid item >{this.state.content}</Grid>
                        </Grid>
                    }
                </Grow>
            </div>
        );
    }
}