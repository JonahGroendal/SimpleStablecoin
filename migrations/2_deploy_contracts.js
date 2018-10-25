var SimpleStablecoin = artifacts.require("SimpleStablecoin");
var PriceOracle = artifacts.require("PriceOracle")

module.exports = function(deployer, network) {
  deployer.deploy(PriceOracle, web3.toWei(100)).then(function() {
    return deployer.deploy(SimpleStablecoin, PriceOracle.address, web3.toWei(0.1, 'ether'))
  })
};
