<template>
    <div class="container">
        <div>
            <el-button size="small" @click="loadList"><i class="el-icon-refresh"></i></el-button>
        </div>
        <div>
            <el-form inline>
                <el-form-item label="Address">
                    <el-input size="mini" style="width: 500px" v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" @click="add">Add</el-button>
                </el-form-item>
                <el-form-item>Items added from here are not persistent.</el-form-item>
            </el-form>
        </div>
        Market maker address:
        <el-table
                :data="tableData"
                stripe @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave"
                style="width: 100%">
            <el-table-column prop="address" label="address"></el-table-column>
            <el-table-column prop="" label="...">
                <template slot-scope="d">
                    <span @click="remove(d.row)">Delete</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

export default {
    name: "MarketMaker",
    data() {
        return {
            tableData: [],
            mouseOverRow: null,
            form: {
                address: ''
            }
        }
    },
    methods: {
        add() {
            this.rpc(`system/operate-prune-config?action=add&address=${this.form.address}`).then(() => {
                this.loadList()
            })
        },
        remove(v) {
            this.$confirm('Delete?', 'Confirm').then(() =>
                this.rpc(`system/operate-prune-config?action=remove&address=${v.address}`).then(() => {
                    this.loadList();
                })).catch()
        },

        cellMouseEnter(row) {
            this.mouseOverRow = row;
        },
        cellMouseLeave() {
            this.mouseOverRow = null;
        },
        loadList() {
            this.tableData = []
            this.rpc('system/operate-prune-config?action=show').then((data) => {
                this.tableData = data.marketmaker.map(addr => {
                    return {"address": addr};
                })
            })
        },

    },
    mounted() {
        this.loadList();
    }
}
</script>

<style scoped>
.container {
    height: 100%;
}

span:hover {
    background-color: black;
    color: white;
    cursor: pointer;
}
</style>