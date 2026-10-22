// PRACTICAL 7 MIGRATION SCRIPT (Exact snippet from syllabus)
const EtherTransfer = artifacts.require("EtherTransfer");

module.exports = async function(deployer, network, accounts) {
    // accounts[1] will be the recipient of Ether transfers
    const recipient = accounts[1];
    await deployer.deploy(EtherTransfer, recipient);
};
