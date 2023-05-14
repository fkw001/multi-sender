import { ethers } from "ethers";
import BatchSendERC20 from "../BatchSendERC20.json";
import { isInValidWalletList } from "./validator";
import { toast } from "react-toastify";
import web3 from "web3";

const contractAddress = process.env.CONTRACT;

const provider = new ethers.providers.Web3Provider(window.ethereum);

const isTransactionMined = async (transactionHash) => {
  const txReceipt = await provider.getTransactionReceipt(transactionHash);
  console.log("txReceipt", txReceipt);
  if (txReceipt && txReceipt.blockNumber) {
    return txReceipt;
  }
};

export const sendDefaultToken = async (arrAmount, arrWallet) => {
  // Nonce (optional)
  const nonce = null; // Use null for automatic nonce calculation
  const signer = provider.getSigner();
  const amountsInWei = arrAmount.map((amount) =>
    web3.utils.toWei(amount.toString())
  ); // convert the amounts to wei
  const gasPrice = ethers.utils.parseUnits("20", "gwei"); // Customize according to your needs
  const totalAmount = arrAmount.reduce((acc, curr) => acc + curr, 0) + 0.0005;
  const contract = new ethers.Contract(contractAddress, BatchSendERC20.abi, signer);
  const etherValue = ethers.utils.parseEther(totalAmount.toString());
  try {
    // Estimate the gas required for the transaction
    const estimatedGas = await contract.estimateGas.sendToMany(
      arrWallet,
      amountsInWei,
      {
        value: etherValue,
      }
    );

    const tx = await contract.sendToMany(arrWallet, amountsInWei, {
      value: etherValue,
      gasLimit: estimatedGas,
      gasPrice: gasPrice,
      nonce: nonce,
    });

    await isTransactionMined(tx.hash);
    return { address: await signer.getAddress(), hash: tx.hash };
  } catch (error) {
    console.error("Error:", error);
  }
};

// export const sendFlexibleToken = async (arrAmount, arrWallet, token) => {
//   // Nonce (optional)
//   console.log("token", token);
//   const nonce = null; // Use null for automatic nonce calculation
//   const signer = provider.getSigner();
//   const amountsInWei = arrAmount.map((amount) =>
//     web3.utils.toWei(amount.toString())
//   ); // convert the amounts to wei
//   const gasPrice = ethers.utils.parseUnits("20", "gwei"); // Customize according to your needs
//   const totalAmount = arrAmount.reduce((acc, curr) => acc + curr, 0) + 0.0005;
//   const contract = new ethers.Contract(contractAddress, BatchSendERC20.abi, signer);
//   try {
//     // Estimate the gas required for the transaction
//     const estimatedGas = await contract.estimateGas.sendTokenToMany(
//       token,
//       arrWallet,
//       amountsInWei
//     );

//     const tx = await contract.sendTokenToMany(token, arrWallet, amountsInWei, {
//       gasLimit: estimatedGas,
//       gasPrice: gasPrice,
//       nonce: nonce,
//     });

//     const data = await isTransactionMined(tx.hash);
//     console.log("data", data);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

export const senderMulti = async (arrLine) => {


console.log(contractAddress)
  const inValidData = isInValidWalletList(arrLine);
  if (inValidData) {
    toast.error("Invalid List wallet. Please check again.", {
      isLoading: false,
      closeOnClick: true,
      autoClose: 3000,
    });
    return { isValid: false, data: inValidData };
  }
  const arrWallet = [];
  const arrAmount = [];

  for (let index = 0; index < arrLine.length; index++) {
    const element = arrLine[index];
    const item = element.split(",");
    arrWallet.push(item[0]);
    arrAmount.push(Number(item[1].trim()));
  }
  const data = await sendDefaultToken(arrAmount, arrWallet);
  // Gas price (optional)
  return {
    isValid: true,
    data: {
      address: data.address,
      hash: data.hash,
      time: new Date().getTime(),
      arrLine: arrLine,
    },
  };
};

// const signedTx = await signer.signTransaction(tx);
// console.log('signedTx', signedTx)

// // Send the signed transaction
// const txResponse = await provider.sendTransaction(signedTx);

// console.log('txResponse', txResponse)

// console.log("Transaction sent:", txResponse.hash);
