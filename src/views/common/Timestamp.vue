<template>
    <div>
        Timestamp: {{dtStr(ms)}}
    </div>
</template>

<script>
    export default {
        name: "Timestamp",
        data() {
            return {
                ms: '--',
                timer: null
            }
        },
        methods: {
            dtStr(ms) {
                return ms;
            },
            fetchTime() {
                const that = this;
                this.getRpc('common/timestamp').then(data=>{
                    that.ms = data;
                })
            }
        },
        destroyed() {
            clearInterval(this.timer)
        },
        mounted() {
            this.timer = setInterval(this.fetchTime, 1000)
        }
    }
</script>

<style scoped>

</style>