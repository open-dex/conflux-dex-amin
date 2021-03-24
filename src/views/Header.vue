<template>
    <div class="header">
        V1021.Current host: <!--{{store.host}}-->
        <el-select v-model="host" placeholder="Select host"  @change="changeHost" class="hosts" size="small">
            <el-option
                    v-for="item in store.hosts"
                    :key="item.name"
                    :label="item.name + '   ' + item.url "
                    :value="item.url">
                <el-row :gutter="10">
                    <el-col :span="6">{{item.name}}</el-col>
                    <el-col :span="4">{{item.url}}</el-col>
                </el-row>
            </el-option>
        </el-select>
        <el-button size="small" style="border: 0px" @click="editHost"><i class="el-icon-edit"></i></el-button>
        <el-dialog :visible.sync="hostBoxVisible" title="Hosts" :destroy-on-close="true">
            <el-table :data="store.hosts">
                <el-table-column prop="name" label="Name"></el-table-column>
                <el-table-column prop="url" label="URL"></el-table-column>
                <el-table-column>
                    <template slot-scope="d">
                        <el-link style="color: dodgerblue" @click="removeHost(d.row)"><i class="el-icon-minus"></i> </el-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-divider></el-divider>
            <el-form v-model="addForm" inline="">
                <el-form-item label="Name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="URL">
                    <el-input v-model="addForm.url"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="addForm.name.length === 0 || addForm.url.length === 0"
                            @click="addHost" size="small" type="primary">Add</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-button @click="conn2portal" v-show="!account" size="mini">Connect to Conflux Portal</el-button>
        <span class="ml10" v-show="account">Portal Account: {{account}}</span>😊
        <span v-if="showPortalTip" class="error">
            Conflux Portal Not Detected!
        </span>
        <div style="float:right">
            <span>
                Expire At: {{expireAt}}
                <el-link @click="login">Login</el-link>
            </span>
        </div>
    </div>
</template>

<script>
    import confluxPortal from '../lib/conflux-portal'
    export default {
        name: "Header",
        data(){
            return {
                addForm: {
                    url: '',
                    name: ''
                },
                hostBoxVisible: false,
                account: '',
                host: this.store.host,
                expireAt: '',
                showPortalTip: typeof window.conflux === 'undefined'
            }
        },
        methods: {
            login() {
                const request = {
                    command: 'login',
                    comment: 'login request'
                }
                this.doCommand(request, 'system/login', data=>{
                    this.updateLoginInfo(data);
                    this.saveHosts();
                })
            },
            updateLoginInfo(token) {
                let host = this.store.hosts.filter(h => h.url === this.store.host)[0] || {};
                document.title = host.name || 'dex'
                if (token) {
                    host.authToken = token;
                }
                this.store.authToken = host.authToken;
                this.expireAt = 'NotSet'
                this.rpc('system/get-login-info').then(json=>{
                    const str = new Date(json.timestamp).Format("MM-dd hh");
                    this.expireAt = str;
                    console.info(`expired at ${str}`)
                })
            },
            saveHosts: function () {
                localStorage.setItem('hosts', JSON.stringify(this.store.hosts))
            },
            addHost() {
                this.store.hosts.push(Object.assign({}, this.addForm));
                this.saveHosts();
            },
            removeHost(h) {
                const idx = this.store.hosts.indexOf(h);
                if (idx >= 0) {
                    this.store.hosts.splice(idx, 1);
                    this.saveHosts()
                }
            },
            editHost() {
                this.hostBoxVisible = true;
            },
            async conn2portal(){
                await confluxPortal.enable()
                const account = confluxPortal.getAccount()
                this.account = account;
                this.store.account = account;
                // this.$message('Portal Connected.')
            },
            changeHost(v) {
                console.info('host is ', v);
                this.store.host = v;
                localStorage.setItem('selectedHost', v);
                this.updateLoginInfo();
            }
        },
        mounted() {
            if (!this.showPortalTip) {
                this.conn2portal();
            }
            const str = localStorage.getItem('hosts')
            if (str.length > 10) {
                //won't use a empty local storage.
                this.store.hosts = JSON.parse(str);
            }
            if (this.store.host) {
                this.updateLoginInfo();
            }
        }
    }
</script>

<style scoped>
    .hosts{
        width: 300px;
    }
    .ml10{
        margin-left: 10px;
    }
    .header{
        border-bottom: 1px solid #e6e6e6;
        padding-bottom: 2px;
    }
    .error{
        color: red;
    }
</style>