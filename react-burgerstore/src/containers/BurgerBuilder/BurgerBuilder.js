import React, {Component} from "react";
import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios_1 from "../../axios-orders";
import axios from "axios";
import Spinner from '../../components/UI/Spinner/Spinner';


const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component{

    state={
        ingredients :null,
        totalPrice: 4,
        purchasable:false,
        purchasing:false,
        basePrice: 4,
        loading:false
    }

    componentDidMount() {
        axios.get('https://burgerstore-675c2.firebaseio.com/ingredients.json')
            .then(response=>{
                this.setState({ingredients:response.data})
            })
    }

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients)
            .map(igKey=>{return ingredients[igKey]})
            .reduce((sum,elm)=>{
                return sum+elm
            },0);
        this.setState({purchasable: sum>0})
    }

    addIngredientHandler = (type)=>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1 ;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = (priceAddition + oldPrice);
        this.setState({ingredients: updatedIngredients, totalPrice:newPrice});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type)=>{
        const oldCount = this.state.ingredients[type];
        if(oldCount<=0){return}
        const updatedCount = oldCount - 1 ;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = (oldPrice - priceDeduction);
        this.setState({ingredients: updatedIngredients, totalPrice:newPrice});
        this.updatePurchaseState(updatedIngredients);
    }
    removeAllIngredientsHandler = ()=>{
        const confirmingRemoval = window.confirm('Are you sure to remove all ingredients you added?');
        if(confirmingRemoval){
            const currentIngredients = {...this.state.ingredients};
            let updatedIngredients = {};
            Object.keys(currentIngredients).forEach(key => {updatedIngredients[key]=0; return true})
            this.setState({ingredients:updatedIngredients, totalPrice:this.state.basePrice});
            this.updatePurchaseState(updatedIngredients);
        }

    }

    purchaseHandler = ()=>{
        this.setState({purchasing:true})
}

    purchaseCancelHandler = ()=>{
        this.setState({purchasing:false})
    }

    purchaseContinueHandler = ()=>{
        const order = {
            ingredients : this.state.ingredients,
            price: this.state.totalPrice,
            customer:{
                name: 'Caglar',
                address: {
                            street: 'Test Street',
                            zipCode:'65464654',
                            country:'USA'
                },
                email:'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        this.setState({loading:true});
        axios_1.post('/orders.json', order)
            .then(response=> {
                this.setState({loading:false, purchasing: false})
            })
            .catch(error=>{
                this.setState({loading:false, purchasing: false})
            })

    }



    render() {
        const disabledInfos = {
            ...this.state.ingredients
        }

        for(let key in disabledInfos){
            disabledInfos[key] = disabledInfos[key]<=0
        }

    let orderStatus = null


        let burger= <Spinner/>

        if(this.state.ingredients){
            orderStatus = <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancelled ={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}
            />;
            burger= (<Aux>
              <Burger ingredients={this.state.ingredients}/>
              <BuildControls
                  ingredientAdded={this.addIngredientHandler}
                  ingredientRemoved = {this.removeIngredientHandler}
                  disabled= {disabledInfos}
                  purchasable = {this.state.purchasable}
                  price={this.state.totalPrice}
                  ordered={this.purchaseHandler}
                  clearIngredients={this.removeAllIngredientsHandler}
              />
          </Aux>)
        }
        if(this.state.loading){
            orderStatus = <Spinner />
        }

        return(
            <Aux>
                <Modal
                    show={this.state.purchasing}
                    modelClosed={this.purchaseCancelHandler}
                >
                    {orderStatus}
                </Modal>
                {burger}
            </Aux>
        )
    }
}


export default withErrorHandler(BurgerBuilder, axios_1);
