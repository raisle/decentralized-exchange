import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Tabs, Tab} from 'react-bootstrap'
import {
    loadBalances, depositEther, depositToken, withdrawEther, withdrawToken, subscribeToEvents
} from '../store/interactions'
import {
    exchangeSelector,
    tokenSelector,
    accountSelector,
    web3Selector,
    etherBalanceSelector,
    tokenBalanceSelector,
    exchangeEtherBalanceSelector,
    exchangeTokenBalanceSelector,
    balancesLoadingSelector,
    etherDepositAmountSelector,
    etherWithdrawAmountSelector,
    tokenDepositAmountSelector,
    tokenWithdrawAmountSelector,
} from '../store/selectors'
import {
    etherDepositAmountChanged,
    etherWithdrawAmountChanged,
    tokenDepositAmountChanged,
    tokenWithdrawAmountChanged,
} from '../store/actions'
import {formatUserBalance} from "../helpers";

const showForm = (props) => {
    const {
        dispatch,
        account,
        exchange,
        token,
        web3,
        etherBalance,
        tokenBalance,
        exchangeEtherBalance,
        exchangeTokenBalance,
        showForm,
        etherDepositAmount,
        tokenDepositAmount,
        etherWithdrawAmount,
        tokenWithdrawAmount
    } = props
    console.log("props", props)

    return (<Tabs defaultActiveKey="deposit" className="bg-dark text-white">

        <Tab eventKey="deposit" title="Deposit" className="bg-dark">
            <table className="table table-dark table-sm small">
                <thead>
                <tr>
                    <th>Token</th>
                    <th>Wallet</th>
                    <th>Exchange</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>ETH</td>
                    <td>{showForm ? formatUserBalance(etherBalance) : "..."}</td>
                    <td>{showForm ? formatUserBalance(exchangeEtherBalance) : "..."}</td>
                </tr>
                </tbody>
            </table>

            <form className="row" onSubmit={(event) => {
                event.preventDefault()
                depositEther(dispatch, exchange, web3, etherDepositAmount, account)
            }}>
                <div className="col-12 col-sm pr-sm-2">
                    <input
                        type="text"
                        placeholder="ETH Amount"
                        onChange={(e) => dispatch(etherDepositAmountChanged(e.target.value))}
                        className="form-control form-control-sm bg-dark text-white"
                        required/>
                </div>
                <div className="col-12 col-sm-auto pl-sm-0">
                    <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                </div>
            </form>

            <table className="table table-dark table-sm small">
                <tbody>
                <tr>
                    <td>RSL</td>
                    <td>{showForm ? formatUserBalance(tokenBalance) : "..."}</td>
                    <td>{showForm ? formatUserBalance(exchangeTokenBalance) : "..."}</td>
                </tr>
                </tbody>
            </table>

            <form className="row" onSubmit={(event) => {
                event.preventDefault()
                depositToken(dispatch, exchange, web3, token, tokenDepositAmount, account)
            }}>
                <div className="col-12 col-sm pr-sm-2">
                    <input
                        type="text"
                        placeholder="RSL Amount"
                        onChange={(e) => dispatch(tokenDepositAmountChanged(e.target.value))}
                        className="form-control form-control-sm bg-dark text-white"
                        required/>
                </div>
                <div className="col-12 col-sm-auto pl-sm-0">
                    <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                </div>
            </form>

        </Tab>

        <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">

            <table className="table table-dark table-sm small">
                <thead>
                <tr>
                    <th>Token</th>
                    <th>Wallet</th>
                    <th>Exchange</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>ETH</td>
                    <td>{showForm ? formatUserBalance(etherBalance) : "..."}</td>
                    <td>{showForm ? formatUserBalance(exchangeEtherBalance) : "..."}</td>
                </tr>
                </tbody>
            </table>

            <form className="row" onSubmit={(event) => {
                event.preventDefault()
                withdrawEther(dispatch, exchange, web3, etherWithdrawAmount, account)
            }}>
                <div className="col-12 col-sm pr-sm-2">
                    <input
                        type="text"
                        placeholder="ETH Amount"
                        onChange={(e) => dispatch(etherWithdrawAmountChanged(e.target.value))}
                        className="form-control form-control-sm bg-dark text-white"
                        required/>
                </div>
                <div className="col-12 col-sm-auto pl-sm-0">
                    <button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
                </div>
            </form>

            <table className="table table-dark table-sm small">
                <tbody>
                <tr>
                    <td>RSL</td>
                    <td>{showForm ? formatUserBalance(tokenBalance) : "..."}</td>
                    <td>{showForm ? formatUserBalance(exchangeTokenBalance) : "..."}</td>
                </tr>
                </tbody>
            </table>

            <form className="row" onSubmit={(event) => {
                event.preventDefault()
                withdrawToken(dispatch, exchange, web3, token, tokenWithdrawAmount, account)
            }}>
                <div className="col-12 col-sm pr-sm-2">
                    <input
                        type="text"
                        placeholder="RSL Amount"
                        onChange={(e) => dispatch(tokenWithdrawAmountChanged(e.target.value))}
                        className="form-control form-control-sm bg-dark text-white"
                        required/>
                </div>
                <div className="col-12 col-sm-auto pl-sm-0">
                    <button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
                </div>
            </form>

        </Tab>
    </Tabs>)
}

class Balance extends Component {
    componentWillMount() {
        this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const {dispatch, web3, exchange, token, account} = this.props
        await subscribeToEvents(exchange, dispatch, web3, token, account)
        await loadBalances(dispatch, web3, exchange, token, account)
    }

    render() {
        return (<div className="card bg-dark text-white">
            <div className="card-header">
                Balance
            </div>
            <div className="card-body">
                {showForm(this.props)}
            </div>
        </div>)
    }
}

function mapStateToProps(state) {
    const balancesLoading = balancesLoadingSelector(state) && accountSelector(state)
    const account = accountSelector(state)
    console.log("account:", account)
    console.log("Balance mapStateToProps showForm:", showForm)

    return {
        account: accountSelector(state),
        exchange: exchangeSelector(state),
        token: tokenSelector(state),
        web3: web3Selector(state),
        etherBalance: etherBalanceSelector(state),
        tokenBalance: tokenBalanceSelector(state),
        exchangeEtherBalance: exchangeEtherBalanceSelector(state),
        exchangeTokenBalance: exchangeTokenBalanceSelector(state),
        balancesLoading,
        showForm: !balancesLoading && account !== undefined,
        etherDepositAmount: etherDepositAmountSelector(state),
        etherWithdrawAmount: etherWithdrawAmountSelector(state),
        tokenDepositAmount: tokenDepositAmountSelector(state),
        tokenWithdrawAmount: tokenWithdrawAmountSelector(state),
    }
}

export default connect(mapStateToProps)(Balance)
