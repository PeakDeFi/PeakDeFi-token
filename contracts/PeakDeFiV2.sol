pragma solidity ^0.6.2;

import "./PeakDeFiV1.sol";


contract PeakDeFiV2 is PeakDeFiV1 {
    function changeTokenData(string calldata newName, string calldata symbol, uint8 newDecimal) external {
        _initialize(newName, symbol, newDecimal);
    }
}