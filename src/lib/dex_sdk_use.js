const {OrderService, OPCODE} = require('./dex_sdk');
import confluxPortal from '../lib/conflux-portal'
import {store} from '../router/store'

export async function withdraw(dexUrl, {currency, fee, amount, burn, relayContract, recipient, user}) {
    var orderService = new OrderService({dexURL: dexUrl});
    let portalAccount = user || store.account;
    // More info about getStatus(): https://developer.conflux-chain.org/docs/js-conflux-sdk/javascript_sdk/#confluxprototypegetstatus
    await orderService.init({
        name: "Boomflow",                                   // Contract name
        version: "1.0",                                     // Contract version
        chainId: 1//(await cfx.getStatus()).chainId,           // Chain ID
    });
    console.log("Current Boomflow Address:", await orderService.getLocalBoomflow());


    const requestWithCurrency = {
        userAddress: portalAccount,
        currency: currency,
        amount: amount,
        recipient: recipient,
        burn: burn,
        fee: fee,
        relayContract: relayContract,
        defiRelayer: relayContract
    };

    // Get timestamp
    let timestamp3 = await orderService.getSystemTime();

    // Get asset addresses
    let assetAddress = await orderService.getAssetAddress(requestWithCurrency.currency)

    let op = burn ? OPCODE.WithdrawCrossChain : OPCODE.Withdraw;
    op = currency === 'CFX' ? OPCODE.Withdraw : op
    let typeData3 = await orderService.construct(requestWithCurrency, assetAddress, "", timestamp3,
        op);

    return new Promise((resolve, reject)=> {
        confluxPortal.requestSign(typeData3, portalAccount, data => {
            console.info("sign typed data return ", data)
            orderService.withdraw(requestWithCurrency, timestamp3, data.result)
                .then(resolve)
        }, err => {
            reject(err)
        })
    });
}