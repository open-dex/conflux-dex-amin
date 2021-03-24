const axios = require('axios')
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
    { name: 'burn', type: 'bool' },
    { name: 'nonce', type: 'uint256' },
]
const withdrawCrossChainRequest = [
    { name: 'userAddress', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'recipient', type: 'string' },
    { name: 'defiRelayer', type: 'address' },
    { name: 'fee', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
]
const transferRequest = [
    { name: 'userAddress', type: 'address' },
    { name: 'amounts', type: 'uint256[]' },
    { name: 'recipients', type: 'address[]' },
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

var templateWithdrawCrossChainRequestTypeData = {
    types: {
        EIP712Domain: domain,
        WithdrawRequest: withdrawCrossChainRequest
    },
    primaryType: "WithdrawRequest",
    domain: {},
    message: {}
};

var templateTransferRequestTypeData = {
    types: {
        EIP712Domain: domain,
        TransferRequest: transferRequest
    },
    primaryType: "TransferRequest",
    domain: {},
    message: {}
};

const orderURL = '/orders/';
const placeURL = 'place';
const cancelURL = '/cancel';
const commonURL = '/common';

// eslint-disable-next-line no-unused-vars
const getUser = '/users/';
const getCurrency = '/currencies/';
const withdraw = '/accounts/withdraw';
const getBoomflow = '/boomflow';
const transfer = '/accounts/transfer';

const OPCODE = {
    PlaceOrder: 0,
    Cancel: 1,
    Withdraw: 2,
    Transfer: 3,
    WithdrawCrossChain: 4,
}

axios.defaults.headers.post['Content-Type'] = 'application/json';

class OrderService {
    constructor (opts) {
        this.dexURL = opts.dexURL
    }

    async init(opts) {
        this.domain = {
            name: opts.name,
            version: opts.version,
            chainId: opts.chainId,
            verifyingContract: await this.getBoomflowAddress(),
        }
        templateTypeData.domain = this.domain
        templateCancelRequestTypeData.domain = this.domain
        
        if (opts.verbose) {
            this.verbose = opts.verbose
        }
    }

    getLocalBoomflow() {
        return this.domain.verifyingContract
    }

    setLocalBoomflow(boomflowAddr) {
        this.domain.verifyingContract = boomflowAddr
    }

    async getBoomflowAddress() {
        try {
            let response = await axios.get(this.dexURL + commonURL + getBoomflow);
            return response.data.data
        } catch (error) {
            if (this.verbose) { 
                console.error(error);
            }
        }
    }

    async getAssetAddress(name) {
        try {
            let response = await axios.get(this.dexURL + getCurrency + name);
            return response.data.data.contractAddress
        } catch (error) {
            console.error(error);
        }
    }

    getSystemTime() {
        return new Date().getTime()
    }

    async getOrder(orderId) {
        try {
            let response = await axios.get(this.dexURL + orderURL + orderId);
            return response.data.data
        } catch (error) {
            console.error(error);
        }
    }

    async dex2Chain(order, baseAssetAddress, quoteAssetAddress, nonce) { 
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

    async construct(order, baseAssetAddress, quoteAssetAddress, nonce, op) {
        var typeData = templateTypeData
        console.info('fee is ', order.fee)
        switch (op) {
            case OPCODE.PlaceOrder: {
                var blockchainOrder = await this.dex2Chain(order, baseAssetAddress, quoteAssetAddress, nonce, op)
                typeData.message = blockchainOrder
                break;
            }
            case OPCODE.Cancel:
                typeData = templateCancelRequestTypeData
                var blockchainOrder2 =  await this.dex2Chain(order, baseAssetAddress, quoteAssetAddress, order.timestamp, op)
                typeData.message = {
                    order: blockchainOrder2,
                    nonce: nonce
                }
                break;
            case OPCODE.Withdraw:
                typeData = templateWithdrawRequestTypeData;
                typeData.message = {
                    userAddress: order.userAddress,
                    amount: BN(order.amount).times(BN(1e18)).toFixed(),
                    recipient: order.recipient,
                    burn: order.burn,
                    relayContract: order.relayContract,
                    nonce: nonce,
                    fee: BN(order.fee).times(BN(1e18)).toFixed(),
                }

                typeData.domain = {
                    name: "CRCL",
                    version: "1.0",
                    chainId: this.domain.chainId,
                    verifyingContract: baseAssetAddress,
                }

                break;
            case OPCODE.WithdrawCrossChain:
                typeData = templateWithdrawCrossChainRequestTypeData
                typeData.message = {
                    userAddress: order.userAddress,
                    amount: BN(order.amount).times(BN(1e18)).toFixed(),
                    recipient: order.recipient,
                    defiRelayer: order.defiRelayer == null ? "0x0000000000000000000000000000000000000000" : order.defiRelayer,
                    fee: BN(order.fee).times(BN(1e18)).toFixed(),
                    nonce: nonce
                }
                
                typeData.domain = {
                    name: "CRCL",
                    version: "1.0",
                    chainId: this.domain.chainId,
                    verifyingContract: baseAssetAddress,
                }

                break;
            case OPCODE.Transfer:
                typeData = templateTransferRequestTypeData
                typeData.domain = {
                    name: "CRCL",
                    version: "1.0",
                    chainId: this.domain.chainId,
                    verifyingContract: baseAssetAddress,
                }
                
                var amounts = []
                for (let i = 0; i < order.amounts.length; i++) {
                    amounts.push(BN(order.amounts[i]).times(BN(1e18)).toFixed())
                }
                typeData.message = {
                    userAddress: order.userAddress,
                    amounts: amounts,
                    recipients: order.recipients,
                    nonce: nonce
                }
                break;
            default:
                throw new Error("Invalid Operation")
        }

        return typeData
    }

    async submit(order, timestamp, signature, clientOrderId=null) {
        try {
            var signedOrder = {
                address: order.address,
                product: order.product,
                type: order.type,
                side: order.side,
                price: order.price,
                amount: order.amount,
                feeAddress : order.feeAddress,
                feeRateTaker : order.feeRateTaker,
                feeRateMaker : order.feeRateMaker,
                timestamp: timestamp,
                signature: signature
            }

            if (clientOrderId) {
                signedOrder.clientOrderId = clientOrderId
            }

            let response = await axios.post(this.dexURL + orderURL + placeURL, signedOrder);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }

    async cancel(orderId, timestamp, signature) {
        try {
            let signedRequest = {
                timestamp: timestamp,
                signature: signature
            }
            if (this.verbose) {
                console.log(this.dexURL + orderURL + orderId + cancelURL)
            }
            let response = await axios.post(this.dexURL + orderURL + orderId + cancelURL, signedRequest);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }

    async withdraw(request, timestamp, signature) {
        try {
            let signedRequest = {
                userAddress: request.userAddress,
                currency: request.currency,
                amount : request.amount,
                recipient: request.recipient,
                burn: request.burn,
                relayContract: request.relayContract,
                timestamp: timestamp,
                signature: signature,
                fee: request.fee,
            }

            if (this.verbose) {
                console.log(this.dexURL + withdraw)
            }
            console.info('withdraw body : ', JSON.stringify(signedRequest), signedRequest);
            let response = await axios.post(this.dexURL + withdraw, signedRequest);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }

    async withdrawCrossChain(request, timestamp, signature) {
        try {
            let signedRequest = {
                userAddress: request.userAddress,
                currency: request.currency,
                amount : request.amount,
                recipient: request.recipient,
                fee: request.fee,
                timestamp: timestamp,
                signature: signature,
                relayContract: request.defiRelayer == null ? "0x0000000000000000000000000000000000000000" : request.defiRelayer
            }

            if (this.verbose) {
                console.log(this.dexURL + withdraw)
            }
            let response = await axios.post(this.dexURL + withdraw, signedRequest);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }

    async transfer(request, timestamp, signature) {
        try {
            var requests = {}
            for (let i = 0; i < request.recipients.length; i++) {
                requests[request.recipients[i]] = request.amounts[i];
            }

            let signedRequest = {
                userAddress: request.userAddress,
                currency: request.currency,
                recipients: requests,
                timestamp: timestamp,
                signature: signature
            }

            if (this.verbose) {
                console.log(this.dexURL + transfer)
            }
            let response = await axios.post(this.dexURL + transfer, signedRequest);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {
    OrderService: OrderService,
    OPCODE: OPCODE
};