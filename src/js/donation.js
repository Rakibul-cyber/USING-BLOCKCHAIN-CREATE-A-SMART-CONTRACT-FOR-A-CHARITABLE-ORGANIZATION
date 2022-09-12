function makeDonation(){
    console.log("Donation............");
    let account;
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
  
        account = accounts[0];
        console.log(account);
        address_TO =  $("#account-to").val();
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
                return charity.donateFunds( account,address_TO, amount,{from: account });
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