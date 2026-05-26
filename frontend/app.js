const CONTRACT_ADDRESS = "0x0b3289844a3616DA62be47c006d5C12Fc2445229";

const SEPOLIA_CHAIN_ID = "0xaa36a7";

const ETHERSCAN_BASE = "https://sepolia.etherscan.io";

const CONTRACT_ABI = [

    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },

    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "donor", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "name": "DonationReceived",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "name": "FundsWithdrawn",
        "type": "event"
    },

    {
        "inputs": [],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalDonations",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "donorCount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "donations",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_donor", "type": "address" }],
        "name": "getDonorAmount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDonors",
        "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider = null;
let signer = null;
let contract = null;
let userAddress = null;
let ownerAddress = null;
let isConnected = false;
let isCorrectNetwork = false;

let elBtnConnect, elWalletDot, elWalletLabel;
let elNetworkWarning;
let elStatBalance, elStatDonors, elStatTotal;
let elMyDonationAmount;
let elDonateInput, elBtnDonate;
let elTxStatus, elTxSpinner, elTxMsg, elTxHashLink;
let elOwnerPanel, elOwnerBalanceInfo, elBtnWithdraw;
let elDonorList;
let elContractLink;

window.addEventListener("DOMContentLoaded", () => {

    elBtnConnect = document.getElementById("btn-connect");
    elWalletDot = document.getElementById("wallet-dot");
    elWalletLabel = document.getElementById("wallet-label");
    elNetworkWarning = document.getElementById("network-warning");
    elStatBalance = document.getElementById("stat-balance");
    elStatDonors = document.getElementById("stat-donors");
    elStatTotal = document.getElementById("stat-total");
    elMyDonationAmount = document.getElementById("my-donation-amount");
    elDonateInput = document.getElementById("donate-input");
    elBtnDonate = document.getElementById("btn-donate");
    elTxStatus = document.getElementById("tx-status");
    elTxSpinner = document.getElementById("tx-spinner");
    elTxMsg = document.getElementById("tx-msg");
    elTxHashLink = document.getElementById("tx-hash-link");
    elOwnerPanel = document.getElementById("owner-panel");
    elOwnerBalanceInfo = document.getElementById("owner-balance-info");
    elBtnWithdraw = document.getElementById("btn-withdraw");
    elDonorList = document.getElementById("donor-list");
    elContractLink = document.getElementById("contract-etherscan-link");

    if (CONTRACT_ADDRESS && !CONTRACT_ADDRESS.includes("PASTE_YOUR")) {
        elContractLink.href = `${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}`;
        elContractLink.style.display = "inline-flex";
    }

    elBtnConnect.addEventListener("click", connectWallet);
    elBtnDonate.addEventListener("click", donate);
    elBtnWithdraw.addEventListener("click", withdraw);

    if (typeof window.ethereum === "undefined") {
        setStatus("error", "MetaMask is not installed. Please install it from metamask.io to use this dApp.");
        elBtnConnect.disabled = true;
        elBtnConnect.textContent = "MetaMask Required";
        return;
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
        if (accounts.length > 0) {
            connectWallet();
        }
    });

    loadPublicData();
});

async function connectWallet() {
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);

        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length === 0) {
            setStatus("error", "No accounts found. Please unlock MetaMask.");
            return;
        }

        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        isConnected = true;

        elBtnConnect.classList.add("connected");
        elWalletDot.classList.add("connected");
        elWalletLabel.textContent = shortAddress(userAddress);

        await checkNetwork();

        if (isCorrectNetwork) {

            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            await loadAllData();
        }

    } catch (err) {
        if (err.code === 4001) {
            setStatus("error", "Connection rejected. Please approve the MetaMask request.");
        } else {
            setStatus("error", "Failed to connect: " + (err.message || err));
        }
    }
}

