export const handleWithdrawTokenError = (error) => {
    if (error.message.includes("Insufficient Balance")) {
        window.alert(`Hold your horses! 🤌 
You want to withdraw more RSL tokens than you have on RSL Token exchange.`)
    } else {
        window.alert(`There was an error withdrawing RSL Token`)
    }
}

export const handleWithdrawEtherError = (error) => {
    if (error.message.includes("Insufficient Balance")) {
        window.alert(`Hold your horses! 🤌 
You want to withdraw more Ether tokens than you have on RSL Token exchange.`)
    } else {
        window.alert(`There was an error withdrawing Ether`)
    }
}
export const handleDepositTokenError = (error) => {
    if (error.message.includes("Insufficient Balance")) {
        window.alert(`Hold your horses! 🤌 
You don't have enough RSL tokens in your wallet.`)
    } else {
        window.alert(`There was an error depositing RSL token`)
    }
}

export const handleDepositEtherError = (error) => {
    if (error.message.includes("Insufficient Balance")) {
        window.alert(`Hold your horses! 🤌 
You don't have enough Ether in your wallet.`)
    } else {
        window.alert(`There was an error depositing Ether`)
    }
}

export const handleMakeBuyError = (error) => {
    if (error.message.includes("Insufficient Ether")) {
        window.alert(`Hold your horses! 🤌 
You don't have enough Ether in your wallet.`)
    } else {
        window.alert(`There was an error making buy RSL order`)
    }
}

export const handleMakeSellError = (error) => {
    if (error.message.includes("Insufficient RSL")) {
        window.alert(`Hold your horses! 🤌 
You don't have enough RSL in your wallet.`)
    } else {
        window.alert(`There was an error making sell RSL order`)
    }
}

export const handleFillOrderError = (error) => {
    if (error.message.includes("Insufficient Deposited Ether")) {
        window.alert(`Hold your horses! 🤌 
To fill this order, first deposit some Ether to RSL Token exchange.`)
    } else if (error.message.includes("Insufficient Deposited RSL")) {
        window.alert(`Hold your horses! 🤌 
To fill this order, you need to have some RSL token on RSL Token exchange.`)
    } else {
        window.alert(`There was an error filling order`)
    }
}
