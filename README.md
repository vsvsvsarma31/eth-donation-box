# ETH Donation Box 💙

A transparent, on-chain donation dApp deployed on the **Ethereum Sepolia testnet**.
Built as a capstone project for the **BlockBase** course by IIT Guwahati Finance and Economics Club.

---

## What It Does

- Anyone can connect their MetaMask wallet and donate ETH to the contract.
- All donations are recorded permanently on-chain with events.
- A leaderboard shows every donor and their total contribution.
- The contract owner (deployer) can withdraw all accumulated funds.
- The contract balance, donor count, and total donated are readable by anyone.

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contract | Solidity `^0.8.10` |
| IDE | Remix IDE (browser-based, no install) |
| Testnet | Sepolia (Chain ID: 11155111) |
| Frontend | Plain HTML + CSS + JavaScript |
| Web3 library | ethers.js v5.7 (CDN) |
| Wallet | MetaMask browser extension |

No React. No Next.js. No Hardhat. No build step. Open `index.html` and it works.

---

## Repository Structure

```
eth-donation-box/
├── contracts/
│   └── DonationBox.sol          ← Solidity smart contract
├── frontend/
│   ├── index.html               ← Main dApp page
│   ├── style.css                ← All styling
│   └── app.js                   ← ethers.js + MetaMask logic
├── screenshots/
│   └── README.md                ← Instructions for adding screenshots
├── .gitignore
└── README.md                    ← This file
```

---

## Deployment Guide

Follow these steps **in order**. Do not skip ahead.

### Step 1 — Prerequisites

