import { createTheme } from "@material-ui/core";
import { amber, blueGrey } from "@material-ui/core/colors";
import './index.css';

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
    },

});

export default theme;