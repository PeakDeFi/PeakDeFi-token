const { assert } = require('chai')
const { ether } = require('@openzeppelin/test-helpers')

const TokenProxy = artifacts.require('TokenProxy')
const PEAKDEFI_V1 = artifacts.require('PEAKDEFI_V1')
const PEAKDEFI_V2 = artifacts.require('PEAKDEFI_V2')

contract('PeakDefi Token', function (accounts) {
  const [ admin, minter, proxyAdmin, alice, bob ] = accounts

  before(async () => {
    this.logicInstance = await PEAKDEFI_V1.new({ from: admin })
    this.proxyInstance = await TokenProxy.new(
      this.logicInstance.address,
      proxyAdmin,
      '0x'
    )
    this.tokenInstance = await PEAKDEFI_V1.at(this.proxyInstance.address)
  })

  describe('Check initial values and init the token contract', () => {
    it('Checks the initial values of the contract', async () => {
      const name = await this.tokenInstance.name()
      const symbol = await this.tokenInstance.symbol()
      const decimals = await this.tokenInstance.decimals()

      assert.deepEqual(name, '')
      assert.deepEqual(symbol, '')
      assert.deepEqual(decimals.toString(), '0')
    })

    it('Init contact values', async () => {
      await this.tokenInstance.initialize(admin, minter)
    })

    it('Checks the values after init', async () => {
      const name = await this.tokenInstance.name()
      const symbol = await this.tokenInstance.symbol()
      const decimals = await this.tokenInstance.decimals()

      assert.deepEqual(name, 'PEAKDEFI')
      assert.deepEqual(symbol, 'PEAK')
      assert.deepEqual(decimals.toString(), '8')
    })
  })

  describe('Mint tokens and changed allowance before upgrading', () => {
    it('Mint tokens', async () => {
      let balance = await this.tokenInstance.balanceOf(alice)
      assert.deepEqual(balance.toString(), '0')

      await this.tokenInstance.mint(alice, ether('100'), { from: minter })

      balance = await this.tokenInstance.balanceOf(alice)
      assert.deepEqual(balance.toString(), ether('100').toString())
    })

    it('Approve tokens', async () => {
      let allowance = await this.tokenInstance.allowance(alice, bob)
      assert.deepEqual(allowance.toString(), '0')

      await this.tokenInstance.approve(bob, ether('50'), { from: alice })

      allowance = await this.tokenInstance.allowance(alice, bob)
      assert.deepEqual(allowance.toString(), ether('50').toString())
    })
  })

  describe('Deploy and upgrade token contract to V2', () => {
    it('Deploy and upgrade V2', async () => {
      this.logicInstance = await PEAKDEFI_V2.new({ from: admin })
      await this.proxyInstance.upgradeTo(this.logicInstance.address, { from: proxyAdmin })
      this.tokenInstance = await PEAKDEFI_V2.at(this.proxyInstance.address)
    })

    it('Check the contract initial values after upgrade', async () => {
      const name = await this.tokenInstance.name()
      const symbol = await this.tokenInstance.symbol()
      const decimals = await this.tokenInstance.decimals()

      assert.deepEqual(name, 'PEAKDEFI')
      assert.deepEqual(symbol, 'PEAK')
      assert.deepEqual(decimals.toString(), '8')
    })

    it('Check the balance and allowances after upgrade', async () => {
      const allowance = await this.tokenInstance.allowance(alice, bob)
      assert.deepEqual(allowance.toString(), ether('50').toString())
    })
  })

  describe('Use the new method of V2 token', () => {
    it('Called the new method', async () => {
      await this.tokenInstance.changeTokenData('NEW Peak DEFI', 'NPD', '10') // DON'T RECOMMENDED to change decimal of contract on production!

      const name = await this.tokenInstance.name()
      const symbol = await this.tokenInstance.symbol()
      const decimals = await this.tokenInstance.decimals()

      assert.deepEqual(name, 'NEW Peak DEFI')
      assert.deepEqual(symbol, 'NPD')
      assert.deepEqual(decimals.toString(), '10')
    })
  })
})