1. **Install MetaMask** — Download from [metamask.io](https://metamask.io). Create a wallet. Back up your seed phrase.

2. **Add Sepolia Testnet** — In MetaMask:
   - Click the network dropdown (top left, usually shows "Ethereum Mainnet")
   - Click **"Add a network"** → **"Add a network manually"**
   - Fill in:
     - Network name: `Sepolia`
     - New RPC URL: `https://rpc.sepolia.org`
     - Chain ID: `11155111`
     - Currency symbol: `ETH`
     - Block explorer URL: `https://sepolia.etherscan.io`
   - Click Save, then switch to Sepolia.

   > **Shortcut:** Visit [chainlist.org](https://chainlist.org/?testnets=true&search=sepolia), find Sepolia, click "Add to MetaMask".

3. **Get Sepolia ETH** — You need testnet ETH (it is free and has no real value):
   - [sepoliafaucet.com](https://sepoliafaucet.com) — Alchemy faucet (recommended)
   - [faucets.chain.link/sepolia](https://faucets.chain.link/sepolia) — Chainlink faucet
   - [faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)

   Wait a few minutes after requesting. You'll see the ETH appear in MetaMask.

---

### Step 2 — Deploy the Smart Contract in Remix

1. **Open Remix IDE** — Go to [remix.ethereum.org](https://remix.ethereum.org) in Chrome, Firefox, or Brave.
   *(Do not use Safari — MetaMask does not work as an extension there.)*

2. **Create the contract file**:
   - In the left sidebar, click the **File Explorer** icon (top icon).
   - Click the **"New File"** button (paper icon).
   - Name it `DonationBox.sol`.
   - Copy the **entire contents** of `contracts/DonationBox.sol` from this repo and paste it in.

3. **Compile the contract**:
   - Click the **Solidity Compiler** tab in the left sidebar (second icon, looks like `<S>`).
   - Set compiler version to `0.8.10` (or any `0.8.x`).
   - Enable **"Auto compile"** checkbox, or click the **"Compile DonationBox.sol"** button.
   - You should see a green tick. If there are red errors, re-check you pasted the full file.

4. **Deploy to Sepolia**:
   - Click the **Deploy & Run Transactions** tab (third icon, looks like a rocket).
   - Under **"Environment"**, open the dropdown and select **"Injected Provider - MetaMask"**.
   - MetaMask will open and ask you to connect your account. Approve it.
   - Confirm it shows **"Sepolia"** in both MetaMask and the Remix environment dropdown.
   - Under **"Contract"**, make sure `DonationBox` is selected.
   - Click the orange **"Deploy"** button.
   - MetaMask will open a transaction confirmation. Review the gas fee and click **"Confirm"**.
   - Wait ~15 seconds. In the Remix console (bottom panel), you'll see a green tick.

5. **Copy your contract address**:
   - In the **"Deployed Contracts"** section (bottom of the Deploy panel), expand your contract.
   - Copy the address shown — it starts with `0x` and is 42 characters long.
   - This is your **CONTRACT_ADDRESS**. You'll need it in Step 3.

6. **Verify on Etherscan** *(recommended for full marks)*:
   - Go to `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`.
   - Click **"Contract"** tab → **"Verify and Publish"**.
   - Fill in:
     - Compiler type: **Solidity (Single file)**
     - Compiler version: **v0.8.10+commit…** (match what Remix used)
     - Open Source License: **MIT**
   - Paste the full `DonationBox.sol` source code.
   - Click **"Verify and Publish"**.
   - After a few seconds it will show a green checkmark. Now anyone can read your source code on Etherscan.

---

### Step 3 — Configure the Frontend

1. Open `frontend/app.js` in any text editor (VS Code, Notepad, TextEdit).

2. Find line 14 (near the top):
   ```javascript
   const CONTRACT_ADDRESS = "PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
   ```

3. Replace the placeholder with your actual contract address from Step 2:
   ```javascript
   const CONTRACT_ADDRESS = "0xYourActualContractAddressHere";
   ```
   Example:
   ```javascript
   const CONTRACT_ADDRESS = "0x4A9f3B2c1D8e7F0a6C5b4E3d2F1a0B9c8D7e6F5";
   ```

4. Save the file.

---

### Step 4 — Run the Frontend

**Option A — Open directly in browser (simplest):**
- Navigate to the `frontend/` folder.
- Double-click `index.html`.
- It opens in your browser. Works immediately — no server needed.

**Option B — Local web server (avoids any browser CORS restrictions):**
- If you have Python: `cd frontend && python3 -m http.server 8080`, then open `http://localhost:8080`.
- If you have Node.js: `cd frontend && npx serve .`, then open the URL shown.

**Option C — GitHub Pages (for sharing your submission link):**
- See Step 5 below.

---

### Step 5 — Deploy to GitHub (Submission)

1. **Create a GitHub account** if you don't have one at [github.com](https://github.com).

2. **Create a new repository**:
   - Click **"+"** → **"New repository"**.
   - Name it `eth-donation-box` (or any name).
   - Set it to **Public**.
   - Do NOT initialise with a README (you already have one).
   - Click **"Create repository"**.

3. **Push your code**:
   ```bash
   cd eth-donation-box
   git init
   git add .
   git commit -m "Initial commit: ETH Donation Box dApp"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/eth-donation-box.git
   git push -u origin main
   ```
   Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

4. **Enable GitHub Pages** *(optional but impressive)*:
   - Go to your repo on GitHub.
   - Click **"Settings"** → **"Pages"** (left sidebar).
   - Under **"Source"**, select **"Deploy from a branch"**.
   - Branch: `main`, Folder: `/frontend`.
   - Click **"Save"**.
   - After ~2 minutes, your dApp will be live at:
     `https://YOUR_GITHUB_USERNAME.github.io/eth-donation-box/`

5. **Add screenshots** to the `screenshots/` folder and push them:
   ```bash
   git add screenshots/
   git commit -m "Add screenshots"
   git push
   ```

6. **Submit** your repository URL to BlockBase.

---

## How to Use the dApp

### Donating
1. Open `index.html` in Chrome/Firefox/Brave.
2. Click **"Connect Wallet"** — MetaMask will ask you to approve.
3. Ensure MetaMask is set to **Sepolia** network.
4. Enter an ETH amount (e.g. `0.01`).
5. Click **"Donate"**.
6. Approve the transaction in MetaMask.
7. Wait for confirmation (~15 seconds on Sepolia).
8. Stats update automatically. Your address appears in the leaderboard.

### Withdrawing (Owner Only)
1. Connect with the **same wallet you used to deploy** the contract.
2. The **Owner Panel** section will appear automatically.
3. Click **"Withdraw All Funds"**.
4. Approve in MetaMask. Funds transfer to your wallet.

---

## Smart Contract Reference

| Function | Type | Description |
|---|---|---|
| `donate()` | `payable` | Accept ETH donation, track per-donor amounts, emit event |
| `withdraw()` | `onlyOwner` | Withdraw full balance to owner address |
| `getContractBalance()` | `view` | Current ETH balance in wei |
| `getDonorAmount(address)` | `view` | Amount donated by a specific address in wei |
| `getDonors()` | `view` | Array of all unique donor addresses |
| `totalDonations` | `public uint` | Total ETH ever donated (wei) |
| `donorCount` | `public uint` | Number of unique donors |
| `owner` | `public address` | Deployer address |

| Event | Parameters | When emitted |
|---|---|---|
| `DonationReceived` | `donor, amount, timestamp` | Every `donate()` call |
| `FundsWithdrawn` | `owner, amount, timestamp` | Every `withdraw()` call |

---

## Concepts Demonstrated

This project applies every major concept taught in BlockBase Days 1–5:

- **Blockchain fundamentals** — all state is on-chain, transparent, and immutable
- **Ethereum accounts** — uses EOA (MetaMask) to interact with a Contract Account
- **Gas** — every write call (`donate`, `withdraw`) costs gas; view calls are free
- **Solidity `constructor`** — captures `owner = msg.sender` at deployment (Day 3)
- **State variables** — `mapping`, `address`, `uint256`, `address[]` (Day 3)
- **`require()` checks** — input validation and access control (Day 3)
- **Events** — `DonationReceived` and `FundsWithdrawn` for auditability (Day 4)
- **`msg.sender` / `msg.value`** — EVM globals used throughout
- **ethers.js** — provider, signer, contract interaction (Day 2 wallets section)
- **MetaMask** — real wallet integration on a real testnet

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "MetaMask Required" message | Install MetaMask from metamask.io |
| Wrong network warning | Switch MetaMask to Sepolia (Chain ID 11155111) |
| Stats show "—" or "err" | Make sure `CONTRACT_ADDRESS` in `app.js` is updated |
| "Insufficient funds" | Get free Sepolia ETH from sepoliafaucet.com |
| Transaction keeps pending | Sepolia can be slow. Wait up to 60 seconds. |
| Remix shows red errors | Check compiler version is 0.8.x |
| Owner panel not showing | Connect with the wallet that deployed the contract |

---

## Acknowledgements

- **BlockBase** by IIT Guwahati Finance and Economics Club
- [Remix IDE](https://remix.ethereum.org) by the Ethereum Foundation
- [ethers.js](https://ethers.io) by Richard Moore
- [OpenZeppelin](https://openzeppelin.com) for contract security patterns
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com) for testnet ETH
