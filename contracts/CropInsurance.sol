// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
contract CropInsurance is Ownable{

   using SafeMath for uint256;

   struct CropTypeDetail {
       string season;
       uint premiumPerCent;
       uint durationInMonths;
       uint coveragePerCent;
   }

   enum PolicyStatus {
       PENDING, ACTIVE, EXPIRED, CLAIMED, CANCELLED
   }

   struct Policy {
       uint policyNumber;
       address payable user;
       string cropName;
       uint premiumAmount;
       uint landAreaInCents;
       uint startTime;
       uint endTime;
       string location;
       uint coverageAmount;
       string season;
       PolicyStatus status;
       string pType;

   }

   CropTypeDetail[] public cropTypeDetails;
   Policy[] public policies;
   // assume user can have multiple policies
   mapping(address => uint[]) public userPolicies;
   


   event PaymentReceived(address indexed payer, uint256 value);

   event PolicyCreated(address indexed payer, uint256 policyNumber);

   event PolicyActivated(address indexed payer, uint256 policyNumber);
   
   event PolicyClaimed(address indexed payer, uint256 policyNumber);

   event PolicyExpired(address indexed payer, uint256 policyNumber);

   event CoverageAmountTransferred(address indexed payer, uint256 policyNumber, uint256 amount);


   function addCropTypeDetail(string memory season, uint premiumPerCent, uint durationInMonths, uint coveragePerCent ) private {
        CropTypeDetail memory cropTypeDetail = CropTypeDetail({
            season : season,
            premiumPerCent:premiumPerCent,
            durationInMonths: durationInMonths,
            coveragePerCent : coveragePerCent

        });
        
        cropTypeDetails.push(cropTypeDetail);
   }


   function buyPolicy(uint _seasonIdentifer, string memory _cropName, string memory _location, string memory _pType, uint _areaInCents, uint _coverageAmount) public payable{
         CropTypeDetail memory cropDetail = cropTypeDetails[_seasonIdentifer];
         uint endTime = block.timestamp + cropDetail.durationInMonths * 30*24*60*60;

         uint _policyNumber = policies.length;
        
            Policy memory policy = Policy({
                policyNumber : _policyNumber,
                user: payable(msg.sender),
                cropName: _cropName,
                premiumAmount: msg.value,
                landAreaInCents: _areaInCents,
                startTime: block.timestamp,
                endTime: endTime,
                location:_location,
                season: cropTypeDetails[_seasonIdentifer].season,
                pType : _pType,
                status: PolicyStatus.ACTIVE,
                coverageAmount: _coverageAmount
            });
            
            userPolicies[msg.sender].push(_policyNumber);
            emit PaymentReceived(msg.sender, msg.value);

            // policy.status = PolicyStatus.ACTIVE;
            policies.push(policy);
            
            emit PolicyCreated(msg.sender, _policyNumber);

            emit PolicyActivated(msg.sender, _policyNumber);

           
            

            
            
   }

    
    constructor() public {
        addCropTypeDetail('KARIF', 0.001 ether , 6 , 0.01 ether);
        addCropTypeDetail('RABI', 0.002 ether , 4 , 0.01 ether);
        addCropTypeDetail('ZAID', 0.003 ether , 3 , 0.01 ether);
    }


    function claim(uint policyNumber) public {
        require(msg.sender == policies[policyNumber].user, "User Not Authorized");
        require(policies[policyNumber].status == PolicyStatus.ACTIVE, "Policy Not Active");

        if(block.timestamp > policies[policyNumber].endTime)
        {
            policies[policyNumber].status = PolicyStatus.EXPIRED;
            emit PolicyExpired(msg.sender, policyNumber);
            revert("Policy's period has Ended.");
        }


        // claim policy is according to the weather conditions
        // we have to write business logic here to check given date is matching the requirements to disburse
        // insurance amount, otherwise we reject the insurance claim


        // validateClaim(policyNumber, string memory location);

        Policy memory policy = policies[policyNumber];

         (bool success, bytes memory transactionBytes) = 
        policy.user.call{value:policy.coverageAmount}('');
        
         require(success, "Transfer failed.");
         if (success) {
             emit CoverageAmountTransferred(policy.user, policyNumber, policy.coverageAmount);
         }
         policies[policyNumber].status = PolicyStatus.CLAIMED;

         emit PolicyClaimed(msg.sender, policyNumber);
        
        
    }

    function getUserPolicies(address owner) public view returns (uint[] memory) {
        return userPolicies[owner];
    }


      receive() external payable { }

      




}