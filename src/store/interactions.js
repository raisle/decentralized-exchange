import Web3 from 'web3'
import {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded,
    orderCancelling,
    orderCancelled,
    orderFilling,
    orderFilled,
    etherBalanceLoaded,
    tokenBalanceLoaded,
    exchangeEtherBalanceLoaded,
    exchangeTokenBalanceLoaded,
    balancesLoaded,
    balancesLoading,
    buyOrderMaking,
    sellOrderMaking,
    orderMade
} from './actions'
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import {ETHER_ADDRESS} from '../helpers'
import {
    handleDepositEtherError,
    handleDepositTokenError,
    handleFillOrderError,
    handleMakeBuyError,
    handleMakeSellError,
    handleWithdrawEtherError,
    handleWithdrawTokenError
} from "../errorHandler";

window.onload = function () {
    if (window.ethereum !== 'undefined') {
        this.ethereum.on("accountsChanged", handleAccountsChanged)
    } else {
        showAlertInstallMetaMask()
    }
}

const handleAccountsChanged = (a) => {
    window.location.reload();
}

export const loadWeb3 = async (dispatch) => {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum)
        dispatch(web3Loaded(web3))
        return web3
    } else {
        showAlertInstallMetaMask()
    }
}

export const loadAccount = async (web3, dispatch) => {
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    if (typeof account !== 'undefined') {
        dispatch(web3AccountLoaded(account))
        dispatch(balancesLoaded())
        return account
    } else {
        logUserIsNotLoggedItWithMetaMask()
        return null
    }
}

export const connectToMetamask = async (dispatch) => {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        const account = await accounts[0]
        if (typeof account !== 'undefined') {
            dispatch(web3AccountLoaded(account))
            dispatch(balancesLoaded())
            return account
        } else {
            showAlertLogInWithMetaMask()
        }
    } else {
        showAlertInstallMetaMask()
    }
}

export const loadToken = async (web3, networkId, dispatch) => {
    try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
        dispatch(tokenLoaded(token))
        return token
    } catch (error) {
        console.log('Contract not deployed to the current network. Please select another network with Metamask.')
        return null
    }
}

export const loadExchange = async (web3, networkId, dispatch) => {
    try {
        const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
        dispatch(exchangeLoaded(exchange))
        return exchange
    } catch (error) {
        console.log('Contract not deployed to the current network. Please select another network with Metamask.')
        return null
    }
}

export const loadAllOrders = async (exchange, dispatch) => {
    // Fetch cancelled orders with the "Cancel" event stream
    const cancelStream = await exchange.getPastEvents('Cancel', {fromBlock: 0, toBlock: 'latest'})
    // Format cancelled orders
    const cancelledOrders = cancelStream.map((event) => event.returnValues)
    // Add cancelled orders to the redux store
    dispatch(cancelledOrdersLoaded(cancelledOrders))

    // Fetch filled orders with the "Trade" event stream
    const tradeStream = await exchange.getPastEvents('Trade', {fromBlock: 0, toBlock: 'latest'})
    // Format filled orders
    const filledOrders = tradeStream.map((event) => event.returnValues)
    // Add cancelled orders to the redux store
    dispatch(filledOrdersLoaded(filledOrders))

    // Load order stream
    const orderStream = await exchange.getPastEvents('Order', {fromBlock: 0, toBlock: 'latest'})
    // Format order stream
    const allOrders = orderStream.map((event) => event.returnValues)
    // Add open orders to the redux store
    dispatch(allOrdersLoaded(allOrders))
}

export const subscribeToEvents = async (exchange, dispatch, web3, token, account) => {
    exchange.events.Cancel({}, (error, event) => {
        dispatch(orderCancelled(event.returnValues))
    })

    exchange.events.Trade({}, (error, event) => {
        console.log("subscribeToEvents Trade")
        dispatch(orderFilled(event.returnValues))
        window.location.reload();
    })

    exchange.events.Deposit({}, async (error, event) => {
        console.log("subscribeToEvents Deposit")
        window.location.reload();
    })

    exchange.events.Withdraw({}, async (error, event) => {
        console.log("subscribeToEvents Withdraw")
        window.location.reload();
    })

    exchange.events.Order({}, (error, event) => {
        dispatch(orderMade(event.returnValues))
        window.location.reload();

    })
}

export const cancelOrder = (dispatch, exchange, order, account) => {
    exchange.methods.cancelOrder(order.id).send({from: account})
        .on('transactionHash', (hash) => {
            dispatch(orderCancelling())
        })
        .on('error', (error) => {
            console.log("Error during canceling order: ", error)
            window.alert('There was an error during canceling order!')
        })
}

