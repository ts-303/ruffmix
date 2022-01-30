import { Box, Button, CardHeader, Grow, TextField } from "@material-ui/core";
import React from "react";
import firebase from '../../firebase';
import { NewAccount } from "./NewAccount";

/**
 * The Login window handles the login of a registered user.
 */
export class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        })
        event.preventDefault();
    }

    handleLogin = (event) => {
        firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
            .then((userCredential) => {
                console.log('User login success');
            })
            .catch((error) => {
                alert('Login fail' + error);
            });

        event.preventDefault();
    }
    
    render() {
        return (
            <Grow in={true}>
                <Box display='flex' flexDirection='column' justifyContent='space-between' height='100%' textAlign='center'>
                        <CardHeader title="Login to Ruffmix"/>
                        <Box display='flex' flexDirection='column' className={this.props.router.getStyles('formContent')}>
                            <form onSubmit={this.handleLogin}>
                                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' >
                                    <TextField
                                        label="Email"
                                        name='username'
                                        placeholder='. . .'
                                        size='medium'
                                        type='email'
                                        value={this.state.username} 
                                        onChange={this.handleChange}
                                    />
                                    <TextField
                                        label="Password"
                                        name='password'
                                        placeholder='. . .'
                                        size='medium'
                                        type='password'
                                        value={this.state.password} 
                                        onChange={this.handleChange}
                                    />
                                    <Box mt={4}>
                                        <Button variant='outlined' className={this.props.router.getStyles('b_MainWindow')} type='submit'>Log In</Button>
                                    </Box>
                                </Box>
                            </form>
                        </Box>   
                        <Box display='flex' flexDirection='column' alignItems='center' pb={4}>
                            <Button 
                            variant='outlined' 
                            className={this.props.router.getStyles('b_MainWindow')}
                            onClick={() => this.props.router.updateContent(<NewAccount router={this.props.router}/>)}
                            >
                                Create New Account
                            </Button>
                        </Box>                     
                </Box>
            </Grow>
        );
    }
}