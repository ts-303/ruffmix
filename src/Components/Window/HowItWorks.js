import { Button, Card, CardHeader, Collapse, Fade, Grow, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React from "react";
import { Match } from "./Match";
import { NewAccount } from "./NewAccount";
import { isMobile } from 'react-device-detect';
import { useState } from 'react';

function ProcessStepper(props) {

    return (
        <Stepper orientation="vertical" className={props.router.getStyles('appBackground')} style={{ backgroundColor: 'transparent'}}>
            <Step active={true}>
                <StepLabel
                >
                    <h2 className={props.router.getStyles('primaryHighlight')}>Upload Your Track</h2>
                </StepLabel>
                <StepContent>
                    Upload your music file and specify what you think are problem areas with the track, for example mixing or arrangement
                    <Box display='flex' justifyContent='center'>
                        <Card elevation={6} style={{width: '600px', backgroundColor: 'transparent', marginTop: '12px'}}>
                            <img src='step1.jpg'/>
                        </Card>
                    </Box>
                </StepContent>
            </Step>

            <Step active={true}>
                <StepLabel
                >
                    <h2 className={props.router.getStyles('primaryHighlight')}>Match and Review</h2>
                </StepLabel>
                <StepContent>
                    Match up with another user and review their uploaded track, providing specific feedback that you think will help with the
                    problems in their track
                    <Box display='flex' justifyContent='center'>
                        <Card elevation={6} style={{width: '290px', backgroundColor: 'transparent', marginTop: '12px'}}>
                            <img src='step2.jpg'/>
                        </Card>
                    </Box>
                </StepContent>
            </Step>

            <Step active={true}>
                <StepLabel
                >
                    <h2 className={props.router.getStyles('primaryHighlight')}>Get Your Feedback</h2>
                </StepLabel>
                <StepContent>
                    Get feedback on your track in return, then match again or create an account to allow users to see and comment on any tracks
                    you are having problems with 
                    <Box display='flex' justifyContent='center'>
                        <Card elevation={6} style={{backgroundColor: 'transparent', marginTop: '12px'}}>
                            <img src='step3.png'/>
                        </Card>
                    </Box>
                </StepContent>
            </Step>
        </Stepper>
    )
}

export class HowItWorks extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            yScrollPos: 0,
            maxScroll: 0,
        }
    }


    getScrollPos = () => {
        var element = document.getElementById("scrollContainer");
        this.setState({yScrollPos: element.scrollTop, maxScroll: element.scrollHeight - element.clientHeight});
    }

    newAccount = () => {
        this.props.router.updateContent(<NewAccount router={this.props.router}/>);
    };
    
    startMatch = () => {
        this.props.router.updateContent(<Match router={this.props.router}/>);
    };

    render() {

        var popUpBool = (this.state.maxScroll > 0 && this.state.yScrollPos === this.state.maxScroll);

        return (
            <Grow in={true}>
                <Box display='flex' flexDirection={isMobile ? 'column' : 'row'} justifyContent='space-between' height='100%'
                style={{backgroundColor: '#2f384770', overflow: 'auto'}}
                >

                    <Box m='1%' style={{ position: 'absolute', top: 0, left: 0, right: isMobile ? 0 : '30%', bottom: 0, zIndex: 0, backgroundColor: '#2f3847' }}
                    display='flex' flexDirection='column' justifyContent='flex-start'
                    >
                        <CardHeader className={this.props.router.getStyles('appBackground')} titleTypographyProps={{ variant: isMobile ? 'h5' : 'h3' }}
                            title="A Network for Creators" />
                        <Box id='scrollContainer' onScroll={this.getScrollPos} marginTop='-2%' style={{  overflow: 'auto'}}>
                            <ProcessStepper router={this.props.router}/>
                        </Box>
                    </Box>

                    {isMobile ? 
                        <Box  alignSelf='center' style={{position: 'absolute', top: '5%', zIndex: 2, width: '80%', 
                        pointerEvents: popUpBool ? 'auto' : 'none'}} 
                        >
                            <Grow in={(popUpBool) ? true : false}>
                                <Card elevation={6} className={this.props.router.getStyles('defaultBar')}>
                                    <Box p={2} display='flex' flexDirection='column'>
                                        <Box marginBottom='12px' textAlign='center' fontSize={18} className={this.props.router.getStyles('primaryHighlight')} >
                                            Upload your work-in-progress now and get help instantly, no account required.
                                        </Box>
                                        <Button variant='outlined' className={this.props.router.getStyles('b_Introduction')} onClick={() => this.startMatch()}>
                                            Match Anonymously
                                        </Button>
                                        <Box mt={1} />
                                        <Button variant='outlined' className={this.props.router.getStyles('b_Introduction')} onClick={() => this.newAccount()}>
                                            Create New Account
                                        </Button>
                                    </Box>
                                </Card>
                            </Grow>
                        </Box>
                        :
                        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-evenly' py={20}
                            style={{
                                position: 'absolute', top: 0, bottom: 0, left: isMobile ? 0 : '70%', right: 0,
                                textAlign: 'center', zIndex: 2
                            }}
                        >
                            <Box mx='5%' fontSize={(isMobile) ? 20 : 24} className={this.props.router.getStyles('primaryHighlight')} >
                                Upload your work-in-progress now and get help instantly, no account required.
                            </Box>
                            <Box display='flex' flexDirection='column' zIndex={2}>
                                <Button variant='outlined' className={this.props.router.getStyles('b_Introduction')} onClick={() => this.startMatch()}>
                                    Match Anonymously
                                </Button>
                                <Box mt={1} />
                                <Button variant='outlined' className={this.props.router.getStyles('b_Introduction')} onClick={() => this.newAccount()}>
                                    Create New Account
                                </Button>
                            </Box>
                        </Box>
                    }
                </Box>
            </Grow>
        )
    }

}