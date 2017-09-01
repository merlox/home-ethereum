
// Create a seed on hd wallet mnemonics (12 word passphrase)
const bip39 = require('bip39')

// Generate addresses from seeds
const hdkey = require('ethereumjs-wallet/hdkey')

// Framework to wrangle all transactions to be signed
const ProviderEngine = require('web3-provider-engine')

// Part of the engine that will do wallet signing
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js')

// Part of the engine that will handle other tasks
const Web3Subprovider = require('web3-provider-engine/subproviders/web3.js')

// Classic web3
const Web3 = require('web3')
const mnemonic = 'adapt father buffalo tooth clock legend venue review cheap alcohol mushroom famous'

// Hd wallet that has all the accounts inside
const hdWallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))

// The walletHdPath + number is the array order of the wallet
const walletHdPath = "m/44'/60'/0'/0/"
const wallet = hdWallet.derivePath(walletHdPath + '0').getWallet()
const address = '0x' + wallet.getAddress().toString('hex')

// TODO Continue this to use the INFURA public ethereum nodes

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "1337" // Match any network id
    }
  }
}
