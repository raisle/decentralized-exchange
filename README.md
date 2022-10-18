# Decentralized exchange project 📈💸🏛️
## Description 
This DEX is using an order book model. 📘
The order book model is one of the earliest approaches in the development of DEXs. Order book maintain records of all the open orders for purchasing and selling assets for specific pairs of assets. 

The DEX is supporting currently one pair of assets *ETH-RSL*. 

This model requires two users for trade to be made.

User One is making an order (sell or buy), User Two is filling(completing) an order.

The DEX is taking 10% fee for each transaction. 

Fee is paid by the user that fills the order.

### List of smart contracts in the project
<code>main/src/contracts/</code>
* Exchange.sol - Smart contract of the DEX
* Token.sol - ETH-20 token "RSL"

The notable examples of order book DEXs active today include Loopring, Gnosis Protocol, and IDEX. 

## Purpose 💡
This project has purely educational purpose - I am learning Solidy.
I am an Android, not a web developer, so React part of this project is pretty basic, since my main focus was on Solidify smart contracts writing.

## Link to a deployed project 🔗
LINK
Smart contracts are deployed to Ropsten test network, you need to connect to Metamask, and choose Ropsten as a network.

## How to build project 🛠️
```
npm build
```
## Feedback ❤️
I'll be happy to recieve your feedback at override.256@gmail.com

