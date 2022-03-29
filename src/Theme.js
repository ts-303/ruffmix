import { createTheme } from "@material-ui/core";
import { amber, blueGrey } from "@material-ui/core/colors";
import './index.css';
import { isMobile } from "react-device-detect";

const mainBackground = '#e6eaff';

const theme = createTheme({

    palette: {
        primary: {
            main: amber[600]
        },
        secondary: {
            main: '#2f3847'
        }
    },

    overrides: {
        MuiButton: {
            root: {
                textTransform: 'none',
                fontSize: 18,
                fontFamily: 'Quicksand-Regular',
            }
        },
        MuiMenuItem: {
            root: {
                textTransform: 'none',
                fontSize: 18,
                fontFamily: 'Quicksand-Light',
                justifyContent: 'flex-end',

            }
        },
        MuiTooltip: {
            arrow: {
                color: '#2f3847',
            },
            tooltip: {
                textAlign: 'center',
                color: blueGrey[300],
                backgroundColor: '#2f3847',
                fontSize: 18,
                fontFamily: 'Quicksand-Regular',
            }
        },
        MuiOutlinedInput: { // Name of the component ⚛️ / style sheet
            'root': { // Name of the rule
                color: isMobile ? blueGrey[300] : mainBackground,
                "& fieldset": { // increase the specificity for the pseudo class
                    borderColor: isMobile ? blueGrey[300] : mainBackground,
                   
                },
                "&:hover:not($disabled):not($focused):not($error) $notchedOutline": { // increase the specificity for the pseudo class
                    borderColor: amber[300],
                },
                
            },
            underline: {
                '&:before': {
                    borderBottomColor: isMobile ? blueGrey[300] : mainBackground,
                },
                '&:after': {
                    borderBottomColor: isMobile ? blueGrey[300] : mainBackground,
                }
            }
        },
        MuiInput: {
            'root': {
                color: '#e6eaff',
                "& fieldset": { // increase the specificity for the pseudo class
                    borderColor: mainBackground,
                },
            },
            underline: {
                '&:before': {
                    borderBottomColor: mainBackground,
                },
                '&:hover:not($disabled):not($error):not($focused):before': {
                    borderBottomColor: mainBackground,
                }
            }
        },
        MuiInputLabel: {
            'root': { // Name of the rule
                color: blueGrey[300],
            }
        },
        MuiCheckbox: {
            'root': {
                '& .MuiIconButton-label': {
                    color: blueGrey[300],
                },
                '&$checked': {
                    '& .MuiIconButton-label': {
                        color: amber[500],
                    }
                }
                
            },
            checked: {},
        },
        MuiFormControlLabel: {
            'root': {
                color: blueGrey[300],
            }
        }
    },

});

export default theme;