import React, {Component} from 'react';
import './App.css';
import {connect} from 'react-redux'
import {
    loadWeb3,
    loadAccount,
    loadToken,
    loadExchange
} from '../store/interactions'
import {accountSelector, contractsLoadedSelector, web3Selector} from '../store/selectors'
import Navbar from "./Navbar";
import Content from "./Content";

class App extends Component {
    componentWillMount() {
        this.loadBlockchainData(this.props.dispatch)
    }

    async loadBlockchainData(dispatch) {
        const web3 = await loadWeb3(dispatch)
        const networkId = await web3.eth.net.getId()
        const token = await loadToken(web3, networkId, dispatch)
        const account = await loadAccount(web3, dispatch)
        const exchange = await loadExchange(web3, networkId, dispatch)
        if (!token) {
            window.alert('Token smart contract not deployed to the current network. Please select another network with Metamask.')
        }
        if (!exchange) {
            window.alert('Exchange smart contract  not deployed to the current network. Please select another network with Metamask.')
        }
        if (!account) {
            console.log('User is not connected to the site with Metamask')
        }
    }

    render() {
        return (
            <div>
                <Navbar/>
                {this.props.contractsLoaded ? <Content/> : <div className="content"></div>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        contractsLoaded: contractsLoadedSelector(state),
        account: accountSelector(state),
        web3: web3Selector(state)
    }
}

export default connect(mapStateToProps)(App);
