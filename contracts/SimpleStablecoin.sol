pragma solidity  ^0.4.24;

import "./PriceOracle.sol";
import "./openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";
import "./openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SimpleStablecoin is Ownable, ERC20, ERC20Pausable {
  uint constant WEI_PER_COIN = 1000000000000000000;

  PriceOracle private po;
  uint256 private spreadInStableWeiPerCoin;

  constructor(address priceOracleAddr, uint256 _spreadInStableWeiPerCoin) public {
    po = PriceOracle(priceOracleAddr);
    spreadInStableWeiPerCoin = _spreadInStableWeiPerCoin;
  }

  event Buy(address buyer, uint256 amount);
  event Sell(address seller, uint256 amount);
  event SetspreadInStableWeiPerCoin(uint256 spreadInStableWeiPerCoin);

  event Print(uint message);
  event Print(bool message);

  function buy() public payable {
    uint256 stableWeiPerEth = po.getEthPrice();
    // Prevent integer overflow
    require(msg.value < uint256(-1)/stableWeiPerEth);
    _mint(msg.sender, (msg.value * stableWeiPerEth)/WEI_PER_COIN);
    emit Buy(msg.sender, (msg.value * stableWeiPerEth)/WEI_PER_COIN);
  }

  function sell(uint256 amount) public {
    _burn(msg.sender, amount);
    uint256 oldTotalSupply = totalSupply() + amount;
    uint256 amountMinusFee = amount - ((amount * spreadInStableWeiPerCoin)/WEI_PER_COIN);
    uint256 stableWeiPerEth = po.getEthPrice();
    // if system is overcollateralized (as it should be)
    if ( address(this).balance >= (oldTotalSupply * WEI_PER_COIN) / stableWeiPerEth )
      msg.sender.transfer((amountMinusFee * WEI_PER_COIN) / stableWeiPerEth); // redeem full value
    else
      msg.sender.transfer( (((amount * WEI_PER_COIN) / oldTotalSupply) * address(this).balance) / WEI_PER_COIN ); // redeem liquidation value
    emit Sell(msg.sender, amount);
  }

  function setspreadInStableWeiPerCoin(uint256 _spreadInStableWeiPerCoin) public onlyOwner {
    spreadInStableWeiPerCoin = _spreadInStableWeiPerCoin;
    emit SetspreadInStableWeiPerCoin(_spreadInStableWeiPerCoin);
  }
}