export const fillOrder = (dispatch, exchange, order, account) => {
    if (account !== undefined) {
        console.log("account: ", account)

        exchange.methods.fillOrder(order.id).send({from: account})
            .on('transactionHash', (hash) => {
                dispatch(orderFilling())
            })
            .on('error', (error) => {
                handleFillOrderError(error)
            })
    } else {
        showAlertLogInWithMetaMask()
    }
}

export const loadBalances = async (dispatch, web3, exchange, token, account) => {
    if (typeof account !== 'undefined') {
// Ether balance in wallet
        const etherBalance = await web3.eth.getBalance(account)
        dispatch(etherBalanceLoaded(etherBalance))

// Token balance in wallet
        const tokenBalance = await token.methods.balanceOf(account).call()
        dispatch(tokenBalanceLoaded(tokenBalance))

// Ether balance in exchange
        const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
        dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance))

// Token balance in exchange
        const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call()
        dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))

// Trigger all balances loaded
        dispatch(balancesLoaded())
    } else {
        logUserIsNotLoggedItWithMetaMask()
    }
}

export const depositEther = (dispatch, exchange, web3, amount, account) => {
    if (account !== undefined) {
        exchange.methods.depositEther().send({from: account, value: web3.utils.toWei(amount, 'ether')})
            .on('transactionHash', (hash) => {
                dispatch(balancesLoading())
            })
            .on('error', (error) => {
                handleDepositEtherError(error)
            })
    } else {
        showAlertLogInWithMetaMask()
    }
}

export const withdrawEther = (dispatch, exchange, web3, amount, account) => {
    if (account !== undefined) {
        exchange.methods.withdrawEther(web3.utils.toWei(amount, 'ether')).send({from: account})
            .on('transactionHash', (hash) => {
                dispatch(balancesLoading())
            })
            .on('error', (error) => {
                handleWithdrawEtherError(error)
            })
    } else {
        showAlertLogInWithMetaMask()
    }
}

export const depositToken = (dispatch, exchange, web3, token, amount, account) => {
    if (account !== undefined) {
        amount = web3.utils.toWei(amount, 'ether')

        token.methods.approve(exchange.options.address, amount).send({from: account})
            .on('transactionHash', (hash) => {
                exchange.methods.depositToken(token.options.address, amount).send({from: account})
                    .on('transactionHash', (hash) => {
                        dispatch(balancesLoading())
                    })
                    .on('error', (error) => {
                        handleDepositTokenError(error)
                    })
                    .on('Transfer', (from, to, value) => {
                        console.log("Transfer event value: ", value)
                    })
            })
    } else {
        showAlertLogInWithMetaMask()
    }
}

export const withdrawToken = (dispatch, exchange, web3, token, amount, account) => {
    if (account !== undefined) {
        exchange.methods.withdrawToken(token.options.address, web3.utils.toWei(amount, 'ether')).send({from: account})
            .on('error', function (error) {
                handleWithdrawTokenError(error)
            })
    } else {
        showAlertLogInWithMetaMask()
    }
}

export const makeBuyOrder = (dispatch, exchange, token, web3, order, account) => {
    if (account !== undefined) {
        const tokenGet = token.options.address
        const amountGet = web3.utils.toWei(order.amount, 'ether')
        const tokenGive = ETHER_ADDRESS
        const amountGive = web3.utils.toWei((order.amount * order.price).toString(), 'ether')

        exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({from: account})
            .on('transactionHash', (hash) => {
                dispatch(buyOrderMaking())
            })
            .on('error', (error) => {
                handleMakeBuyError(error)
            })
    } else {
        showAlertLogInWithMetaMask()
    }
}

export const makeSellOrder = (dispatch, exchange, token, web3, order, account) => {
    if (account !== undefined) {
        const tokenGet = ETHER_ADDRESS
        const amountGet = web3.utils.toWei((order.amount * order.price).toString(), 'ether')
        const tokenGive = token.options.address
        const amountGive = web3.utils.toWei(order.amount, 'ether')

        exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({from: account})
            .on('transactionHash', (hash) => {
                dispatch(sellOrderMaking())
            })
            .on('error', (error) => {
                handleMakeSellError(error)
            })
    } else {
        showAlertLogInWithMetaMask()
    }
}

const showAlertLogInWithMetaMask = () => {
    window.alert('Hold your horses! 🤌 You need to be logged in with MetaMask first')
}

const logUserIsNotLoggedItWithMetaMask = () => {
    console.log('User is not logged in with MetaMask')
}

const showAlertInstallMetaMask = () => {
    window.alert('Please install MetaMask')
    window.location.assign("https://metamask.io/")
}
