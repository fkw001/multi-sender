const Web3 = require("web3");
const contractABI = require("../contracts/multisender.json");
const fs = require("fs");

const contractAddress = "0xfebddaa3d4ff11a5c2b45a5a77890bdbdf774f0a";
const web3 = new Web3(
  "https://arb-mainnet.g.alchemy.com/v2/h4DJDOwG91VMSCM4IbFrMFAt6Wo57W_N"
); // Replace with your own Infura project ID
const contract = new web3.eth.Contract(contractABI, contractAddress);
const privateKey =
  "21fd187c322752ea2c6da5c6d7e8e2bd62d28de71af8186f6a77ec34838be3c0";
const senderAddress = "0xC935309eC48F5a6185370683c8022c660Ac19e38";

async function mintNFTs() {
  fs.readFile("accounts.txt", "utf8", async function (err, data) {
    const recipients = [];
    const amountsInEther = [];
    if (err) {
      return console.log(err);
    }
    // Split the data into lines
    const lines = data.trim().split("\n");
    // Iterate over the lines and insert the data into the database
    lines.forEach(function (line) {
      const [privateKey, address] = line.split(",");
      recipients.push(address);
      amountsInEther.push(0.0012);
    });

    const amountsInWei = amountsInEther.map((amount) =>
      web3.utils.toWei(amount.toString())
    ); // convert the amounts to wei
    const totalAmount =
      amountsInEther.reduce((acc, curr) => acc + curr, 0) + 0.0005;

    try {
      const contractMethod = contract.methods.sendToMany(
        recipients,
        amountsInWei
      );
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = await contractMethod.estimateGas({
        from: senderAddress,
        value: web3.utils.toWei(totalAmount.toString()),
      });
      const nonce = await web3.eth.getTransactionCount(senderAddress);

      const txData = contractMethod.encodeABI();
      const tx = {
        from: senderAddress,
        to: contractAddress,
        gasPrice,
        gas: gasLimit,
        nonce,
        value: web3.utils.toWei(totalAmount.toString()),
        data: txData,
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const txReceipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log(txReceipt);
    } catch (error) {
      console.log(error);
    }
  });
}

mintNFTs();
