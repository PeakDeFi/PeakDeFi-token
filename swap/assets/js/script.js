// address needs updating to mainnet
var swapContract = "0x92A6C7F8e06c53fbf6FD457b140c28a9f491B6c1";

var oldPeakToken = "0x8974a63e858912209B5B602A660f26718B575956";

var contract_abi = [{"inputs":[{"internalType":"address","name":"_wallet","type":"address"},{"internalType":"address","name":"_fromERC20","type":"address"},{"internalType":"address","name":"_toERC20","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"fromERC20","type":"address"},{"indexed":false,"internalType":"address","name":"toERC20","type":"address"},{"indexed":false,"internalType":"uint256","name":"balance","type":"uint256"}],"name":"TokenSwap","type":"event"},{"inputs":[],"name":"fromERC20","outputs":[{"internalType":"contract IPeakDeFi","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"swapAmount","type":"uint256"}],"name":"swap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"toERC20","outputs":[{"internalType":"contract IPeakDeFi","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

var token_abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

var accounts, OLD_PEAK_CONTRACT, SWAP_CONTRACT;

async function metamaskIntegration() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {} else {
        alert("The File APIs are not fully supported in this browser.");
    }

    //Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            //Request account access
            //if needed
            metaMask = false;
            ethereum.enable().then(metaMask = true);
        } catch (error) {
            metaMask = false;
            alert('Connect to metamask');
            //User denied account access...
        }
    }
    //Legacy dapp browsers...
    else if (window.web3) {
        metaMask = true;
        window.web3 = new Web3(web3.currentProvider);
    }
    //Non - dapp browsers...
    else {
        metaMask = false;
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    if (metaMask) {
        $('#account').removeClass('d-none');
    }

    await web3.eth.getAccounts(function(error, result) {
        if (!error) {
            accounts = result;
        } else
            console.error(error);
    });
}

async function contractInitialization(contractAddress, contractABI) {
    return (await new web3.eth.Contract(contractABI, contractAddress));
}

function convert(n) {
    var sign = +n < 0 ? "-" : "",
        toStr = n.toString();
    if (!/e/i.test(toStr)) {
        return n;
    }
    var [lead, decimal, pow] = n.toString()
        .replace(/^-/, "")
        .replace(/^([0-9]+)(e.*)/, "$1.$2")
        .split(/e|\./);
    return +pow < 0 ?
        sign + "0." + "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal :
        sign + lead + (+pow >= decimal.length ? (decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))) : (decimal.slice(0, +pow) + "." + decimal.slice(+pow)))
}

$(function() {

    metamaskIntegration().then(x => {

        $('#account').html(accounts[0].substring(0, 6) + '...' + accounts[0].substring(36, 41));

        contractInitialization(oldPeakToken, token_abi).then(oldPeak => {
            OLD_PEAK_CONTRACT = oldPeak;
        });

        contractInitialization(swapContract, contract_abi).then(c => {
            SWAP_CONTRACT = c;
        });

    });


    $('#connectWallet').click(function(e) {
        e.preventDefault();
        metamaskIntegration().then(x => {
            $('#account').html(accounts[0].substring(0, 6) + '...' + accounts[0].substring(36, 41));
        });
    });

    $('#token_amount_all').click(async function(e) {
        e.preventDefault();
        var totalBalance = await OLD_PEAK_CONTRACT.methods.balanceOf(accounts[0]).call();
        totalBalance = totalBalance / 10 ** (6);
        $('#token_amount').val(totalBalance);
        $('#token_swap').val(totalBalance);
    });

    $('#approveTokens').click(function(e) {
        e.preventDefault();
        var tokens = $('#token_amount').val();
        tokens = (convert(tokens * 10 ** (8))).toString();
        OLD_PEAK_CONTRACT.methods.approve(swapContract, tokens).send({
            from: accounts[0],
            gasLimit: 210000
        }).on('transactionHash', function(hash) {
            $('#status').html('Please wait! \n Approve <a href="https://etherscan.io/tx/' + hash + '" target="_blank">Transaction is pending...');
        }).on('confirmation', function(confirmationNumber, receipt) {
            $('#status').html('Tokens have been approved and it is ready to be swapped.');
        });
    });

    $('#swapBtn').click(function(e) {
        e.preventDefault();
        var tokens = $('#token_amount').val();
        tokens = (convert(tokens * 10 ** (8))).toString()
        SWAP_CONTRACT.methods.swap(tokens).send({
            from: accounts[0],
            gasLimit: 210000
        }).on('transactionHash', function(hash) {
            $('#status').html('Swap <a href="https://etherscan.io/tx/' + hash + '" target="_blank">Transaction is pending...');
        }).on('confirmation', function(confirmationNumber, receipt) {
            $('#status').html('Tokens have been swapped, please check your wallet!');
        });
    });

});
