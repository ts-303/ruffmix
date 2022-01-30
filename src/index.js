import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { MainWindowController } from './Components/Window/MainWindowController';
import './index.css';
import styles from './Styles';
import theme from './Theme';


class Title extends React.Component {
  render() {
    return(<body className="maintitle">ruffmix</body>);
  }
}


class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {

      };
      this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
    const { classes } = this.props;

        return (
            <div>
                <main className="main-panel">
                    <div>
                        <MainWindowController styleProviderClass={classes}/>
                    </div>
                </main>
            </div>
        )
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

const StyledApp = withStyles(styles)(App);

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <StyledApp />
    </ThemeProvider>,
    document.getElementById('root')
);