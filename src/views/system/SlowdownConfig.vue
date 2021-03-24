<template>
    <div>
        Set user id to 0 will disable the function.
        <el-form label-width="120px">
            <el-form-item label="slowDownUserId">
                <el-input size="mini" style="width: 200px" v-model="form.slowDownUserId"></el-input>
            </el-form-item>
            <el-form-item label="slowDownMS">
                <el-input size="mini" style="width: 200px" v-model="form.slowDownMS"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" size="mini" @click="set">Set</el-button>
            </el-form-item>
        </el-form>
        <div>{{message}}</div>
    </div>
</template>

<script>
export default {
    name: "SlowdownConfig",
    data() {
        return {
            form:{
                slowDownMS: '-',
                slowDownUserId: '-'
            },
            message: '',
        }
    },
    methods:{
        load() {
            this.message = "Loading..."
            this.rpc(`orders/set-slowdown?userId=-1&ms=0`).then(data=>{
                this.message = ""
                Object.assign(this.form, data)
            })
        },
        set() {
            this.message = "Pending..."
            this.rpc(`orders/set-slowdown?userId=${this.form.slowDownUserId}&ms=${this.form.slowDownMS}`).then(data=>{
                this.message = "OK"
                Object.assign(this.form, data)
            });
        }
    },
    mounted() {
        this.load()
    }
}
</script>

<style scoped>

</style>