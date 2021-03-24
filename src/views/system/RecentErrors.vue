<template>
    <div>
        Recent Errors:
        <el-button size="small" @click="loadList"><i class="el-icon-refresh"></i></el-button>
        <div v-for="(item, idx) in errors" :key="idx">{{item}}</div>
    </div>
</template>

<script>
    export default {
        name: "RecentErrors",
        data() {
            return {
                errors: []
            }
        },
        methods:{
            loadList() {
                this.errors = ['Loading'];
                this.getRpc('system/get-recent-errors').then(data=>{
                    this.errors = data;
                })
            }
        },
        mounted() {
            this.loadList();
          this.SimpleEvent.$on('loadErrors', this.loadList)
        }
    }
</script>

<style scoped>

</style>