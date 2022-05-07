// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.6.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.6.0/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.6.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.6.0/utils/Counters.sol";

contract RoadToWeb3 is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;
    uint256 MAX_SUPPLY = 100000;
    uint256 MAX_TOKENS_PER_USER = 5;
    Counters.Counter private _tokenIdCounter;
    mapping(address => uint256) tokensPerUser;
    constructor() ERC721("RoadToWeb3", "RTW3") {}

    function safeMint(address to, string memory uri) public {
        require(_tokenIdCounter.current() <= MAX_SUPPLY, "We reached our cap");
        require(tokensPerUser[msg.sender] < MAX_TOKENS_PER_USER, "You minted enough. Let others mint too");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        tokensPerUser[msg.sender] = tokensPerUser[msg.sender] + 1;
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
