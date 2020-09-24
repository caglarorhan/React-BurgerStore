import React, {Component} from "react";
import Aux from '../../hoc/Auxillary'
import classes from './Layout.module.css'
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";


class Layout extends Component {
    state = {
        showSideDrawer: false
    }
    sideDrawerSwitch = ()=>{
        this.setState({showSideDrawer: !this.state.showSideDrawer})
    }
    render(){
        return (
            <Aux>
                <Toolbar menuClicked={()=>{this.sideDrawerSwitch()}}/>
                <SideDrawer
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerSwitch}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }

};

export default Layout;
