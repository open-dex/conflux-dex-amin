<template>
    <div v-show="visibleRecordOrderDialog">
        <el-dialog title="Record orders" :visible.sync="visibleRecordOrderDialog">
            <div v-show="showInput">
                Input hashes/ids:
                <el-input type="textarea" v-model="inputLines" :rows="10"></el-input>
                <div class="mt6" v-show="recordedHash">
                    {{ recordedHash }}
                    <a target="_blank"
                       :href="'https://confluxscan.io/transactionsdetail/'+recordedHash">
                        Detail on conflux scan
                    </a>
                </div>
                <el-button class="mt6" @click="commit" type="primary" size="mini">Commit</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "RecordOrders",
    data() {
        return {
            showInput: true,
            inputLines: '',
            visibleRecordOrderDialog: false,
            recordedHash: ''
        }
    },
    methods: {
        show() {
            this.visibleRecordOrderDialog = true;
        },
        commit() {
            const arr = this.inputLines.split('\n').map(str=>str.trim())
                .filter(str=>str.length>0).join(',')
            if (arr.length === 0) {
                return;
            }
            const request = {
                command: 'recordOrders',
                comment: arr,
            };
            request.encodeType = 'system/encode';
            this.doCommand(request, 'system/recordOrders', (data)=>{
                this.recordedHash = data;
                this.$message.info('Executed.');
            })
        }
    },
    props: {
    }
}
</script>

<style scoped>
    .mt6{
        margin-top: 6px;
    }
</style>