import React, {Component} from 'react'
import {connect} from 'react-redux'
import {accountSelector, web3Selector} from '../store/selectors'
import {connectToMetamask} from "../store/interactions";

class Navbar extends Component {
    render() {
        return (<nav className="navbar navbar-expand-xl navbar-dark bg-primary">
            <a className="navbar-brand" href="#/">RSL Token Exchange</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="navbar-nav ml-auto">
                {this.props.account != null ?
                    <li className="nav-item ">
                        <a
                            className="nav-link small"
                            href={`https://etherscan.io/address/${this.props.account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {this.props.account}
                        </a>
                    </li> : <button onClick={(e) => connectToMetamask(this.props.dispatch)}
                                    className="btn btn-warning my-2 my-sm-0">Connect</button>}
            </ul>

        </nav>)
    }
}

function mapStateToProps(state) {
    return {
        account: accountSelector(state),
        web3: web3Selector(state)
    }
}

export default connect(mapStateToProps)(Navbar)
