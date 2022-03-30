import { Button, CardHeader, CardMedia, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import { DoubleArrow } from "@material-ui/icons";
import React from "react";
import { ThreeBackground } from '../ThreeBackground.js';
import { Match } from "./Match";
import { NewAccount } from "./NewAccount";
import { HowItWorks } from './HowItWorks.js';
import { isMobile } from 'react-device-detect';

/**
 * The Introduction window is the default window to be loaded on Ruffmix, containing links to learn about the process, create a new account,
 * or start a matching session.
 */
export class Introduction extends React.Component {
    constructor(props) {
        super (props)
        this.state = {
            dialog: !this.props.router.getUserID()
        }
    }

    newAccount = () => {
        this.props.router.updateContent(<NewAccount router={this.props.router}/>);
    };
    
    startMatch = () => {
        this.props.router.updateContent(<Match router={this.props.router}/>);
    };

    howItWorks = () => {
        this.props.router.updateContent(<HowItWorks router={this.props.router}/>);
    }

    render() {
        return (
            <Box display='flex' flexDirection='column' justifyContent='space-between' height='100%' overflow='auto'>
                    <Dialog open={this.state.dialog}>
                        <DialogTitle>To Employers/Recruiters - Please Read</DialogTitle>
                        <DialogContent>
                            <div style={{textAlign: 'center', color: 'black'}}>
                                <b>Thank you for checking out my project!</b><br/>
                                If you want to save some time, click on the following link 
                                to watch a brief video summarizing the site's functions:<br/>
                                <Box m={1}><a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
                                    Demonstration on YouTube (~1min duration) 
                                </a><br/></Box>
                                A few notes:
                                <div style={{textAlign: 'left'}}>
                                    <ul>
                                        <li>
                                            Please be aware that as I am still learning, <b>I cannot yet guarantee data security at a professional level. </b>
                                            Be wary of what credentials are used if you create an account, and what information is shared.
                                        </li>
                                        <li>
                                            Ruffmix has some interactive functions that may not always be viewable when only one visitor is active. The linked
                                            video above shows all of the functions I think are most notable. 
                                        </li>
                                        <li>
                                            For now, Ruffmix will be live and updated frequently for demonstration purposes only, and will likely be taken 
                                            down if I find employment that requires most of my time.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div style={{textAlign: 'center'}}><br/>-Tyler</div>
                            <Box mt={2} display='flex' flexDirection='row' justifyContent='center'>
                                <Button variant='outlined' onClick={() => this.setState({ dialog: false })}
                                    className={this.props.router.getStyles('b_MainWindow')}
                                >
                                    Continue
                                </Button>
                            </Box>
                        </DialogContent>
                    </Dialog>
                
                    <div style={{position: 'absolute', top: '-3%'}}>{(!isMobile) ? <ThreeBackground/> : <div/>}</div>
                    <Box m='1%' height="20%" style={{position: 'absolute', top: 0, left: 0, right:0, zIndex:0, textAlign: (isMobile) ? 'center' : ''}}>
                        <CardHeader className={this.props.router.getStyles('appBackground')} titleTypographyProps={{variant: 'h3'}} title="Welcome"/>
                    </Box>

                    <Box mx='10%' display='flex' height="60%" flexDirection='column' alignItems='center' justifyContent='space-evenly'
                        style={{position: 'absolute', top: isMobile ? '10%' : '20%', bottom: isMobile ? '10%' : '20%', left: 0, right: 0, textAlign: 'center', zIndex:2}}>
                        <Box height='20%' >
                            
                        </Box>
                        <Box fontSize={(isMobile) ? 20 : 24} className={this.props.router.getStyles('primaryHighlight')} > 
                            Ruffmix is a tool for producers, musicians, and creators to share their works-in-progress and get feedback instantly.
                        </Box>
                        <Box height='20%' display='flex' flexDirection='column' zIndex={2}>
                            <Button variant= 'outlined' className={this.props.router.getStyles('b_Introduction')} onClick={() => this.startMatch()}>
                                Match Anonymously
                            </Button>
                            <Box mt={1}/>
                            <Button variant= 'outlined' className={this.props.router.getStyles('b_Introduction')} onClick={() => this.newAccount()}>
                                Create New Account
                            </Button>
                        </Box>
                    </Box> 

                    <Box height="20%" m='1%' display='flex' flexDirection='row-reverse' alignItems='flex-end' 
                    style={{position: 'absolute', bottom: 0, left: 0, right:0, zIndex: 2}}
                    >
                        <Button variant='outlined' endIcon={<DoubleArrow />} onClick={() => this.howItWorks()}
                        className={this.props.router.getStyles('b_MainWindow')}
                        >
                            How it works
                        </Button>
                    </Box>
                </Box>
        )
    }
}