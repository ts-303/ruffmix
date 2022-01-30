import { Button, Divider, IconButton, Link } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import PublishIcon from '@material-ui/icons/Publish';
import React from "react";
import './Header.css';
import HeaderMenu from './HeaderMenu';
import { AccountSettings } from "./Window/AccountSettings";
import { AccountView } from "./Window/AccountView";
import { BrowseUsers } from "./Window/BrowseUsers";
import { Introduction } from "./Window/Introduction";
import { Login } from './Window/Login';
import { Match } from './Window/Match';
import { UploadTrack } from "./Window/UploadTrack";
import PropTypes from 'prop-types';

/**
 * The Header Component is the basic header bar for navigation.
 */
export class Header extends React.Component {
    static propTypes = {
        /**
         * The router component to be used, use MainWindowController for most cases
         */
        router: PropTypes.elementType
    }

    /**
     * Loads the Match window to begin a matching session
     */
    startMatch() {
        this.props.router.updateContent(<Match router={this.props.router}/>);
    }

    /**
     * Loads the Introduction window 
     */
    introduction() {
        this.props.router.updateContent(<Introduction router={this.props.router}/>);
    }

    /**
     * Loads the Login window
     */
    login() {
        this.props.router.updateContent(<Login router={this.props.router}/>);
    }

    /**
     * Loads the AccountView Window
     */
    accountView() {
        this.props.router.updateContent(<AccountView router={this.props.router} user={this.props.router.getUserID()}/>);
    }

    /**
     * Loads the AccountSettings Window
     */
    accountSettings() {
        this.props.router.updateContent(<AccountSettings router={this.props.router} user={this.props.router.getUserID()}/>);
    }

    /**
     * Loads the UploadTrack window
     */
    uploadTrack() {
        if (this.props.router.getUserID()) this.props.router.updateContent(<UploadTrack router={this.props.router}/>);
        else this.login();
    }

    /**
     * Loads the BrowseUsers window
     */
    browseUsers() {
        this.props.router.updateContent(<BrowseUsers router={this.props.router}/>);
    }

    render() {
        
        return(
            <body className="header-bar">
                <div className="header-left" >
                    <Button variant='outlined' className={this.props.router.getStyles('b_AccentPrimary')} onClick={() => this.startMatch()}>match now</Button>
                    <Divider className={this.props.router.getStyles('divider')} orientation='vertical'/>
                    <Button startIcon={<PublishIcon/>} variant='outlined' className={this.props.router.getStyles('b_AccentSecondary')}  onClick={() => this.uploadTrack()}>upload</Button>
                    <Divider className={this.props.router.getStyles('divider')} orientation='vertical'/>
                    <Button variant='outlined' className={this.props.router.getStyles('b_AccentSecondary')}  onClick={() => this.browseUsers()}>browse users</Button>
                </div>
                <Link color="#inherit" component="button" className="header-center" onClick={() => this.introduction()}>ruffmix</Link>
                <div className="header-right">
                    <HeaderMenu router={this.props.router} header={this} />
                    <div hidden={(this.props.router.getUserID() === '') ? false : true}>
                        <Button className={this.props.router.getStyles('b_AccentSecondary')} variant='outlined' onClick={() => this.login()}>login</Button>
                    </div>
                    <div hidden={(this.props.router.getUserID() === '') ? true : false}>
                        <IconButton className={this.props.router.getStyles('b_AccountCircle')} onClick={() => this.accountView()}>
                            <AccountCircle />
                        </IconButton>
                    </div>
                </div>
            </body>
        );
    }
}
