<template>
    <div>
        <div>
            <el-form ref="form" :model="form" label-width="80px" :inline="true">
                <el-form-item label="Address">
                    <el-input v-model="form.address" @change="loadList" size="mini"
                              class="address" placeholder="0x"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" @click="loadList" :disabled="form.address.length === 0">Search Address</el-button>
                </el-form-item>
            </el-form>
            <el-form  label-width="80px"  inline>
                <el-form-item label="id">
                    <el-input size="mini" v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="loadById">Search Id</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData">
                <el-table-column property="id" label="ID" width="80px"></el-table-column>
                <el-table-column property="userId" label="Use Id" width="80px"></el-table-column>
                <el-table-column property="currency" label="Currency" width="100px"></el-table-column>
                <el-table-column property="holdString" label="Hold"></el-table-column>
                <el-table-column property="availableString" label="Available"></el-table-column>
                <el-table-column property="balanceString" label="balance"></el-table-column>
                <el-table-column property="status" label="Status"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Account",
        data(){
            return {
                tableData: [],
                form: {
                    address: '',
                    id: 0,
                }
            }
        },
        methods: {
            loadById() {
                this.rpc(`system/get-account-by-id`, {id: this.form.id}).then(data=>{
                    if (data === null) {
                        data = {id: this.form.id, name: 'NotFound'}
                    }
                    this.tableData = [data];
                    this.total = 1;
                })
            },
            loadList() {
                this.tableData = [];
                this.form.address && this.getRpc(`accounts/${this.form.address}?offset=0&limit=20`)
                    .then(data=>{
                        this.tableData = data.items;
                    })
            }
        },
        mounted() {
            this.SimpleEvent.$on('showAccounts', addr=>{
              this.form.address = addr
              this.loadList();
          })
        }
    }
</script>

<style scoped>
    .address{
        width: 600px;
    }
</style>