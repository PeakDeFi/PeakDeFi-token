pragma solidity ^0.6.0;

/**
 * @dev Interface of the PEAKDEFI token (IERC20 + additional methods)
 */
interface IPeakDeFi {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    function mint(address recipient, uint256 amount) external returns (bool);
    function burn(uint256 amount) external;

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

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

	function swap(uint256 swapAmount) external {
        // Validate balances and allowances before transfer
		require(swapAmount > 0, "swap: No tokens to transfer!");

		// Send and lock the old tokens to this contract
        uint256 availableAllowance = toERC20.allowance(wallet, address(this));
		require(availableAllowance >= swapAmount, "swap: Not enough new tokens to transfer!");

        // Receive and burn old tokens
		require(fromERC20.transferFrom(msg.sender, address(this), swapAmount));
		fromERC20.burn(swapAmount);

        // Transfer new tokens to sender
		require(toERC20.transferFrom(wallet, msg.sender, swapAmount));

		emit TokenSwap(msg.sender, address(fromERC20), address(toERC20), swapAmount);
	}
}