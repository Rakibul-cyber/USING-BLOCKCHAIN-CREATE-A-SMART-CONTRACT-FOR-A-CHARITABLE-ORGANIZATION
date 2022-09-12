// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;
contract Charitable_Organization
{
    
    uint256 private bankLiquidity;       // Balance of whole contract
    address public owner;
    address[] suspectedAccounts;
    mapping(address => uint256) private customerBalance;
    uint public ThresholdValue = 10;
    uint public MaxEther= 50;
    struct Donatee {
        string name;
        string id;
        uint balance;
    }
    mapping (address => Donatee) person;
    address[] all_Donatee;
    //Function adding values to the mapping
    function add_donatee(address _address, string memory _name, string memory _id) public {
       Donatee storage  _person
          = person[_address];
  
        _person.name = _name;
        _person.id = _id;
        _person.balance = 0;
        all_Donatee.push(_address); //push returns length so -1 at the end 
  
    }
    // Function to retrieve 
     // values from the mapping
     function get_Donatees() view public returns (address  [] memory) {
        return all_Donatee;
    }
    function check_donetees_information (address _address) view public returns(string memory name, string memory id, uint balance){
        Donatee storage  _person = person[_address];
        balance = customerBalance[_address];
        return(_person.name, _person.id, balance);
    }
    constructor() public payable {
        
        owner = msg.sender;
        
        customerBalance[msg.sender] += msg.value;
        
    }
    event fallbackCalled(address, uint256);
    event deposit(address, uint256);
    event withdrawal(address _address, uint256 ampunt);
    // event Suspect(address _address, uint amount, string message);
    // emitted when a trasnaction value > threashold
    event AboveLimitTransaction(
        string message,
        address indexed accountAddress,
        uint256 amount
    );
    // emitted when the account balance is > max
    event HighBalance(string message, address[] suspectedAccounts);
    // event MoneyLaundering(string m1);

    modifier ownerOnly() {
        require(msg.sender == owner, "message.sender is not the bank owner");
        _;
    }

    function depositFund(address _address, uint _amount) public payable  {
        // add account to accounts index after making sure its not already there
        

        // add the amount to the accounts balance
        // no neeed to manually transfer msg.value to the contract about (bank)
        // because its automatically done
        customerBalance[_address] += _amount;

        // send an alert if its above the threashold
        if (_amount > ThresholdValue) {
            emit AboveLimitTransaction(
                "transaction amount above threashold! ",
                _address,
                _amount
                
            );
        }
        uint balance = customerBalance[msg.sender];
        // send an alert if the bank has more then 50 ethers
        if (balance > MaxEther) {
            if (!isInAccounts(_address)){
                suspectedAccounts.push(_address);
            }
            emit HighBalance("Laundering Alert!!!", suspectedAccounts );
        }
    }
    // @returns true if msg.sender is already in known accounts
    function isInAccounts(address _address) private view returns (bool) {
        for (uint256 i = 0; i < suspectedAccounts.length; i++) {
            if (suspectedAccounts[i] == _address){
                return true;
            }
            
        }
        return false;
    }
    /** Customer Deposit payable function */
    function donateFunds(address from, address to, uint256 RM) external payable returns(bool){
        
        customerBalance[from] -=  RM;
        customerBalance[to] +=  RM;
        if (RM > ThresholdValue)
        {
            // msg.sender.transfer(address(this).balance);
           
            // require(RM <= ThresholdValue, "Warning");
            emit AboveLimitTransaction(
                "transaction amount above threashold! ",
                from,
                RM
            );
            
        }
        // customerBalance[msg.sender] += RM;
        // customerBalance[forum] +=  RM;
        
        if (customerBalance[to] >  MaxEther)
        {
            // msg.sender.transfer(address(this).balance);
             if (!isInAccounts(to)){
                suspectedAccounts.push(to);
            }
            emit HighBalance("Laundering Alert!!!", suspectedAccounts );
            // emit MoneyLaundering ("Laundering Alert!!!");
        }
        
        // emit deposit(from, RM);
    
        return true;
    }

    /** Pull and Push / Check Effects and Interactions patterns */
    function withdrawFunds(address _address, uint256 _value) public payable {
        require(_value <= customerBalance[_address], "account balance is low");
        customerBalance[_address] -= _value;   // Update the state 
        // msg.sender.transfer(_value);       // Push funds
        emit withdrawal(_address, _value);
    }



    /** Fetch Customer Balance */
    // function getCustomerBalance(address _address) public view returns(uint256) {
    //         return customerBalance[_address];
    // }
    function getBalance(address _address) public view  returns (uint256) {
        return  customerBalance[_address];
    }


}