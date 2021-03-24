<template>
    <div>
        <el-button size="small" @click="list">
            <i class="el-icon-refresh"></i>
        </el-button>
        <div>
            <el-form inline>
                <el-form-item label="Cache">
                    <el-tag size="small">{{selectedCache.name}}</el-tag>
                </el-form-item>
                <el-form-item label="Key">
                    <el-input size="small" v-model="inputKey" placeholder="Input search key"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click="getKeyInCache" type="primary" :disabled="inputKey.length === 0">Get</el-button>
                    <el-button size="small" @click="removeInCache" :disabled="inputKey.length === 0">Remove</el-button>
                </el-form-item>
            </el-form>
            <div>{{gotValue}}</div>
            <el-table
                    :data="tableData"
                    stripe @row-click="clickRow"
                    style="width: 100%">
                <el-table-column prop="name" label="Name" ></el-table-column>
                <el-table-column prop="status" label="Status"></el-table-column>
                <el-table-column prop="size" label="Size">
                    <template slot-scope="d">
                        <el-link @click="showKeys(d.row)" style="color: #409EFF">{{d.row.size}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="isEternal" label="Eternal" :formatter="fmtBool"></el-table-column>
                <el-table-column prop="maxEntriesInCache" label="Max Entries In Cache"></el-table-column>
                <el-table-column prop="maxEntriesLocalHeap" label="Max Entries Local Heap"></el-table-column>
                <el-table-column prop="persistence" label="Persistence" :formatter="fmtBool"></el-table-column>
                <el-table-column prop="hasPersistenceConfiguration" label="Has Persistence Configuration" :formatter="fmtBool"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CacheViewer",
        data() {
            return {
                json: {},
                tableData: [],
                selectedCache: {
                    name: ''
                },
                inputKey: '',
                gotValue: ''
            }
        },
        methods: {
            // eslint-disable-next-line no-unused-vars
            showKeys(row) {
                this.selectedCache = row;
                const h = this.$createElement;
                this.getRpc(`cache/ehcache/keys/${row.name}`).then(json=>{
                    this.$msgbox({
                        title: `View keys of ${row.name}`,
                        message: h('pre', json.join('\n'))
                    })
                });
            },
            clickRow(row) {
                this.selectedCache = row
            },
            removeInCache() {
                const body = {
                    key: this.inputKey,
                    cacheName: this.selectedCache.name,
                    command: 'remove',
                    encodeType: 'cache/ehcache/encode-remove',
                };
                this.rpc('cache/ehcache/remove', body).then(removed=>{
                    this.$notify({
                        title: 'Remove result',
                        message: removed ? 'Removed' : 'Not found',
                        type: removed ? 'success' : 'warning'
                    });
                    this.gotValue = ''
                    this.list();
                })
            },
            getKeyInCache() {
                this.doRequest('getQuiet', 'cache/ehcache/get-quiet')
            },
            doRequest(command, url, fn) {
                this.gotValue = 'Loading';
                const body = {
                    key: this.inputKey,
                    cacheName: this.selectedCache.name,
                    command
                }
                this.rpc(url, body).then(element=> {
                    if (fn) {
                        fn(element)
                    } else {
                        this.gotValue = element;
                    }
                })
            },
            // eslint-disable-next-line no-unused-vars
            fmtBool(row, column, cellValue, index) {
                // row, column, cellValue, index
                return `${cellValue}`
            },
            list() {
                this.getRpc('cache/ehcache/list').then(json=> {
                    this.json = json;
                    this.tableData = json.caches;
                    if (this.tableData.length > 0) {
                        this.selectedCache = this.tableData[0]
                    }
                })
            }
        },
        mounted() {
            this.list()
        }
    }
</script>

<style scoped>

</style>