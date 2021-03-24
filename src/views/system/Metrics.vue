<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="changeTag">
            <el-tab-pane name="timers" label="Timers" @click="loadList(0)">
                Timers:{{tableData.timers.length}}
                <el-button size="small" @click="loadList('timers')"><i class="el-icon-refresh"/></el-button>
                <el-table
                        :data="tableData.timers"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="entry" label="entry" ></el-table-column>
                    <el-table-column prop="count" label="count" ></el-table-column>
                    <el-table-column prop="oneMinuteRate" label="oneMinuteRate" ></el-table-column>
                    <el-table-column prop="fiveMinuteRate" label="fiveMinuteRate" ></el-table-column>
                    <el-table-column prop="fifteenMinuteRate" label="fifteenMinuteRate" ></el-table-column>
                    <el-table-column prop="meanRate" label="meanRate" ></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="meters" label="Meters">
                Meters: {{tableData.meters.length}}
                <el-button size="small" @click="loadList('meters')"><i class="el-icon-refresh"/></el-button>
                <el-table
                        :data="tableData.meters"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="entry" label="entry" ></el-table-column>
                    <el-table-column prop="count" label="count" ></el-table-column>
                    <el-table-column prop="oneMinuteRate" label="oneMinuteRate" ></el-table-column>
                    <el-table-column prop="fiveMinuteRate" label="fiveMinuteRate" ></el-table-column>
                    <el-table-column prop="fifteenMinuteRate" label="fifteenMinuteRate" ></el-table-column>
                    <el-table-column prop="meanRate" label="meanRate" ></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="counters" label="Counters">
                Counters: {{tableData.counters.length}}
                <el-button size="small" @click="loadList('counters')"><i class="el-icon-refresh"/></el-button>
                <el-table
                        :data="tableData.counters"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="entry" label="entry" ></el-table-column>
                    <el-table-column prop="count" label="count" ></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="gauges" label="Gauges">
                Gauges: {{tableData.gauges.length}}
                <el-button size="small" @click="loadList('gauges')"><i class="el-icon-refresh"/></el-button>
                <el-table
                        :data="tableData.gauges"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="entry" label="entry" ></el-table-column>
                    <el-table-column prop="" label="" >
                        <template slot-scope="d">
                            {{d.row.value}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="histograms" label="Histograms">
                Histograms: {{tableData.histograms.length}}
                <el-button size="small" @click="loadList('histograms')"><i class="el-icon-refresh"/></el-button>
                <el-table
                        :data="tableData.histograms"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="entry" label="entry" ></el-table-column>
                    <el-table-column prop="count" label="count" width="80px"></el-table-column>
                    <el-table-column prop="snapshot.min" label="min"  width="80px"></el-table-column>
                    <el-table-column prop="snapshot.max" label="max"  width="80px"></el-table-column>
                    <el-table-column prop="snapshot.mean" label="mean"  width="180px"></el-table-column>
                    <el-table-column prop="snapshot.median" label="median"  width="80px"></el-table-column>
                    <el-table-column prop="snapshot.stdDev" label="stdDev"  width="180px"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="metrics" label="Queue">
                Queue: {{tableData.queue.length}}
                <el-button size="small" @click="loadList('metrics')"><i class="el-icon-refresh"/></el-button>
                <el-table
                        :data="tableData.queue"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="entry" label="entry" ></el-table-column>
                    <el-table-column prop="size" label="size" ></el-table-column>
                    <el-table-column prop="" label="queue" >
                        <template slot-scope="d">
                            <div>count:{{d.row.enqueue.count}}</div>
                            <div>oneMinuteRate:{{d.row.enqueue.oneMinuteRate}}</div>
                            <div>fiveMinuteRate:{{d.row.enqueue.fiveMinuteRate}}</div>
                            <div>fifteenMinuteRate:{{d.row.enqueue.fifteenMinuteRate}}</div>
                            <div>meanRate:{{d.row.enqueue.meanRate}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="dequeue" >
                        <template slot-scope="d">
                            <div>count:{{d.row.dequeue.count}}</div>
                            <div>oneMinuteRate:{{d.row.dequeue.oneMinuteRate}}</div>
                            <div>fiveMinuteRate:{{d.row.dequeue.fiveMinuteRate}}</div>
                            <div>fifteenMinuteRate:{{d.row.dequeue.fifteenMinuteRate}}</div>
                            <div>meanRate:{{d.row.dequeue.meanRate}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "Metrics",
        data() {
            return {
                activeName: 'timers',
                entries: [ 'timers', 'meters', 'counters', 'gauges', 'histograms', 'metrics' ],
                tableData: {
                    timers: [],
                    meters: [],
                    counters: [],
                    gauges: [],
                    histograms: [],
                    queue: [],
                },
            }
        },
        methods:{
            changeTag(tab) {
                console.info(tab.name);
                this.loadList(tab.name)
            },
            loadList(entry) {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.getRpc(`system/metrics-rest/${entry}`).then(json=>{
                    let data = Object.keys(json).map(k=>{
                        let obj = json[k];
                        // console.info('k is ', k, 'obj is ', obj);
                        obj.entry = k;
                        return obj;
                    });
                    if (entry === 'metrics') {
                        // filter queue
                        data = data.filter(d=>d.entry.includes('queue'))
                        entry = 'queue';
                    }
                    this.tableData[entry] = data;
                }).finally(()=>{
                    loading.close()
                })
            }
        },
        mounted() {
            // this.entries.forEach((k, i)=>this.loadList(i))
        }
    }
</script>

<style scoped>

</style>