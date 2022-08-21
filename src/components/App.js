import React, {Component} from 'react';
import './App.css';
import {connect} from 'react-redux'
import {
    loadWeb3,
    loadAccount,
    loadToken,
    loadExchange
} from '../store/interactions'
import {accountSelector, contractsLoadedSelector} from '../store/selectors'

class App extends Component {
    componentWillMount() {
        this.loadBlockchainData(this.props.dispatch)
    }

    async loadBlockchainData(dispatch) {
        const web3 = await loadWeb3(dispatch)
        const networkId = await web3.eth.net.getId()
        const token = await loadToken(web3, networkId, dispatch)
        loadAccount(web3, dispatch)
        if (!token) {
            window.alert('Token smart contract not deployed to the current network. Please select another network with Metamask.')
            return
        }
        const exchange = await loadExchange(web3, networkId, dispatch)
        if (!exchange) {
            window.alert('Exchange smart contract  not deployed to the current network. Please select another network with Metamask.')
            return
        }
    }

    render() {
        console.log("exchange props", this.props.account)
        return (
            <div>
                <h1>Hello world</h1>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        contractsLoaded: contractsLoadedSelector(state)
    }
}

export default connect(mapStateToProps)(App);
