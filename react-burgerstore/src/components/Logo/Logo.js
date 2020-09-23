import React from "react";
import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';

const logo = (props)=>(
    <div className={classes.Logo}>
        <img src={burgerLogo} alt="Best Hamburger in the Town"/>
    </div>
);

export default logo;