async function checkNetwork() {
    const network = await provider.getNetwork();

    isCorrectNetwork = (network.chainId === 11155111);

    if (!isCorrectNetwork) {
        elNetworkWarning.classList.add("show");
        setStatus("error", "Wrong network. Please switch MetaMask to Sepolia Testnet.");
        elBtnDonate.disabled = true;
    } else {
        elNetworkWarning.classList.remove("show");
        elBtnDonate.disabled = false;
        hideTxStatus();
    }
}

async function loadPublicData() {

    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.includes("PASTE_YOUR")) {
        elStatBalance.textContent = "—";
        elStatDonors.textContent = "—";
        elStatTotal.textContent = "—";
        return;
    }

    try {

        let readProvider;
        if (typeof window.ethereum !== "undefined") {
            readProvider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
            readProvider = new ethers.providers.JsonRpcProvider(
                "https://rpc.sepolia.org"
            );
        }

        const readContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider);

        const [balance, donors, totalDonated] = await Promise.all([
            readContract.getContractBalance(),
            readContract.donorCount(),
            readContract.totalDonations()
        ]);

        elStatBalance.textContent = formatEth(balance) + " ETH";
        elStatDonors.textContent = donors.toString();
        elStatTotal.textContent = formatEth(totalDonated) + " ETH";

    } catch (err) {
        console.error("loadPublicData error:", err);

        elStatBalance.textContent = "err";
        elStatDonors.textContent = "err";
        elStatTotal.textContent = "err";
    }
}

async function loadAllData() {
    if (!contract) return;

    try {
        const [balance, donorCount, totalDonated, myDonation, ownerAddr, allDonors] = await Promise.all([
            contract.getContractBalance(),
            contract.donorCount(),
            contract.totalDonations(),
            contract.getDonorAmount(userAddress),
            contract.owner(),
            contract.getDonors()
        ]);

        ownerAddress = ownerAddr;

        elStatBalance.textContent = formatEth(balance) + " ETH";
        elStatDonors.textContent = donorCount.toString();
        elStatTotal.textContent = formatEth(totalDonated) + " ETH";

        elMyDonationAmount.textContent = formatEth(myDonation) + " ETH";

        if (userAddress.toLowerCase() === ownerAddress.toLowerCase()) {
            elOwnerPanel.classList.add("show");
            elOwnerBalanceInfo.textContent =
                "Contract balance available to withdraw: " + formatEth(balance) + " ETH";
        } else {
            elOwnerPanel.classList.remove("show");
        }

        renderDonorList(allDonors);

    } catch (err) {
        console.error("loadAllData error:", err);
        setStatus("error", "Failed to load contract data. Check your network.");
    }
}

async function donate() {
    if (!isConnected || !isCorrectNetwork || !contract) {
        setStatus("error", "Please connect MetaMask to Sepolia first.");
        return;
    }

    const inputVal = elDonateInput.value.trim();
    const ethAmount = parseFloat(inputVal);

    if (!inputVal || isNaN(ethAmount) || ethAmount <= 0) {
        setStatus("error", "Please enter a valid ETH amount greater than 0.");
        return;
    }

    if (ethAmount > 10) {
        setStatus("error", "For testnet safety, donations are capped at 10 ETH.");
        return;
    }

    try {

        const weiAmount = ethers.utils.parseEther(inputVal);

        setStatus("pending", "Waiting for MetaMask confirmation…");
        elBtnDonate.disabled = true;

        const tx = await contract.donate({ value: weiAmount });

        setStatus("pending", "Transaction submitted. Waiting for confirmation…");
        showTxHash(tx.hash);

        await tx.wait(1);

        setStatus("success", "Donation confirmed! Thank you. 🎉");
        elDonateInput.value = "";

        await loadAllData();

    } catch (err) {
        if (err.code === 4001 || (err.message && err.message.includes("user rejected"))) {
            setStatus("error", "Transaction cancelled by user.");
        } else if (err.message && err.message.includes("insufficient funds")) {
            setStatus("error", "Insufficient funds. Get Sepolia ETH from a faucet.");
        } else {
            setStatus("error", "Transaction failed: " + (err.reason || err.message || "Unknown error"));
        }
    } finally {
        elBtnDonate.disabled = false;
    }
}

