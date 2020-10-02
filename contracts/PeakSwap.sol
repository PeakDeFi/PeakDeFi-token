pragma solidity ^0.6.2;

import "./IPeakDeFi.sol";


contract PeakTokenSwap {
    address public wallet;
	IPeakDeFi public fromERC20;
	IPeakDeFi public toERC20;

	event TokenSwap(
		address indexed owner,
		address fromERC20,
		address toERC20,
		uint256 balance
	);

	constructor(
        address _wallet,
		address _fromERC20,
		address _toERC20
	)
		public
	{
        wallet = _wallet;
		fromERC20 = IPeakDeFi(_fromERC20);
		toERC20 = IPeakDeFi(_toERC20);
	}

	function swap() external {
		// Send and lock the old tokens to this contract
		uint256 balance = fromERC20.balanceOf(msg.sender);
        uint256 availableAllowance = toERC20.allowance(wallet, address(this));

        // Validate balances and allowances before transfer
		require(balance > 0, "swap: No tokens to transfer!");
		require(availableAllowance >= balance, "swap: Not enough new tokens to transfer!");

        // Receive and burn old tokens
		require(fromERC20.transferFrom(msg.sender, address(this), balance));
		fromERC20.burn(balance);

        // Transfer new tokens to sender
		require(toERC20.transferFrom(wallet, msg.sender, balance));

		emit TokenSwap(msg.sender, address(fromERC20), address(toERC20), balance);
	}
}