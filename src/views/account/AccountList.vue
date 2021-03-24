<template>
    <div>
        <el-form inline>
            <el-form-item label="id">
                <el-input size="mini" v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="loadById">Search</el-button>
            </el-form-item>
        </el-form>
        <el-button size="small" @click="loadList">
            <i class="el-icon-refresh"></i>
        </el-button>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[1, 2, 10, 20, 50, 100]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
        ></el-pagination>
        <el-table :data="tableData">
            <el-table-column property="id" label="ID" width="80px"></el-table-column>
            <el-table-column property="name" label="Name"></el-table-column>
            <el-table-column property="name" label="">
              <template slot-scope="d">
                <span @click="fireEvent('showOrders', d.row.name)">Orders</span>
                <span style="margin-left: 6px" @click="fireEvent('showAccounts', d.row.name)">Accounts</span>
              </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "AccountList",
        data(){
            return {
                form: {
                    id: 0
                },
                total: 0,
                tableData: [],
                offset: 0,
                limit: 10,
                page: 1,
            }
        },
        methods: {
            loadById() {
                this.rpc(`system/get-user-by-id?id=${this.form.id}`).then(data=>{
                    if (data === null) {
                        data = {id: this.form.id, name: 'NotFound'}
                    }
                    this.tableData = [data];
                    this.total = 1;
                })
            },
          fireEvent(what, addr) {
            this.SimpleEvent.$emit(what, addr)
          },
            handleSizeChange(val) {
                this.limit = val;
                this.loadList();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.loadList();
            },
            loadList() {
                this.offset = (this.page - 1) * this.limit;
                this.tableData = [];
                const request = {
                };
                this.rpc(`system/list-user?offset=${this.offset}&limit=${this.limit}`, request)
                    .then((data)=>{
                        this.tableData = data.items;
                        this.total = data.total;
                    })
            }
        },
        mounted() {
            this.loadList();
        }
    }
</script>

<style scoped>

</style>