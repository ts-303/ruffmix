import { alpha } from "@material-ui/core";
import { amber, blue, blueGrey, green, red } from '@material-ui/core/colors';
import theme from './Theme';

const darkBlue = '#2f3847';
const blueGreyFade = alpha(blueGrey[500], 0.15);
const introBlueGreyFade = alpha(blueGrey[500], 0.45);
const mainWindowBackground = '#fff';

const styles = {

    b_AccentPrimary: {
        color: amber[500],
        borderColor: 'rgb(1,1,1,0)',
        '&:hover': {
            borderColor: amber[500],
        },
    },

    b_AccentSecondary: {
        color: blueGrey[300],
        borderColor: 'rgb(1,1,1,0)',
        '&:hover': {
            borderColor: blueGrey[300],
        }
    },

    b_Introduction: {
        color: '#e6eaff',
        borderColor: introBlueGreyFade,
        '&:hover': {
            borderColor: amber[500],
            color: amber[500],
            transition: theme.transitions.create(["color"], {
                duration: 500
            }),
        }
    },

    b_MainWindow: {
        color: darkBlue,
        borderColor: mainWindowBackground,
        backgroundColor: blueGrey[50],
        '&:hover': {
            borderColor: amber[500],
            color: amber[500],
            transition: theme.transitions.create(["color"], {
                duration: 500
            }),
        }
    },

    b_AccountCircle: {
        color: blueGrey[300],
        '&:hover': {
            backgroundColor: blueGreyFade,
        }
    },

    b_MenuIcon: {
        color: blueGrey[300],
        '&:hover': {
            backgroundColor: blueGreyFade,
        }
    },

    b_Success: {
        color: green[400],
        borderColor: green[400],
        '&:hover': {
            borderColor: green[200],
            backgroundColor: green[50],
        }
    },

    b_Error: {
        color: red[400],
        borderColor: red[400],
        '&:hover': {
            borderColor: red[200],
            backgroundColor: red[50],
        }
    },

    divider: {
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '10px',
        marginLeft: '10px',
        backgroundColor: blueGrey[300],
        '&.MuiDivider-vertical': {
            marginTop: 0,
            marginBottom: 0,
        }
    },

    headerMenu: {
        color: blueGrey[300],
        backgroundColor: darkBlue,
        marginTop: '14px',
        marginRight: '3px',
        '& .MuiMenuItem-root': {
            '&:hover': {
                backgroundColor: blueGreyFade,
            }
        }
    },

    settingsMenu: {
        color: '#e6eaff',
        '& .MuiButton-root': {
            color: blueGrey[300],
        },
       
    },

    formContent: {
        '& .MuiFormControl-root': {
            marginTop: '10px',
            marginBottom: '10px',
        },
    },

    primaryHighlight: {
        color: amber[500],
    },

    secondary: {
        color: blueGrey[300],
    },

    appBackground: {
        color: '#e6eaff'
    },

    blueGreyFade: {
        backgroundColor: introBlueGreyFade
    },

    defaultBar: {
        color: blueGrey[300],
        backgroundColor: darkBlue,
        '& .MuiMobileStepper-progress' : {
            width: '100%',
            marginLeft: '2%',
            marginRight: '2%'
        },
        '& .MuiStepLabel-label': {
            color: blueGrey[300],
        },
        '& .MuiStepLabel-active': {
            color: amber[600],
        }
    },

    mainBackground: {
        zIndex: 0,
        width: '60%',
        height: '70%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        borderColor: darkBlue,
    },

};

export default styles;