var Charity_Organization = artifacts.require("Charitable_Organization");

module.exports = function(deployer) {
  deployer.deploy(Charity_Organization);
};