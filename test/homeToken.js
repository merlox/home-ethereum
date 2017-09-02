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
      const minPurchase = web3.toWei(0.1, 'ether') // 0.1 ether
      const maxPurchase = web3.toWei(1000, 'ether') // 1000 ether

      // Don' check for the start time because it changes everytime
      assert.equal(parseInt(crowdsaleInstance.endTime()), parseInt(endTime), "End time isn't correct")
      assert.equal(parseInt(crowdsaleInstance.rate()), parseInt(rate), "Rate isn't correct")
      assert.equal(crowdsaleInstance.wallet(), web3.eth.accounts[0], "Wallet isn't correct")
      assert.equal(parseInt(crowdsaleInstance.minPurchase()), parseInt(minPurchase), "Min purchase isn't correct")
      assert.equal(parseInt(crowdsaleInstance.maxPurchase()), parseInt(maxPurchase), "Max purchase isn't correct")
   })

   it("Should buy tokens with the fallback function", cb => {
      web3.eth.getBalance(web3.eth.accounts[0], (err, balance) => {
         balance = web3.fromWei(balance.toString(), 'ether')
         console.log('balance -->')
         console.log(balance)

         crowdsaleInstance.sendTransaction({
            from: web3.eth.accounts[0],
            value: web3.toWei(1, 'ether')
         }, (err, result) => {
            console.log(err)
            console.log(result)

            web3.eth.getBalance(web3.eth.accounts[0], (err, balance) => {
               balance = web3.fromWei(balance.toString(), 'ether')

               console.log('balance -->')
               console.log(balance)
               cb()
            })
         })
      })
   })
   it("Should buy tokens with the buyTokens function", cb => {
      const amountToBuy = web3.toWei(1, 'ether')
      const rate = 5000
      const expectedTokens = amountToBuy * rate

      crowdsaleInstance.buyTokens(web3.eth.accounts[0], (err, transaction) => {
         tokenInstance.balanceOf(web3.eth.accounts[0], (err, myBalance) => {
            assert.equal(web3.fromWei(parseInt(myBalance), 'ether'), expectedTokens, 'The expected amount of tokens isn\'t equal')

            cb()
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
