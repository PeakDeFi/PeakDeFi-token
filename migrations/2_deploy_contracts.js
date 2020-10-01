const TokenProxy = artifacts.require('TokenProxy')
const PeakDeFiV1 = artifacts.require('PeakDeFiV1')

module.exports = (deployer, network, accounts) => {
    const [ admin, minter, proxyAdmin ] = accounts
    deployer.then(async () => {
        const tokenInstance = await deployer.deploy(PeakDeFiV1)
        const proxyInstance = await deployer.deploy(TokenProxy, tokenInstance.address, proxyAdmin, '0x')
    })
}