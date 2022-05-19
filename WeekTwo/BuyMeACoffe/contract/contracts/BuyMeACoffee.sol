//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BuyMeACoffee {
    address payable owner;
    
    event NewMemo(
        address indexed from,
        string message,
        string name,
        uint timestamp
    );

    struct Memo {
        address from;
        string message;
        string name;
        uint timestamp;
    }

    Memo[] memos;

    modifier onlyOwner(){
        require(owner == msg.sender, 'You cannot do this. Only the owner');
        _;
    }
    constructor() {
        owner = payable(msg.sender);    
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "can't buy a coffee for free");
        // Memo memory coffee= Memo(msg.sender, _message, _name, block.timestamp);
        memos.push(Memo(msg.sender, _message, _name, block.timestamp));
        emit NewMemo(msg.sender, _message, _name, block.timestamp);

    }

    function buyLargeCoffee(string memory _name, string memory _message) public payable {
        require(msg.value >= 0.003 ether, "That is not enough for a large coffee, pal");
        // Memo memory coffee= Memo(msg.sender, _message, _name, block.timestamp);
        memos.push(Memo(msg.sender, _message, _name, block.timestamp));
        emit NewMemo(msg.sender, _message, _name, block.timestamp);

    }
    
    function withdrawTips() public onlyOwner {
        require(owner.send(address(this).balance));
    }
    

    function changeWithdrawAddress(address payable newOwner) public onlyOwner{
            owner = newOwner;
    }
}
