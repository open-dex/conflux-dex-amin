const BN = require('bignumber.js');
const domain = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
];

const order = [
    { name: 'userAddress', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'price', type: 'uint256' },
    { name: 'orderType', type: 'uint256' },
    { name: 'side', type: 'bool' },
    { name: 'salt', type: 'uint256' },
    { name: 'baseAssetAddress', type: 'address' },
    { name: 'quoteAssetAddress', type: 'address' },
    { name: 'feeAddress', type: 'address' },
    { name: 'makerFeePercentage', type: 'uint256' },
    { name: 'takerFeePercentage', type: 'uint256' },
]

const cancelRequest = [
    { name: 'order', type: 'Order' },
    { name: 'nonce', type: 'uint256' },
]

const withdrawRequest = [
    { name: 'userAddress', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'recipient', type: 'address' },
    { name: 'isCrosschain', type: 'bool' },
    { name: 'nonce', type: 'uint256' },
]


var templateTypeData = {
    types: {
        EIP712Domain: domain,
        Order: order
    },
    primaryType: "Order",
    domain: {},
    message: {}
};

var templateCancelRequestTypeData = {
    types: {
        EIP712Domain: domain,
        CancelRequest: cancelRequest,
        Order: order
    },
    primaryType: "CancelRequest",
    domain: {},
    message: {}
};

var templateWithdrawRequestTypeData = {
    types: {
        EIP712Domain: domain,
        WithdrawRequest: withdrawRequest
    },
    primaryType: "WithdrawRequest",
    domain: {},
    message: {}
};


export const OPCODE = {
    PlaceOrder: 0,
    Cancel: 1,
    Withdraw: 2,
    Transfer: 3,
}
export function init_domain(addr, networkId) {
    let domain = {
        name: 'Boomflow',
        version: '1.0',
        chainId: networkId,
        verifyingContract: addr
    }

    templateTypeData.domain = domain;
    templateCancelRequestTypeData.domain = domain;
}
function dex2Chain(order, baseAssetAddress, quoteAssetAddress, nonce) {
    return {
        userAddress: order.address,
        amount: BN(order.amount).times(BN(1e18)).toFixed(),
        price: order.type == "Limit" ? BN(order.price).times(BN(1e18)).toFixed() : 0,
        orderType: order.type == "Limit" ? 0 : 1,
        side: order.side == "Buy",
        salt: nonce,
        baseAssetAddress: baseAssetAddress,
        quoteAssetAddress: quoteAssetAddress,
        feeAddress: order.feeAddress,
        makerFeePercentage: BN(order.feeRateMaker).times(BN(1e18)).toFixed(),
        takerFeePercentage: BN(order.feeRateTaker).times(BN(1e18)).toFixed()
    }
}

function construct(order, baseAssetAddress, quoteAssetAddress, nonce, op, networkId) {
    var typeData = Object.assign({}, templateTypeData)

    switch (op) {
        case OPCODE.PlaceOrder: {
            var blockchainOrder = dex2Chain(order, baseAssetAddress, quoteAssetAddress, nonce, op)
            typeData.message = blockchainOrder
            break;
        }
        case OPCODE.Cancel: {
            typeData = templateCancelRequestTypeData
            var blockchainOrder2 = dex2Chain(order, baseAssetAddress, quoteAssetAddress, order.timestamp, op)
            typeData.message = {
                order: blockchainOrder2,
                nonce: nonce
            }
            break;
        }
        case OPCODE.Withdraw:
            typeData = templateWithdrawRequestTypeData
            typeData.domain = {
                name: "CRCL",
                version: "1.0",
                chainId: networkId,
                verifyingContract: baseAssetAddress,
            }
            typeData.message = {
                userAddress: order.userAddress,
                amount: BN(order.amount).times(BN(1e18)).toFixed(),
                recipient: order.recipient,
                isCrosschain: order.isCrosschain,
                relayContract: order.relayContract,
                nonce: nonce
            }
            break;
        default:
            throw new Error("Invalid Operation")
    }

    return typeData
}

export function placeOrder(order, baseAddr, quoteAddr, networkId) {
    let timestamp = new Date().getTime();
    let dexOrder = construct(order, baseAddr, quoteAddr, timestamp, OPCODE.PlaceOrder, networkId)
    console.log(`called place order`)
    return dexOrder
}