async function withdraw() {
    if (!isConnected || !isCorrectNetwork || !contract) {
        setStatus("error", "Please connect MetaMask to Sepolia first.");
        return;
    }

    if (!ownerAddress || userAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
        setStatus("error", "Only the contract owner can withdraw funds.");
        return;
    }

    try {
        setStatus("pending", "Waiting for MetaMask confirmation…");
        elBtnWithdraw.disabled = true;

        const tx = await contract.withdraw();

        setStatus("pending", "Withdrawal submitted. Waiting for confirmation…");
        showTxHash(tx.hash);

        await tx.wait(1);

        setStatus("success", "Withdrawal successful! Funds sent to owner address.");

        await loadAllData();

    } catch (err) {
        if (err.code === 4001 || (err.message && err.message.includes("user rejected"))) {
            setStatus("error", "Withdrawal cancelled by user.");
        } else {
            setStatus("error", "Withdrawal failed: " + (err.reason || err.message || "Unknown error"));
        }
    } finally {
        elBtnWithdraw.disabled = false;
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {

        isConnected = false;
        userAddress = null;
        elBtnConnect.classList.remove("connected");
        elWalletDot.classList.remove("connected");
        elWalletLabel.textContent = "Connect Wallet";
        elOwnerPanel.classList.remove("show");
        hideTxStatus();
    } else {

        userAddress = accounts[0];
        elWalletLabel.textContent = shortAddress(userAddress);
        loadAllData();
    }
}

function handleChainChanged() {

    window.location.reload();
}

async function renderDonorList(donorAddresses) {
    if (!donorAddresses || donorAddresses.length === 0) {
        elDonorList.innerHTML = `<p class="empty-state">No donations yet. Be the first! 💙</p>`;
        return;
    }

    const amounts = await Promise.all(
        donorAddresses.map(addr => contract.getDonorAmount(addr))
    );

    const sorted = donorAddresses
        .map((addr, i) => ({ addr, amount: amounts[i] }))
        .sort((a, b) => (b.amount.gt(a.amount) ? 1 : -1));

    const items = sorted.map(({ addr, amount }) => {
        const isOwner = ownerAddress && addr.toLowerCase() === ownerAddress.toLowerCase();
        const isMe = userAddress && addr.toLowerCase() === userAddress.toLowerCase();
        const ownerTag = isOwner ? `<span class="owner-badge">Owner</span>` : "";
        const meTag = isMe ? ` <span style="font-size:11px;color:var(--accent)">(you)</span>` : "";

        return `
        <li class="donor-item">
            <span class="donor-addr" title="${addr}">
                ${shortAddress(addr)}${meTag}${ownerTag}
            </span>
            <span class="donor-amount">${formatEth(amount)} ETH</span>
        </li>`;
    }).join("");

    elDonorList.innerHTML = `<ul class="donor-list">${items}</ul>`;
}

function setStatus(type, message) {
    elTxStatus.className = "show " + type;
    elTxMsg.textContent = message;
    elTxSpinner.className = (type === "pending") ? "spinner show" : "spinner";
}

function hideTxStatus() {
    elTxStatus.className = "";
    elTxHashLink.className = "";
    elTxHashLink.textContent = "";
    elTxHashLink.href = "#";
}

function showTxHash(hash) {
    elTxHashLink.href = `${ETHERSCAN_BASE}/tx/${hash}`;
    elTxHashLink.textContent = `View on Etherscan: ${hash}`;
    elTxHashLink.className = "show";
    elTxHashLink.target = "_blank";
    elTxHashLink.rel = "noopener noreferrer";
}

function shortAddress(addr) {
    if (!addr) return "";
    return addr.slice(0, 6) + "…" + addr.slice(-4);
}

function formatEth(weiValue) {
    if (!weiValue) return "0";
    const eth = ethers.utils.formatEther(weiValue);

    const num = parseFloat(eth);
    if (num === 0) return "0";
    if (num < 0.000001) return num.toExponential(2);
    return parseFloat(num.toFixed(6)).toString();
}
