<template>
  <div style="border: 0px solid black">
    Funds: {{name}}
    <span v-if="name === ''" @click="loadCurrency">Click to reload currency info</span>
    <el-tabs v-model="active">
<!--      Deposit-->
      <el-tab-pane name="Deposit" label="Deposit">
        <el-form label-width="120px"  label-position="top" size="mini">
          <el-form-item label="From ERC777 Token Contract">
            {{tokenAddr}}
          </el-form-item>
          <el-form-item label="To CRCL Contract">
            {{crclAddr}}
          </el-form-item>
          <el-form-item label="Available">
            {{depositAvailable}}
            <button @click="getErc20Balance(tokenAddr)"><el-icon class="el-icon-refresh"></el-icon></button>
          </el-form-item>
          <el-form-item label="Amount">
            <el-input-number v-model="depositAmount"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="deposit(tokenAddr)" size="mini">Deposit</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
<!--      Withdraw-->
      <el-tab-pane name="Withdraw" label="Withdraw">
        <el-form label-width="120px" label-position="top" size="mini">
          <el-form-item label="From CRCL Token Contract">
            {{crclAddr}}
          </el-form-item>
          <el-form-item label="To ERC777 Token Contract">
            {{tokenAddr}}
          </el-form-item>
          <el-form-item label="Available">
            {{withdrawAvailable}}
            <span @click="getDexBalance(crclAddr)"><el-icon class="el-icon-refresh"></el-icon></span>
          </el-form-item>
          <el-form-item label="Amount">
            <el-input-number v-model="withdrawAmount"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="withdraw" size="mini">Withdraw</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {format} from "js-conflux-sdk";
import BigNumber from "bignumber.js";
import {withdraw} from "@/lib/dex_sdk_use";

export default {
  name: "Funds",
  props:{
    currencyId:{      type:Number    },
  },
  data() {
    return {
      confluxJS:{},// from portal plugin
      active:'Deposit',
      name: '',
      tokenAddr:'-',
      crclAddr:'-',
      depositAvailable:0,
      depositAmount:1,
      withdrawAvailable:0,
      withdrawAmount:10,
    }
  },
  methods:{
    buildContract(name, abi, addr, networkId) {
      const contract = this.confluxJS.Contract({
        address: format.address(addr, networkId),
        abi: abi
      });
      return contract;
    },
    async withdraw() {
      let {accounts} = await this.preparePortal()
      let hexAddress = format.hexAddress(accounts[0]);
      let request = {currency: this.name, burn: this.name === 'CFX'
        , amount: this.withdrawAmount
        ,  cross: false, fee: 0,
        recipient: hexAddress,
        user: hexAddress
      };
      withdraw(this.store.host, request).then(data=>{
        if (data.success) {
          this.$message("Withdraw request is sent!");
          return;
        }
        this.$message(data.message)
      }).catch(err=>{
        this.$message(err.message)
      });
    },
    async deposit(erc20addr) {
      let {accounts, networkId} = await this.preparePortal()
      let abi = [
          {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "send",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "holder",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "recipient",
              "type": "bytes"
            }
          ],
          "name": "depositFor",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        }
      ]
      let cc = this.buildContract('erc20', abi, erc20addr, networkId)
      let hexAddress = format.hexAddress(accounts[0]);
      let bytes = new Buffer(hexAddress.substr(2), 'hex')
      let drip = new BigNumber(this.depositAmount).multipliedBy(new BigNumber(1e+18)).toNumber();
      let sendCfx = (this.name === 'CFX' ? drip : 0);
      console.log(`contract addr:`,erc20addr, 'recipient hex ', hexAddress, 'send cfx value', sendCfx)
      let method = (sendCfx ? cc.depositFor(this.crclAddr, bytes) : cc.send(this.crclAddr, drip, bytes))
      method.sendTransaction({
        from: accounts[0],
        value: sendCfx,
        // gasPrice: 1, gas:21000,
      }).executed().then(rpc=>{//
        console.log(`executed:`, rpc)
        this.$message(`Deposit executed.`)
      }).catch(err=>{
        console.log(`deposit fail:`, err)
      });
    },
    async preparePortal(){
      // https://conflux-portal-docs.conflux-chain.org/docs/portal/Main_Concepts/accessing_accounts
      // Code here is just a demo, and should be improved more before using in production.
      // Developer should read the following docs.
      // https://github.com/Conflux-Chain/conflux-portal/tree/develop/test/e2e/contract-test/
      await window.conflux.enable()
      const accounts = await window.conflux.send({method: 'cfx_accounts'})
      let networkId = parseInt(window.conflux.networkId || window.conflux.chainId);
      console.log(`current user ${accounts[0]}, network id ${networkId}`)
      return {networkId, accounts}
    },
    async getDexBalance() {
      let {accounts} = await this.preparePortal()
      let addr = accounts[0]
      this.getRpc(`accounts/${addr}/${this.name}`).then(data=>{
        this.withdrawAvailable = data.available
      })
    },
    async getErc20Balance(erc20addr) {
      let {accounts, networkId} = await this.preparePortal()
      if (this.name === 'CFX') {
        const ban = await window.conflux.send('cfx_getBalance',[accounts[0]])
        const bigBan = new BigNumber(ban).div(1e+18)
        this.depositAvailable = bigBan
        console.log(`ban`)
        return
      }
      let abi = [{
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "tokenHolder",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }]
      console.log(`contract addr:`,erc20addr)
      let cc = this.buildContract('erc20', abi, erc20addr, networkId)
      cc.balanceOf(accounts[0]).then(rpc=>{
        let ban = new BigNumber(rpc).div(1e+18);
        this.depositAvailable = ban
        console.log(`call balance of ret:`, ban.toString());
      }).catch(err=>{
        console.log(`call balance of fail:`, err)
      })
    },
    loadCurrency() {
      if (this.currencyId === 0) {
        return
      }
      this.getRpc(`currencies/${this.currencyId}`).then(cc=>{
        this.tokenAddr = cc.tokenAddress
        this.crclAddr = cc.contractAddress
        this.name = cc.name
      });
    }
  },
  mounted() {
    this.loadCurrency()
    this.confluxJS = window.confluxJS
  }
}
</script>

<style scoped>

</style>