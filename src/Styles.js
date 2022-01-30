import { alpha } from "@material-ui/core";
import { amber, blueGrey } from '@material-ui/core/colors';

const darkBlue = '#2f3847';
const blueGreyFade = alpha(blueGrey[500], 0.15);
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
        color: darkBlue,
        borderColor: blueGrey[300],
        '&:hover': {
            borderColor: amber[500],
        }
    },

    b_MainWindow: {
        color: darkBlue,
        borderColor: mainWindowBackground,
        backgroundColor: blueGrey[50],
        '&:hover': {
            borderColor: amber[500],
            backgroundColor: blueGrey[50],
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

    formContent: {
        '& .MuiFormControl-root': {
            marginTop: '10px',
            marginBottom: '10px',
        },
    },

    secondary: {
        color: blueGrey[300],
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