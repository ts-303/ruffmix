import { Button, CardHeader, CardMedia } from '@material-ui/core';
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