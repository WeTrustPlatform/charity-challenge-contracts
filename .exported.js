module.exports = {"abi":[{"constant":true,"inputs":[],"name":"hasChallengeAccomplished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"donorBalances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"challengeSafetyHatchTime1","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"marketAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"challengeEndTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"npoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"donorCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"challengeSafetyHatchTime2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isEventFinalizedAndValid","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_contractOwner","type":"address"},{"name":"_npoAddress","type":"address"},{"name":"_marketAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Received","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"npo","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Donated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"claimer","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"claimer","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"SafetyHatchClaimed","type":"event"},{"constant":true,"inputs":[{"name":"_donorAddress","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"safetyHatchClaim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],"bytecode":"0x608060405234801561001057600080fd5b506040516060806110e58339810180604052606081101561003057600080fd5b81019080805190602001909291908051906020019092919080519060200190929190505050826000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663439f5ac26040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b1580156101dc57600080fd5b505afa1580156101f0573d6000803e3d6000fd5b505050506040513d602081101561020657600080fd5b810190808051906020019092919050505060048190555062278d006004540160058190555062278d00600554016006819055506000600760006101000a81548160ff0219169083151502179055506000600760016101000a81548160ff021916908315150217905550505050610e64806102816000396000f3fe6080604052600436106100d0576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806307171d7f146101f4578063306a7ce01461020b5780634bb278f31461023a5780634e71d92d1461025157806370a08231146102685780637b8c8de1146102cd5780638773030914610332578063956236411461035d578063bc3fde4e146103b4578063bdcb75fb146103df578063c407670f14610436578063ce606ee014610461578063d87a328a146104b8578063e8e3ae69146104e3575b60045442111515156100e157600080fd5b6000341115156100f057600080fd5b6000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414801561013f5750600034115b15610157576009600081548092919060010191905055505b34600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055503373ffffffffffffffffffffffffffffffffffffffff167f88a5966d370b9919b20f3e2c13ff65706f196a4e32cc2c12bf57088f88525874346040518082815260200191505060405180910390a2005b34801561020057600080fd5b50610209610512565b005b34801561021757600080fd5b506102206106a5565b604051808215151515815260200191505060405180910390f35b34801561024657600080fd5b5061024f6106b8565b005b34801561025d57600080fd5b50610266610869565b005b34801561027457600080fd5b506102b76004803603602081101561028b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506109c9565b6040518082815260200191505060405180910390f35b3480156102d957600080fd5b5061031c600480360360208110156102f057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a31565b6040518082815260200191505060405180910390f35b34801561033e57600080fd5b50610347610a49565b6040518082815260200191505060405180910390f35b34801561036957600080fd5b50610372610a4f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103c057600080fd5b506103c9610a75565b6040518082815260200191505060405180910390f35b3480156103eb57600080fd5b506103f4610a7b565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561044257600080fd5b5061044b610aa1565b6040518082815260200191505060405180910390f35b34801561046d57600080fd5b50610476610aa7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156104c457600080fd5b506104cd610acc565b6040518082815260200191505060405180910390f35b3480156104ef57600080fd5b506104f8610ad2565b604051808215151515815260200191505060405180910390f35b6006544211151561052257600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561057d57600080fd5b60003073ffffffffffffffffffffffffffffffffffffffff163190506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050158015610617573d6000803e3d6000fd5b506001600760026101000a81548160ff0219169083151502179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f1ac1e39f5a410afcc9fd213aab1b92287e00cf00e216f3776f352ab328d124f9826040518082815260200191505060405180910390a250565b600760019054906101000a900460ff1681565b600454421115156106c857600080fd5b60055442111515156106d957600080fd5b600760009054906101000a900460ff161515156106f557600080fd5b60006106ff610ae5565b600760018294508391906101000a81548160ff021916908315150217905550505080151561086657600760019054906101000a900460ff161561084a5760003073ffffffffffffffffffffffffffffffffffffffff16319050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050501580156107d7573d6000803e3d6000fd5b50600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f2a01595cddf097c90216094025db714da3f4e5bd8877b56ba86a24ecead8e543826040518082815260200191505060405180910390a2505b6001600760006101000a81548160ff0219169083151502179055505b50565b6004544211151561087957600080fd5b600760009054906101000a900460ff1680610895575060055442115b15156108a057600080fd5b600760019054906101000a900460ff1615806108bd575060055442115b15156108c857600080fd5b60006108d3336109c9565b1115156108df57600080fd5b60006108ea336109c9565b90503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610932573d6000803e3d6000fd5b506000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff167fd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a826040518082815260200191505060405180910390a250565b6000600760029054906101000a900460ff16156109e95760009050610a2c565b600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b919050565b60086020528060005260406000206000915090505481565b60055481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60095481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60065481565b600760009054906101000a900460ff1681565b600080600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16638d4e40836040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b158015610b6c57600080fd5b505afa158015610b80573d6000803e3d6000fd5b505050506040513d6020811015610b9657600080fd5b810190808051906020019092919050505015610e2b57600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166304be2f506040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b158015610c3057600080fd5b505afa158015610c44573d6000803e3d6000fd5b505050506040513d6020811015610c5a57600080fd5b810190808051906020019092919050505015610c7d576000600191509150610e34565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633c26482060006040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018082815260200191505060206040518083038186803b158015610d0f57600080fd5b505afa158015610d23573d6000803e3d6000fd5b505050506040513d6020811015610d3957600080fd5b810190808051906020019092919050505090506000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633c26482060016040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018082815260200191505060206040518083038186803b158015610dde57600080fd5b505afa158015610df2573d6000803e3d6000fd5b505050506040513d6020811015610e0857600080fd5b810190808051906020019092919050505090508181116000935093505050610e34565b60006001915091505b909156fea165627a7a72305820579e5436612796a1d0fa5aa6c4a3c582e0c3927f30e1dd5532b31e218278392a0029","sourceMap":"50:3756:0:-;;;819:570;8:9:-1;5:2;;;30:1;27;20:12;5:2;819:570:0;;;;;;;;;;;;;13:2:-1;8:3;5:11;2:2;;;29:1;26;19:12;2:2;819:570:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;983:14;967:13;;:30;;;;;;;;;;;;;;;;;;1020:11;1007:10;;:24;;;;;;;;;;;;;;;;;;1057:14;1041:13;;:30;;;;;;;;;;;;;;;;;;1098:14;1081:6;;:32;;;;;;;;;;;;;;;;;;1142:6;;;;;;;;;;;:17;;;:19;;;;;;;;;;;;;;;;;;;;;;8:9:-1;5:2;;;30:1;27;20:12;5:2;1142:19:0;;;;8:9:-1;5:2;;;45:16;42:1;39;24:38;77:16;74:1;67:27;5:2;1142:19:0;;;;;;;13:2:-1;8:3;5:11;2:2;;;29:1;26;19:12;2:2;1142:19:0;;;;;;;;;;;;;;;;1123:16;:38;;;;1218:7;1199:16;;:26;1171:25;:54;;;;1291:7;1263:25;;:35;1235:25;:63;;;;1335:5;1308:24;;:32;;;;;;;;;;;;;;;;;;1377:5;1350:24;;:32;;;;;;;;;;;;;;;;;;819:570;;;50:3756;;;;;;","source":"pragma solidity ^0.5.0;\n\nimport \"./IMarket.sol\";\n\ncontract CharityChallenge {\n\n    event Received(address indexed sender, uint256 value);\n\n    event Donated(address indexed npo, uint256 value);\n\n    event Claimed(address indexed claimer, uint256 value);\n\n    event SafetyHatchClaimed(address indexed claimer, uint256 value);\n\n    address payable public contractOwner;\n\n    address payable public npoAddress;\n\n    address public marketAddress;\n\n    IMarket market;\n\n    uint256 public challengeEndTime;\n\n    uint256 public challengeSafetyHatchTime1;\n\n    uint256 public challengeSafetyHatchTime2;\n\n    bool public isEventFinalizedAndValid;\n\n    bool public hasChallengeAccomplished;\n\n    bool private safetyHatchClaimSucceeded;\n\n    mapping(address => uint256) public donorBalances;\n\n    uint256 public donorCount;\n\n    constructor(\n        address payable _contractOwner,\n        address payable _npoAddress,\n        address _marketAddress\n    ) public\n    {\n        contractOwner = _contractOwner;\n        npoAddress = _npoAddress;\n        marketAddress = _marketAddress;\n        market = IMarket(_marketAddress);\n        challengeEndTime = market.getEndTime();\n        challengeSafetyHatchTime1 = challengeEndTime + 30 days;\n        challengeSafetyHatchTime2 = challengeSafetyHatchTime1 + 30 days;\n        isEventFinalizedAndValid = false;\n        hasChallengeAccomplished = false;\n    }\n\n    function() external payable {\n        require(now <= challengeEndTime);\n        require(msg.value > 0);\n        if (donorBalances[msg.sender] == 0 && msg.value > 0) {\n          donorCount++;\n        }\n        donorBalances[msg.sender] += msg.value;\n        emit Received(msg.sender, msg.value);\n    }\n\n    function balanceOf(address _donorAddress) public view returns (uint256) {\n        if (safetyHatchClaimSucceeded) {\n            return 0;\n        }\n        return donorBalances[_donorAddress];\n    }\n\n    function finalize() external {\n        require(now > challengeEndTime);\n        require(now <= challengeSafetyHatchTime1);\n        require(!isEventFinalizedAndValid);\n\n        bool hasError;\n        (hasChallengeAccomplished, hasError) = checkAugur();\n        if (!hasError) {\n            if (hasChallengeAccomplished) {\n                uint256 totalContractBalance = address(this).balance;\n                npoAddress.transfer(address(this).balance);\n                emit Donated(npoAddress, totalContractBalance);\n            }\n            isEventFinalizedAndValid = true;\n        }\n    }\n\n    function claim() external {\n        require(now > challengeEndTime);\n        require(isEventFinalizedAndValid || now > challengeSafetyHatchTime1);\n        require(!hasChallengeAccomplished || now > challengeSafetyHatchTime1);\n        require(balanceOf(msg.sender) > 0);\n\n        uint256 claimedAmount = balanceOf(msg.sender);\n        msg.sender.transfer(claimedAmount);\n        donorBalances[msg.sender] = 0;\n        emit Claimed(msg.sender, claimedAmount);\n    }\n\n    function safetyHatchClaim() external {\n        require(now > challengeSafetyHatchTime2);\n        require(msg.sender == contractOwner);\n\n        uint totalContractBalance = address(this).balance;\n        contractOwner.transfer(address(this).balance);\n        safetyHatchClaimSucceeded = true;\n        emit SafetyHatchClaimed(contractOwner, totalContractBalance);\n    }\n\n    function checkAugur() private view returns (bool happened, bool errored) {\n        if (market.isFinalized()) {\n            if (market.isInvalid()) {\n                return (false, true);\n            } else {\n                uint256 no = market.getWinningPayoutNumerator(0);\n                uint256 yes = market.getWinningPayoutNumerator(1);\n                return (yes > no, false);\n            }\n        } else {\n            return (false, true);\n        }\n    }\n}\n","compiler":{"name":"solc","version":"0.5.0+commit.1d4f565a.Emscripten.clang"},"schemaVersion":"3.0.2"};