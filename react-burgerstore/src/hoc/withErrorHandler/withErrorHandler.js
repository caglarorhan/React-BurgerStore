import React, {Component} from "react";
import Modal from "../../components/UI/Modal/Modal";
import Aux from "../Auxillary/Auxillary";

const withErrorHandler = (WrappedComponent, axios_1)=>{
    return class extends Component {
        state = {
            error: null
        }
        componentDidMount () {
            axios_1.interceptors.request.use(this.setState({error:null}))
            axios_1.interceptors.response.use(response=>response,error=>{
                this.setState({error:error})
            });
        }

        errorConfirmedHandler = ()=>{
            this.setState({error:null})
        }

        render (){
                return (
                    <Aux>
                        <Modal
                            show={this.state.error}
                            modalClosed={this.errorConfirmedHandler}
                        >
                            {this.state.error? this.state.error.message: null}
                        </Modal>
                        <WrappedComponent {...this.props}/>
                    </Aux>
                )

        }
    }

}

export default withErrorHandler;
