function loadOverLimitTransctionData(){
    console.log('====================================');
    console.log("Overlimit Transction");
    console.log('====================================');
    App.getAboveLimitEvent()
}


function loadSuspiciousTransctionData(){
    console.log('====================================');
    console.log("Suspicious Transction");
    console.log('====================================');
    
    App.getHighBalanceEvent()
}


