pragma solidity  ^0.4.24;

import "./openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract PriceOracle is Ownable {
  // Price of ETH in USD * 10^18
  uint256 ethPrice;

  constructor(uint256 _ethPrice) {
    ethPrice = _ethPrice;
  }

  function getEthPrice() public view returns (uint256) {
    return ethPrice;
  }

  function setEthPrice(uint256 _ethPrice) public onlyOwner {
    ethPrice = _ethPrice;
  }
}
