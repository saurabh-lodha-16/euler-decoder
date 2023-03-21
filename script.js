const provider = new ethers.JsonRpcProvider(`https://ethereum.publicnode.com`);

const walletAddress = "0xb66cd966670d962c227b3eaba30a872dbfb995db";
// Function to decode input data as a UTF-8 string.
function decodeTransactionData(inputData) {
  try {
    return ethers.toUtf8String(inputData);
  } catch (error) {
    console.error("Error decoding input data:", error);
    return null;
  }
}

// Function to process a transaction.
async function processTransaction(transactionHash) {
  const transaction = await provider.getTransaction(transactionHash);
  if (
    transaction.from.toLocaleLowerCase() ===
      walletAddress.toLocaleLowerCase() ||
    (transaction.to &&
      transaction.to.toLocaleLowerCase() === walletAddress.toLocaleLowerCase())
  ) {
    const decodedData = decodeTransactionData(transaction.data);

    if (decodedData) {
      const messageElement = document.createElement("div");
      messageElement.style.border = "1px solid";
      messageElement.classList.add("message");
      messageElement.innerText = `Sender: ${transaction.from}\nReceiver: ${transaction.to}\nBlock Number: ${transaction.blockNumber}\nTransaction Hash: ${transaction.hash}\nMessage:\n ${decodedData}\n`;
      document.getElementById("messages").prepend(messageElement);
    }
  }
}

async function monitorTransactions() {
  provider.on("block", async (blockNumber) => {
    try {
      const block = await provider.getBlock(blockNumber);
      const balance = await provider.getBalance(walletAddress);
      document.getElementById("currentBlock").innerText = blockNumber;
      document.getElementById("ethBalance").innerText = Number(
        String(balance) / 10 ** 18
      ).toFixed(6);
      block.transactions.forEach(processTransaction);
    } catch (error) {
      console.error("Error fetching block data:", error);
    }
  });

  document.getElementById("walletAddress").innerText = walletAddress;
  console.log(`Monitoring transactions for wallet address: ${walletAddress}`);
}

monitorTransactions();
