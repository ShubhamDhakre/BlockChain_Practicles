const EtherTransfer = artifacts.require("EtherTransfer");

contract("EtherTransfer", (accounts) => {
    const sender = accounts[0];
    const recipient = accounts[1];

    it("should deploy with the correct default recipient", async () => {
        const instance = await EtherTransfer.deployed();
        const configuredRecipient = await instance.defaultRecipient();
        assert.equal(configuredRecipient, recipient, "Recipient was not set correctly");
    });

    it("should successfully transfer Ether from sender to recipient", async () => {
        const instance = await EtherTransfer.deployed();

        const transferAmount = web3.utils.toWei("1", "ether");
        const recipientInitialBalance = web3.utils.toBN(await web3.eth.getBalance(recipient));

        // Call transferToDefaultRecipient
        await instance.transferToDefaultRecipient({
            from: sender,
            value: transferAmount
        });

        const recipientFinalBalance = web3.utils.toBN(await web3.eth.getBalance(recipient));
        const difference = recipientFinalBalance.sub(recipientInitialBalance);

        assert.equal(difference.toString(), transferAmount.toString(), "Ether was not transferred successfully");
    });
});
