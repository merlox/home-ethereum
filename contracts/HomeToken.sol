pragma solidity ^0.4.15;

import './SafeMath.sol';
import './Ownable.sol';
import './ERC20.sol';

/// @title The token for the Home Ethereum's acommodation platform
/// @author Merunas Grincalaitis
contract HomeToken is ERC20, Ownable {
   using SafeMath for uint256;

   // Name of the token
   string public name;

   // Symbol of the token
   string public symbol;

   // The total amount of tokens
   uint256 public totalSupply;

   // The amount of decimals for that token
   uint8 public decimals;

   // To indicate if the minting is finished or not
   bool public mintingFinished = false;

   // The balance of each user
   mapping(address => uint) balances;

   // This mapping helps making transactions on behalf of someone so you can do
   // "I'll give you X if you allow me to take Y tokens"
   // addressToUseOnBehalf => (personAllowed => amountAllowed)
   mapping(address => mapping(address => uint256)) allowed;

   // Event to indicate transfers of tokens
   event Transfer(address indexed from, address indexed to, uint256 value);

   // Event to indicate approval from one person to another
   event Approval(address indexed owner, address indexed spender, uint256 value);

   // To indicate the amount of tokens an address got
   event Mint(address indexed to, uint256 amount);

   // To indicate that the mint is finished
   event MintFinished();

   /// @notice Used to check if the mint is finished or not
   modifier canMint() {
      require(!mintingFinished);
      _;
   }

   // Constructor
   function HomeToken(string _name, string _symbol, uint8 _decimals, uint _initialSupply, uint _totalSupply) {
      require(bytes(_name).length > 0);
      require(bytes(_symbol).length > 0);
      require(_decimals > 0);
      require(_initialSupply > 0);
      require(_totalSupply >= _initialSupply);

      name = _name;
      symbol = _symbol;
      decimals = _decimals;

      // The creator of the token gets the initial supply
      balances[msg.sender] = _initialSupply;
      totalSupply = _totalSupply;
   }

   /// @notice To transfer tokens to an address
   /// @param to The address to transfer the tokens
   /// @param value The amount of tokens to send
   /// @return bool If the transfer was successful or not
   function transfer(address to, uint256 value) returns(bool){
      require(to != address(0));

      // SafeMath.safeSubstract will throw if there's any problem substracting
      balances[msg.sender] = balances[msg.sender].safeSubstract(value);
      balances[to] = balances[to].safeSum(value);
      Transfer(msg.sender, to, value);
      return true;
   }

   /// @notice To transfer token on behalf of other user that you don't control.
   /// @param from The address that will be used to transfer the tokens, must be
   /// allowed to do so
   /// @param to The address that will receive the tokens
   /// @param value The amount of tokens to transfer
   /// @return bool If the transfer was successful or not
   function transferFrom(address from, address to, uint256 value) returns(bool){
      require(to != address(0));

      uint256 amountAllowed = allowed[from][msg.sender];

      balances[from] = balances[from].safeSubstract(value);
      balances[to] = balances[to].safeSum(value);

      // Update the allowance of this user. The safeSubstract will make sure that
      //  the amount of tokens allowed to use is >= the amount that you want to sent
      allowed[from][msg.sender] = amountAllowed.safeSubstract(value);
      Transfer(from, to, value);
      return true;
   }

   /// @notice Allows the passed address to spend the specified amount of tokens
   /// on behalf of from msg.sender
   /// @param spender The address that will be able to use the `value` of tokens
   /// @param value The amount of tokens that the spender is able to spend.
   /// @return bool If the transaction was successful or not.
   function approve(address spender, uint256 value) returns(bool) {

      // To change the approved amount you first have to reduce the addresses`
      // allowance to zero by calling `approve(spender, 0)` if it is not
      // already 0 to avoid double spending
      require(value == 0 || allowed[msg.sender][spender] == 0);

      allowed[msg.sender][spender] = value;
      Approval(msg.sender, spender, value);
      return true;
   }

   /// @notice To increase the amount allowed to use by `spender`. Recommended to
   /// use this function directly instead of setting the approve(spender, 0) and
   /// then approving the updating amount because this is faster. The owner of
   /// the tokens is the `msg.sender`
   /// @param spender The address of the person that will be able to use the tokens
   /// @param addedValue The amount of tokens to increase allowing for use
   /// @return bool If the function executed correctly or not
   function increaseApproval(address spender, uint256 addedValue) returns(bool) {
      allowed[msg.sender][spender] = allowed[msg.sender][spender].safeSum(addedValue);
      Approval(msg.sender, spender, allowed[msg.sender][spender]);
      return true;
   }

   /// @notice Decreases the amount of tokens allowed to use by `spender`
   /// @param spender The address that will be affected
   /// @param reducedValue The amount of tokens to reduce from the allowance
   /// @return bool If the function executed correctly or failed
   function decreaseApproval(address spender, uint256 reducedValue) returns(bool) {
      uint oldValue = allowed[msg.sender][spender];

      if(reducedValue > oldValue) {
         allowed[msg.sender][spender] = 0;
      } else {
         allowed[msg.sender][spender] = oldValue.safeSubstract(reducedValue);
      }

      Approval(msg.sender, spender, allowed[msg.sender][spender]);
      return true;
   }

   /// @notice To generate tokens (mint) for an address with an amount of tokens
   /// @param to The address that will get the tokens
   /// @param amount The amount of tokens to generate
   /// @return bool If the minting was successful or not
   function mint(address to, uint256 amount) onlyOwner canMint returns(bool) {
      totalSupply = totalSupply.safeSum(amount);
      balances[to] = balances[to].safeSum(amount);

      Mint(to, amount);
      Transfer(0x0, to, amount);
      return true;
   }

   /// @notice To stop the minting by the owner
   /// @return bool If the stop was successful
   function finishMinting() onlyOwner returns(bool) {
      mintingFinished = true;
      MintFinished();
      return true;
   }

   /// @notice To get the amount of tokens still allowed to use on behalf of `owner`
   /// @param owner The owner of the tokens that will be used for the allowance
   /// @param spender The person allowed to spend the tokens on behalf of the owner
   /// @return uint The amount remaining for the allowance
   function allowance(address owner, address spender) constant returns(uint256 remaining) {
      return allowed[owner][spender];
   }

   /// @notice Gets the balance of a specified account
   /// @param owner The address of the owner
   /// @return uint The amount of tokens available for that address
   function balanceOf(address owner) constant returns(uint256) {
      return balances[owner];
   }
}
