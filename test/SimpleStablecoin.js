var SimpleStablecoin = artifacts.require("./SimpleStablecoin.sol")
var PriceOracle = artifacts.require("./PriceOracle.sol")

contract('SimpleStablecoin', (accounts) => {
  // Test buy()
  it("should let me buy 100 stablecoins for 1 ETH", async () => {
    let instance = await SimpleStablecoin.deployed();
    let result = await instance.buy({
      value: web3.toWei(1),
      from: accounts[0]
    })

    console.log("      gas: buy(): " + result.receipt.gasUsed)

    let mySscBalance = await instance.balanceOf(accounts[0])
    let contractEthBalance = web3.eth.getBalance(instance.address)

    assert.equal(mySscBalance.toNumber(), web3.toWei(100))
    assert.equal(contractEthBalance.toNumber(), web3.toWei(1))
  })

  it("should let me sell 50 stablecoins for .45 ETH", async () => {
    let instance = await SimpleStablecoin.deployed();
    let result = await instance.sell(web3.toWei(50), {from: accounts[0]})

    console.log("      gas: sell(): " + result.receipt.gasUsed)

    let contractEthBalance = web3.eth.getBalance(instance.address)
    let mySscBalance = await instance.balanceOf(accounts[0])
    let totalSscSupply = await instance.totalSupply()

    assert.equal(contractEthBalance.toNumber(), web3.toWei(.55))
    assert.equal(mySscBalance.toNumber(), web3.toWei(50))
    assert.equal(totalSscSupply.toNumber(), web3.toWei(50))
  })

  it("should let me sell 50 stablecoins for liquidation value", async () => {
    // Simulate 50% drop in ETH value - system is now undercollateralized
    let oracleInstance = await PriceOracle.deployed()
    let priceChangeResult = await oracleInstance.setEthPrice(50000000000000000000)

    let instance = await SimpleStablecoin.deployed();
    let result = await instance.sell(web3.toWei(50), {from: accounts[0]})

    console.log("      gas: sell(): " + result.receipt.gasUsed)

    let contractEthBalance = web3.eth.getBalance(instance.address)
    let mySscBalance = await instance.balanceOf(accounts[0])
    let totalSscSupply = await instance.totalSupply()

    assert.equal(contractEthBalance.toNumber(), 0)
    assert.equal(mySscBalance.toNumber(), 0)
    assert.equal(totalSscSupply.toNumber(), 0)
  })
})
