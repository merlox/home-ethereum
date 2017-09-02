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

})

function l(m) {
   console.log(m)
}
