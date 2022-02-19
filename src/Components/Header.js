import { Button, Divider, IconButton, Link } from "@material-ui/core";
import { AccountCircle, Headset } from "@material-ui/icons";
import { Group } from "@material-ui/icons";
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
import { isBrowser, isMobile } from "react-device-detect";

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
            <div>
                <div className='mobile-header-title' style={{display: isMobile ? 'true' : 'none'}}>ruffmix</div>
                <body className="header-bar" style={{padding: isMobile ? 0 : 10}}>
                    <div style={{display: isMobile ? 'none' : 'true'}} className="header-left" >
                        <Button variant='outlined' className={this.props.router.getStyles('b_AccentPrimary')} onClick={() => this.startMatch()}>match now</Button>
                        <Divider className={this.props.router.getStyles('divider')} orientation='vertical'/>
                        <Button startIcon={<PublishIcon/>} variant='outlined' className={this.props.router.getStyles('b_AccentSecondary')}  onClick={() => this.uploadTrack()}>upload</Button>
                        <Divider className={this.props.router.getStyles('divider')} orientation='vertical'/>
                        <Button variant='outlined' className={this.props.router.getStyles('b_AccentSecondary')}  onClick={() => this.browseUsers()}>browse users</Button>
                    </div>
                    <div style={{display: isMobile ? 'true' : 'none'}} className="mobile-header-left" >
                        <Button className={this.props.router.getStyles('b_AccentPrimary')} onClick={() => this.startMatch()}>
                            <Headset/>
                        </Button>
                        <Button className={this.props.router.getStyles('b_AccentSecondary')} onClick={() => this.uploadTrack()}>
                            <PublishIcon/>
                        </Button>
                        <Button className={this.props.router.getStyles('b_AccentSecondary')}  onClick={() => this.browseUsers()}>
                            <Group/>
                        </Button>
                    </div>
                    <div style={{display: isMobile ? 'none' : 'true'}}>
                        <Link color="#inherit" component="button" className="header-center" onClick={() => this.introduction()}>ruffmix</Link>
                    </div>
                    <div className="header-right">
                        <HeaderMenu router={this.props.router} header={this} />
                        <div hidden={(this.props.router.getUserID() === '' && !isMobile) ? false : true}>
                            <Button className={this.props.router.getStyles('b_AccentSecondary')} variant='outlined' onClick={() => this.login()}>login</Button>
                        </div>
                        <div hidden={(this.props.router.getUserID() === '') ? true : false}>
                            <IconButton className={this.props.router.getStyles('b_AccountCircle')} onClick={() => this.accountView()}>
                                <AccountCircle />
                            </IconButton>
                        </div>
                    </div>
                </body>
            </div>
        );
    }
}
