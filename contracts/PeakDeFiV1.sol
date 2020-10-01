pragma solidity ^0.6.2;

import "@openzeppelin/contracts/proxy/Initializable.sol";
import "./ERC20.sol";


contract PeakDeFiV1 is ERC20, Initializable {
    function initialize(
        address admin,
        address minter
    ) public initializer {
        _initialize("PeakDeFi", "PEAK", 8);

        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, minter);
    }

    function mint(address recipient, uint256 amount) public {
        require(hasRole(MINTER_ROLE, _msgSender()), "mint: unauthorized call!");

        _mint(recipient, amount);
    }

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }
}