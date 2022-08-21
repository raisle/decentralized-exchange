import React, {Component} from 'react'
import {connect} from 'react-redux'
import {exchangeSelector} from '../store/selectors'
import {loadAllOrders, subscribeToEvents} from '../store/interactions'

class Content extends Component {
    componentWillMount() {
        this.loadBlockchainData(this.props)
    }

    async loadBlockchainData(props) {
        const {dispatch, exchange} = props
        await loadAllOrders(exchange, dispatch)
        await subscribeToEvents(exchange, dispatch)
    }

    render() {
        return (
            <div className="content">
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        exchange: exchangeSelector(state)
    }
}

export default connect(mapStateToProps)(Content)
