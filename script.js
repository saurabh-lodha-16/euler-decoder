const provider = new ethers.JsonRpcProvider(`https://eth.llamarpc.com`);

const walletAddress = "0xb66cd966670d962c227b3eaba30a872dbfb995db";
// Function to decode input data as a UTF-8 string.
function decodeInputData(inputData) {
  try {
    return ethers.utils.toUtf8String(inputData);
  } catch (error) {
    console.error("Error decoding input data:", error);
    return null;
  }
}

// Function to process a transaction.
async function processTransaction(transaction) {
  if (transaction.to === walletAddress || transaction.from === walletAddress) {
    const inputData = transaction.input;
    const decodedData = decodeInputData(inputData);

    if (decodedData) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.innerText = `Sender: ${transaction.from}\nReceiver: ${transaction.to}\nMessage: ${decodedData}`;
      document.getElementById("messages").appendChild(messageElement);
    }
  }
}

async function monitorTransactions() {
  provider.on("block", async (blockNumber) => {
    try {
      const block = await provider.getBlock(blockNumber, true);
      document.getElementById("currentBlock").innerText = blockNumber;
      block.transactions.forEach(processTransaction);
    } catch (error) {
      console.error("Error fetching block data:", error);
    }
  });

  document.getElementById("walletAddress").innerText = walletAddress;
  console.log(`Monitoring transactions for wallet address: ${walletAddress}`);
}

monitorTransactions();
