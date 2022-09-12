import "remix_tests.sol"; // this import is automatically injected by Remix.
import "../contracts/charity.sol";

contract CharityTest {
   
    
   
    Charitable_Organization charityTest;

    function beforeAll () public {
        charityTest = new Charitable_Organization();
    }
    //===================== Test-1 ======================
    // function depositFund(address _address, uint _amount) public payable  {
    function checkFundDeposition() public {
        address _accountAddress = address(0xAdF76181e653b3Ae15DC9c4c55dcb4C07f2adab3);
        bool result ;
        result = charityTest.depositFund(_accountAddress, 30);
        Assert.equal(result, true, "Successfully deposited 30 ETH");
        Assert.equal(charityTest.getBalance(_accountAddress),uint(30), "Current balance should be 30 ETH");
    }
    //===================== Test-2 ======================
    // function donateFunds(address from, address to, uint256 RM) external payable returns(bool)
    function checkFundDonation() public {
        address donorAddress = address(0xAdF76181e653b3Ae15DC9c4c55dcb4C07f2adab3);
        address beneficiaryAddress = address(0x43Cd8C5Ae071e3A6db2a771Aa9E4BA2c0AbeCe05);
        bool result ;
        result = charityTest.donateFunds(donorAddress, beneficiaryAddress, 10);
        Assert.equal(result, true, "Successfully Denoted 10 ETH");
        Assert.equal(charityTest.getBalance(donorAddress),uint(20), "Current balance should be 20 ETH");
    }
    
    // function checkWinninProposalWithReturnValue () public view returns (bool) {
    //     return ballotToTest.winningProposal() == 0;
    // }
}
