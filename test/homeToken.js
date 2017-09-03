const assert = require('assert')
const HomeToken = artifacts.require('HomeToken')
const Crowdsale = artifacts.require('Crowdsale')
let tokenInstance = {}
let crowdsaleInstance = {}

contract('HomeToken', accounts => {
   before(() => {
      crowdsaleInstance = web3.eth.contract(Crowdsale.abi).at(Crowdsale.address)
      tokenInstance = web3.eth.contract(HomeToken.abi).at(crowdsaleInstance.token())
   })

   it("Should set the constructor values correctly", cb => {
      const tokenName = 'Home'
      const tokenSymbol = 'HOM'
      const tokenDecimals = 18 // One token is like a wei 0.000000000000000001 token = 0.00000000000000001 ether
      const initialSupply = 10000000 // 10% of 20.000 ether

      assert.equal(tokenInstance.name(), tokenName)
      assert.equal(tokenInstance.symbol(), tokenSymbol)
      assert.equal(parseInt(tokenInstance.decimals()), tokenDecimals)
      assert.equal(parseInt(tokenInstance.balanceOf(web3.eth.accounts[0])), initialSupply)

      cb()
   })
})

contract('Crowdsale', accounts => {
   before(() => {
      crowdsaleInstance = web3.eth.contract(Crowdsale.abi).at(Crowdsale.address)
      tokenInstance = web3.eth.contract(HomeToken.abi).at(crowdsaleInstance.token())
   })

   it("Should set the constructor data correctly", () => {
      const endTime = 1509408000 // October 30 at 00:00:00 or 12:00 pm
      const rate = 5000 // 1 ether = 5000 tokens (in wei)
      const wallet = web3.eth.accounts[0] // The first account that created the crowdsale
      const minPurchase = web3.toWei(0.1, 'ether').toString() // 0.1 ether
      const maxPurchase = web3.toWei(1000, 'ether').toString() // 1000 ether

      // Don' check for the start time because it changes everytime
      assert.equal(parseInt(crowdsaleInstance.endTime()), parseInt(endTime), "End time isn't correct")
      assert.equal(parseInt(crowdsaleInstance.rate()), parseInt(rate), "Rate isn't correct")
      assert.equal(crowdsaleInstance.wallet(), web3.eth.accounts[0], "Wallet isn't correct")
      assert.equal(crowdsaleInstance.minPurchase().toString(), minPurchase, "Min purchase isn't correct")
      assert.equal(web3.toBigNumber(crowdsaleInstance.maxPurchase().toString()).equals(maxPurchase), true, "Max purchase isn't correct")
   })

   // TODO Fix this
   // it("Should buy tokens with the fallback function", cb => {
   //    web3.eth.getBalance(web3.eth.accounts[1], (err, balance) => {
   //       balance = web3.fromWei(balance.toString(), 'ether')
   //       console.log('balance BEFORE -->')
   //       console.log(balance)
   //
   //       web3.eth.sendTransaction({
   //          to: crowdsaleInstance.address,
   //          from: web3.eth.accounts[1],
   //          value: web3.toWei(1, 'ether')
   //       }, (err, result) => {
   //          console.log(result)
   //
   //          web3.eth.getBalance(web3.eth.accounts[1], (err, balance) => {
   //             balance = web3.fromWei(balance.toString(), 'ether')
   //
   //             console.log('balance AFTER -->')
   //             console.log(balance)
   //             cb()
   //          })
   //       })
   //    })
   // })

   it("Should buy tokens with the buyTokens function", cb => {
      const amountToBuy = web3.toWei(1, 'ether')
      const rate = 5000
      const expectedTokens = amountToBuy * rate
      let initialTokenBalance

      tokenInstance.balanceOf(web3.eth.accounts[0], (err, myBalance) => {
         initialTokenBalance = myBalance.toString()

         console.log('initialTokenBalance -->')
         console.log(initialTokenBalance)

         crowdsaleInstance.buyTokens(web3.eth.accounts[0], {
            from: web3.eth.accounts[0],
            value: web3.toWei(1, 'ether')
         }, (err, transaction) => {
            tokenInstance.balanceOf(web3.eth.accounts[0], (err, myBalance) => {
               console.log('finalTokenBalance -->')
               console.log(myBalance.toString())

               assert.equal(web3.fromWei(parseInt(myBalance), 'ether'), expectedTokens, 'The expected amount of tokens isn\'t equal')

               cb()
            })
         })
      })
   })

   it("Should check if the crowdsale has ended or not", cb => {
      crowdsaleInstance.hasEnded((err, hasEnded) => {
         assert.equal(hasEnded, false, 'It must be not ended until October 30 at 00:00:00 or 12:00 pm')

         cb()
      })
   })
})

function l(m) {
   console.log(m)
}
