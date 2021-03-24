<template>
  <el-tabs  v-model="activeName">
    <el-tab-pane name="main" label="Main">
      <div class="container">
        <div>
          <Epoch></Epoch>
        </div>
        <el-row>
          <el-col :span="4">
            Suspended:
            <span :style="{color : (suspended ? 'red' : 'green')}">
                    {{ suspended }}
                </span>
          </el-col>
          <el-col :span="8">
            Pause Source: {{ pauseSource || 'Not Paused' }}
          </el-col>
        </el-row>
        <div style="height: 10px"></div>
        <el-row>
          <el-col :span="8">
            <el-button @click="loadSuspended" size="small">
              <i class="el-icon-refresh">
              </i>
            </el-button>
            <el-button @click="resume" type="danger" round
                       :disabled="suspended === 'Loading' || !suspended"
                       size="small">Resume
            </el-button>
            <el-button @click="suspend('force')" type="primary"
                       :disabled="suspended === 'Loading' || !suspended"
                       size="small">Switch to Manual Suspend
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button size="small" @click="showRecordOrder">RecordOrders</el-button>
            <RecordOrders ref="recordOrderDialog"></RecordOrders>
          </el-col>
        </el-row>
        <div style="height: 10px"></div>
        <el-row>
          <el-col :span="6">
            <el-input label="Comment" v-model="comment" size="small">
              <template slot="prepend">Comment</template>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="suspend()" size="small" type="primary"
                       :disabled="suspended === 'Loading' || suspended">Suspend
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-input v-model="nonce" size="small" style="width: 100px; margin-right: 6px">
            </el-input>
            <el-button @click="setNonce()" size="small" type="primary"
            >SetNonce
            </el-button>
          </el-col>
        </el-row>
        <div v-if="debug">
          <div>{{ debugInfo }}</div>
          <div>{{ sign }}</div>
        </div>
        <RecentErrors></RecentErrors>
      </div>
    </el-tab-pane>
    <el-tab-pane name="CancelOrders" label="CancelOrders">
      <AdminCancelOrders></AdminCancelOrders>
    </el-tab-pane>
    <el-tab-pane name="diagnoseTradeOnChain" label="Diagnose-Trade-OnChain">
        <AdminTrade></AdminTrade>
    </el-tab-pane>
      <el-tab-pane name="DiagnoseOrderOnChain" label="Diagnose-Order-OnChain">
          <DiagnoseOrderOnChain></DiagnoseOrderOnChain>
      </el-tab-pane>
      <el-tab-pane name="CountByStatus" label="CountByStatus">
          <CountByStatus></CountByStatus>
      </el-tab-pane>
  </el-tabs>
</template>

<script>
    import RecentErrors from "./RecentErrors";
    import Epoch from "./Epoch";
    import RecordOrders from "@/views/system/RecordOrders";
    import AdminCancelOrders from "@/views/system/AdminCancelOrders";
    import AdminTrade from "@/views/system/AdminTrade";
    import DiagnoseOrderOnChain from "@/views/system/DiagnoseOrderOnChain";
    import CountByStatus from "@/views/system/CountByStatus";
    export default {
        name: "SystemAdmin",
        components: {
            CountByStatus,
            DiagnoseOrderOnChain, AdminTrade, AdminCancelOrders, RecordOrders, Epoch, RecentErrors},
        data() {
            return {
              activeName: 'main',
                suspended: 'Loading',
                debugInfo: '',
                comment: '',
                nonce: '',
                pauseSource: null,

                sign: '',
                debug: false,

            }
        },
        methods: {

            showRecordOrder() {
                this.$refs['recordOrderDialog'].show();
            },
            setNonce() {
                const request = {
                    command: 'setNonce',
                    encodeType: 'system/encode-update-admin',
                    nonce: this.nonce
                };
                this.doCommand(request, 'system/admin', this.postRpc)
            },
            suspend(comment = '') {
                if (comment.length > 0) {
                    this.comment = comment;
                }
                const request = {
                    command: 'dex.suspend',
                    comment: this.comment || 'Should suspend the world',
                };
                this.doCommand(request, 'system/suspend', this.postRpc)
            },
            postRpc(){
                this.$message.info('Command executed.');
                this.loadSuspended();
            },
            resume(){
                const request = {
                    command: 'dex.resume',
                    comment: 'resume'
                };
                this.doCommand(request, 'system/resume', this.postRpc)
            },
            loadSuspended() {
                this.suspended = 'Loading';
                this.getRpc('system/suspend').then(data=>{
                    this.suspended = data;
                })
                this.getRpc('system/get-pause-source').then(data=>{
                    this.pauseSource = data;
                })
              this.SimpleEvent.$emit('loadErrors')
            },
        },
        mounted() {
            this.loadSuspended();
        }
    }
</script>

<style scoped>
.container{
    width: 100%;
}
.border{
    border: 1px solid black;
}
</style>