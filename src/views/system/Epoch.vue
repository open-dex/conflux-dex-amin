<template>
    <div>
        <el-button size="small" @click="load"><i class="el-icon-refresh"></i></el-button>
        ConfirmedEpoch: {{confirmedEpoch}}, PollEpochFrom: {{pollEpochFrom}}
    </div>
</template>

<script>
    export default {
        name: "Epoch",
        data() {
            return {
                confirmedEpoch: '-',
                pollEpochFrom: '-'
            }
        },
        methods: {
            load() {
                this.confirmedEpoch = 'Loading...';
                this.getRpc('system/event/confirmed-epoch').then(data=>{
                    this.confirmedEpoch = data;
                });
                this.pollEpochFrom = 'Loading...';
                this.getRpc('system/event/next-fetch-log-epoch').then(data=>{
                    this.pollEpochFrom = data;
                });
            }
        },
        mounted() {
            this.load();
        }
    }
</script>

<style scoped>

</style>