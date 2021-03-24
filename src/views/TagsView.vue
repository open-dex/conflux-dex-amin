<template>
    <div class="tags-view-wrapper">
        <router-link class="tags-view-item" :to="item" :key="item.path"
                     :class="isActive(item)?'active':'inactive'" v-for="(item) in visitedTags">
            {{item.name}}
            <span class='el-icon-close' v-if="visitedTags.length>1"
                  @click.prevent.stop='closeSelectedTag(item)'></span>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "TagsView",
    data() {
        return {
            visitedTags:[],
            activePath: '',
        }
    },
    methods: {
        closeSelectedTag(item) {
            if (this.visitedTags.length === 1) {
                return;
            }
            const idx = this.visitedTags.indexOf(item);
            this.visitedTags.splice(idx, 1)
        },
        isActive(item) {
            return item.path === this.activePath
        },
        addTags() {
            const route=this.$route;
            if (route.path === '/' || route.path === '/layout') {
                return;
            }
            this.activePath = route.path;
            console.info('router is', route)
            let has = this.visitedTags.some(
                item => item.path === route.path
            );//打开标签后，判断数组中是否已经存在该路由
            if (!has) {
                this.visitedTags.push(
                    Object.assign(
                        {},
                        {
                            path: route.path,
                            name: route.name,
                            params: route.params
                        }
                    )
                );
            } //数组中路由存在不push ,单击左侧路由变化,点击标签路由变化均触发

        }
    },
    watch:{
        $route(){
            this.addTags();
        }//地址栏变化了就触发这个添加方法
    }
}
</script>

<style scoped>
    .active{
        background-color: lightgray;
        border: 1px solid gray;
        border-radius: 8px;
    }
    .inactive{
        /*background-color: lightgray;*/
    }
    .tags-view-wrapper{
        margin-right: 20px;
        /*margin: 6px;*/
        border-bottom: 1px solid #e6e6e6;
        /*background-color: lightgray;*/
    }
    a {
        text-decoration: none;
    }
</style>