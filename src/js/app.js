App = {
  web3Provider: null,
  contracts: {},
  initilazed: false,
  counter: 0,
  init: async function() {
    
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
   // ======================================
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Charitable_Organization.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var CharityArtifact = data;
      App.contracts.SmartCharity = TruffleContract(CharityArtifact);
    
      // Set the provider for our contract
      App.contracts.SmartCharity.setProvider(App.web3Provider);
    
    });
    web3.eth.getAccounts(function(error, accounts) {
      console.log('====================================');
      console.log("All accounts");
      console.log(accounts);
      console.log('====================================');
      if (error) {
        console.log(error);
      }

      App.account = accounts[0];
      console.log('====================================');
      console.log("App.account");
      console.log(App.account);
      console.log('====================================');
      // set account 
      $("#account").html(App.account);
    });
    
    return App.setRate();
    
  },
  // fetch and set exchange rate using coinbase API (used to convert balance to MYR)
  setRate: async () => {
    App.rate = 0;
    await fetch("https://api.coinbase.com/v2/exchange-rates?currency=ETH")
      .then((response) => {
        return response.json();
      })
      .then((str_json) => {
        App.rate = str_json.data.rates.MYR;
        console.log('====================================');
        console.log(App.rate);
        console.log('====================================');
        $("#rate").html(`1 ETH = RM ${App.rate}`);
      });
      return App.setBalance ();
  },
  setBalance: async () => {
    let charity;
    App.contracts.SmartCharity.deployed().then(function(instance) {
      charity = instance;
      // Execute addMember as a transaction by sending account
      return charity.getBalance.call(App.account);
    }).then(function(balance) {
        console.log("Account balance is: " + balance);
        $("#balance").html(`${App.formatMoney(balance)}`);
        $("#bal-ether").html(`${balance} ETH`);
    }).catch(function(err) {
        console.log(err.message);
    });
    // bal_wei = await App.getBalance();
    // $("#balance").html(`${App.formatMoney(bal_wei)}`);
    // $("#bal-ether").html(`${App.web3.fromWei(bal_wei, "ether")} ETH`);
  },
  // convert and format number to MYR
  formatMoney: (amount) => {
    amount =  amount * App.rate;

    var formatter = new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    });
    return formatter.format(amount);
  },
  // get all instances of above limit transaction event
  getAboveLimitEvent: async () => {
    let charity;
    App.contracts.SmartCharity.deployed().then(function(instance) {
      charity = instance;
      // Execute addMember as a transaction by sending account
      return charity.AboveLimitTransaction({}, { fromBlock: 0, toBlock: "latest" })
      .get(async (error, result) => {
        if ((result != null) & !error) {
          for (var key in result) {
            // append to table body
            $("#abovelim tbody").append(`<tr>
              <td class="pl-3 py-3 leading-10">${
                result[key].args.accountAddress
              }</td>
              <td class="text-center py-3 leading-10">${
                result[key].args.amount} ETH</td>
              <td class="pr-1 py-3 text-center leading-10" id=fromatedTimestamp-${key}>${await App.getTimeByBlock(
                result[key].transactionHash
              )}</td>
            </tr>`);
          }
        } else {
          $("#abovelim tbody").append(`<tr>
              <td></td>
              <td class="text-center py-3leading-10"> No Above Limit Transactions</td>
              <td></td>
            </tr>`);
        }
      });
      
    });
  },
  // get all instances of high balance event
  getHighBalanceEvent: async () => {
    let charity;
    App.contracts.SmartCharity.deployed().then(function(instance) {
      charity = instance;
      // Execute addMember as a transaction by sending account
      return charity.HighBalance({}, { fromBlock: 0, toBlock: "latest" })
      .get(async (error, result) => {
        if ((result != null) & !error) {
          last = result[Object.keys(result)[Object.keys(result).length - 1]];
          accounts = last.args.suspectedAccounts;
          // append to table body
          for (var acc in accounts)
            $("#highbal tbody").append(
              `<tr><td class="pl-3 pr-3 pb-4  leading-10">${accounts[acc]}</td></tr>`
            );
          // when there are no cases of the event
        } else{
          $("#highbal tbody").append(
            `<tr><td class="pl-3 pr-3  mb-3 leading-10">No Suspected Accounts</td></tr>`
          );
        }
          
      });
   
    });
  },
  // get transaction time and convert unix timestamp to normal date
  // get transaction time and convert unix timestamp to normal date
  getTimeByBlock: async (txHash) => {
    // const timestamp
    web3.eth.getTransaction(txHash,function(error, result) {
      if (error) {
        console.log(error);
      }
      else{
         console.log(result);
         web3.eth.getBlock(result.blockNumber,function(error, result) {
          if (error) {
            console.log(error);
          }
          else{
            console.log(result.timestamp);
            console.log( dayjs.unix(result.timestamp).format("DD/MM/YYYY, HH:mm:ss A"))
            return App.renderTimestamp(result.timestamp)
            // timestamp = result.timestamp
            // console.log("Final Check");
            // console.log(timestamp);
            // return dayjs.unix(timestamp).format("DD/MM/YYYY, HH:mm:ss A"); 
          }
        });
      }
     
    });
    
    // const blockN = await web3.eth.getTransaction(txHash, (result, error) =>{
    //   if(result){
    //     console.log(result);
    //   }
    // });
    // const blockData = await web3.eth.getBlock(blockN.blockNumber);

    // return dayjs.unix(blockData.timestamp).format("DD/MM/YYYY, HH:mm:ss A");
  },
  renderTimestamp: async (timestamp) => {
    // const timestamp
    
    let frmatedTimestamp = dayjs.unix(timestamp).format("DD/MM/YYYY, HH:mm:ss A")
    $(`#fromatedTimestamp-${App.counter}`).html(frmatedTimestamp);
    App.counter += 1
    
     
  }
  


};

$(function() {
  $(window).load(function() {
    App.init();
    // if (localStorage.getItem("hasCodeRunBefore") === null) {
    //   App.init();
    //   localStorage.setItem("hasCodeRunBefore", true);
    // }
  });
});