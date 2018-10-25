var PriceOracle = artifacts.require("./PriceOracle.sol");

contract('PriceOracle', (accounts) => {
  // Test getPrice()
  it("should get the price", async () => {
    let instance = await PriceOracle.deployed();
    let ethPrice = await instance.getEthPrice()

    assert.equal(ethPrice.toNumber(), 100000000000000000000)
  })
})
