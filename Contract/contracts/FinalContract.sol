// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FinalContract is Ownable {
    struct Admin{
        string name;
        string addr; // Should Always be HASH

    }
    Admin[] private adminList;
    constructor( string memory _firstAdminName, string memory _firstAdminHash, address _initialOwner) Ownable(_initialOwner) {
        adminList.push(Admin({
            name: _firstAdminName,
            addr: _firstAdminHash
        }));
    }

    function _isAlreadyAdmin(string memory _addrHash) internal view returns (bool) {
        for (uint i = 0; i < adminList.length; i++) {
            if (keccak256(abi.encodePacked(adminList[i].addr)) == keccak256(abi.encodePacked(_addrHash))) {
                return true;
            }
        }
        return false;
    }


    function addAdmin(string memory _addrHash, string memory _senderAddr, string memory _name) public returns (bool) {
        if (msg.sender == owner()){
            if (_isAlreadyAdmin(_addrHash)) return false;

                adminList.push(Admin({
                    name: _name,
                    addr: _addrHash
                }));
                return true;
        }

        bool senderIsAdmin = false;
        for (uint i = 0; i < adminList.length; i++) {
            if (keccak256(abi.encodePacked(adminList[i].addr)) == keccak256(abi.encodePacked(_senderAddr))) {
                senderIsAdmin = true;
                break;
            }
        }
        if (!senderIsAdmin) return false;
        if (_isAlreadyAdmin(_addrHash)) return false;

        // Add new admin
        adminList.push(Admin({
            name: _name,
            addr: _addrHash
        }));

        return true;
    }
    
    function removeAdmin(string memory _removeAddrHash, string memory _adminAddrHash)public returns (bool){
                bool senderIsAdmin = false;
        for (uint i = 0; i < adminList.length; i++) {
            if (keccak256(abi.encodePacked(adminList[i].addr)) == keccak256(abi.encodePacked(_adminAddrHash))) {
                senderIsAdmin = true;
                break;
            }
        }
        if (!senderIsAdmin) return false;
        if (!_isAlreadyAdmin(_removeAddrHash)) return false;
        for (uint i = 0; i < adminList.length; i++) {
            if (keccak256(abi.encodePacked(adminList[i].addr)) == keccak256(abi.encodePacked(_removeAddrHash))) {
                adminList[i] = adminList[adminList.length - 1]; // Replace with last element
                adminList.pop(); // Remove last element
                return true;
            }
        }
        return false;

    }
    function verifyAdmin(string memory _addrHash) public view returns (bool) {
        return _isAlreadyAdmin(_addrHash);
    }

    function getAllAdminNames() public view returns (string[] memory) {

        string[] memory names = new string[](adminList.length);
        for (uint i = 0; i < adminList.length; i++) {
            names[i] = adminList[i].name;
        }
        return names;
    }
}