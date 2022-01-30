import { Button, CardHeader } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import { DoubleArrow } from "@material-ui/icons";
import React from "react";
import { ThreeBackground } from '../ThreeBackground.js';
import { Match } from "./Match";
import { NewAccount } from "./NewAccount";

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

    render() {
        return (
            <Grow in={true} timeout={2000}>
                <Box display='flex' flexDirection='column' justifyContent='space-between' height='100%'>
                    <ThreeBackground/>
                    <Box height="20%"><CardHeader titleTypographyProps={{variant: 'h3'}} title="Welcome"/></Box>
                    <Box mx='20%' display='flex' height="60%" flexDirection='column' justifyContent='space-evenly'
                        style={{fontSize: 20, textAlign: 'center'}}>
                        <Box position='fixed' width='40%' alignSelf='center' fontSize={24} > 
                            Ruffmix is a tool for producers, musicians, and creators to share their works-in-progress and get feedback instantly.
                        </Box>
                        <Box display='flex' flexDirection='column' mt={25} p={5}>
                            <Button variant= 'outlined' className={this.props.router.getStyles('b_Introduction')} onClick={() => this.startMatch()}>
                                Match Anonymously
                            </Button>
                            <Box mt={1}/>
                            <Button variant= 'outlined' className={this.props.router.getStyles('b_Introduction')} onClick={() => this.newAccount()}>
                                Create New Account
                            </Button>
                        </Box>
                    </Box> 

                    <Box height="20%" mb='1%' mr='1%' display='flex' flexDirection='row-reverse' alignItems='flex-end'>
                        <Button variant='outlined' endIcon={<DoubleArrow />} className={this.props.router.getStyles('b_MainWindow')}>
                            How it works
                        </Button>
                    </Box>
                </Box>
            </Grow>
        )
    }
}