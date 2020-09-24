import React from "react";

import classes from "./Menu.module.css";

const menu = (props)=>(
    <div
        className={classes.Menu}
        onClick={props.clicked}>
        MENU
    </div>
);


export default menu;
