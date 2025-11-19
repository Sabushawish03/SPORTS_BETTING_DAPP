const Betting = artifacts.require("Betting");

module.exports = async function (deployer) {
  await deployer.deploy(Betting);
};

