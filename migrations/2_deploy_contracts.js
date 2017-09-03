const HomeToken = artifacts.require('./HomeToken.sol')
const Crowdsale = artifacts.require('./Crowdsale.sol')

// "1504440827", "1509408000", 5000, "0x08f96d0f5C9086d7f6b59F9310532BdDCcF536e2", "100000000000000000", "1000000000000000000000", "0xb46b9f08b42270ce130cf17a17d82ce229b61a68"

// Testnet 0xb46b9f08b42270ce130cf17a17d82ce229b61a68
// Homestead 0x7461ccf1fd55c069ce13e07d163c65c78c8b48d1

module.exports = function(deployer, network) {
   if(network != 'live'){
      const startTime = Math.floor((new Date().getTime() + 1000000) / 1000)
      const endTime = 1509408000 // October 30 at 00:00:00 or 12:00 pm
      const rate = 5000 // 1 ether = 5000 tokens (in wei)
      const wallet = web3.eth.accounts[0] // The first account that created the crowdsale
      const minPurchase = web3.toWei(0.1, 'ether') // 0.1 ether
      const maxPurchase = web3.toWei(1000, 'ether') // 1000 ether
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
         return deployer.deploy(
            Crowdsale,
            startTime,
            endTime,
            rate,
            wallet,
            minPurchase,
            maxPurchase,
            tokenInstance.address
         )
      })
   }
}
