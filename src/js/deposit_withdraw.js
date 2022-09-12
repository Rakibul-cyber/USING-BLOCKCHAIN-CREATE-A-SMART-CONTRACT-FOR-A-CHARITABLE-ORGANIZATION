


function deposit(){
    var charity;
    var account
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      account = accounts[0];
      console.log(account);
      amount = $("#amount").val();
      if (amount.length > 0) {
        // amount = web3.utils.toWei(amount);
        //   App.deposit(amount);
        console.log('====================================');
        console.log(amount);
        console.log('====================================');

        App.contracts.SmartCharity.deployed().then(function(instance) {
            charity = instance;
            // Execute addMember as a transaction by sending account
            return charity.depositFund( account, amount,{from: account });
        }).then(function(result) {
           
            App.setBalance();
            console.log(result);
        }).catch(function(err) {
            console.log(err.message);
        });
       
        
    } else{
        window.alert("Please Enter a valid Amount!");
    } 

      
    });

}
function withdraw(){
    console.log("Withdraw");
    let account;
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
  
        account = accounts[0];
        console.log(account);
        amount = $("#amount").val();
        if (amount.length > 0) {
            // amount = web3.utils.toWei(amount);
            //   App.deposit(amount);
            console.log('====================================');
            console.log(amount);
            console.log('====================================');

            App.contracts.SmartCharity.deployed().then(function(instance) {
                charity = instance;
                // Execute addMember as a transaction by sending account
                return charity.withdrawFunds( account, amount,{from: account });
            }).then(function(result) {
                App.setBalance();
                console.log(result);
            }).catch(function(err) {
                console.log(err.message);
            });
        } else{
            window.alert("Please Enter a valid Amount!");
        } 
     // const Web3Utils = require('web3-utils');
        // App.contracts.SmartCharity.deployed().then(function(instance) {
        //     charity = instance;
        //     // Execute addMember as a transaction by sending account
        //     return charity.getBalance.call(account);
        // }).then(function(balance) {
        //     console.log("Account balance is: " + balance);
        // }).catch(function(err) {
        //     console.log(err.message);
        // });
    });
}