import { AppBar, Button, makeStyles, Toolbar, Typography } from "@material-ui/core"
import React from 'react';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({

    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export const AppBarComponent = () => {
    const classes = useStyles();
    return (<div className={classes.root}>
        <AppBar position="static">
            <Toolbar>

                <Typography variant="h6" className={classes.title}>
                    Decentralized Agriculture Insurance Application
                </Typography>
                <Button color="inherit"><Link to="/">New Policy </Link></Button> 
                <Button ><Link style={{color: 'white !important'}} to="/view-policies">View Policies </Link></Button> 
                
            </Toolbar>
        </AppBar>
    </div>)
}