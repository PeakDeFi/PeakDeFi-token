const TokenProxy = artifacts.require('TokenProxy')
const PEAKDEFI_V1 = artifacts.require('PEAKDEFI_V1')

module.exports = (deployer, network, accounts) => {
    const [ admin, minter, proxyAdmin ] = accounts
    deployer.then(async () => {
        let tokenInstance = await deployer.deploy(PEAKDEFI_V1)
        const proxyInstance = await deployer.deploy(TokenProxy, tokenInstance.address, proxyAdmin, '0x')

        tokenInstance = await PEAKDEFI_V1.at(proxyInstance.address)
        tokenInstance.initialize(admin, minter)
    })
}