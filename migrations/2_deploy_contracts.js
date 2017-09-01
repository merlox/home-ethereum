const HomeToken = artifacts.require('./HomeToken.sol')
const Crowdsale = artifacts.require('./Crowdsale.sol')

module.exports = function(deployer, network) {
   if(network != 'live'){
      const startTime = 1506729600 // September 29 at 00:00:00 or 12:00 pm
      const endTime = 1509408000 // October 30 at 00:00:00 or 12:00 pm
      const rate = 5000 // 1 ether = 5000 tokens (in wei)
      const wallet = web3.eth.accounts[0] // The first account that created the crowdsale
      const minPurchase = 100000000000000000 // 0.1 ether
      const maxPurchase = 1000000000000000000000 // 1000 ether
      const tokenName = 'Home'
      const tokenSymbol = 'HOM'
      const tokenDecimals = 18 // One token is like a wei 0.000000000000000001 token = 0.00000000000000001 ether
      const initialSupply = 10000000 // 10% of 20.000 ether

      // Deploy the token
      deployer.then(() => {
         return HomeToken.new(
            tokenName,
            tokenSymbol,
            tokenDecimals,
            initialSupply
         )
      }).then(tokenInstance => {

         console.log('Token address -->')
         console.log(tokenInstance.address)

         // Deploy the crowdsale
         return Crowdsale.new(
            startTime,
            endTime,
            rate,
            wallet,
            minPurchase,
            maxPurchase,
            tokenInstance.address
         )
      }).then(crowdsaleInstance => {
         console.log('Crowdsale address -->')
         console.log(crowdsaleInstance.address)
      })
   }
}
