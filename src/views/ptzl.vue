<template>
  <!-- 实时供水数据 -->
  <div class="grid grid-cols-6 gap-4 mb-6">
        <div v-for="(stat, index) in statistics" :key="index" class="bg-white p-4 rounded-lg shadow-sm">
            <div class="text-sm text-gray-500">{{ stat.label }}</div>
            <div class="mt-1 text-2xl font-semibold">{{ stat.value }}</div>
            <div class="text-sm" :class="stat.trend === 'up' ? 'text-green-500' : 'text-red-500'">
                <el-icon v-if="stat.trend === 'up'">
                    <ArrowUp />
                </el-icon>
                <el-icon v-else>
                    <ArrowDown />
                </el-icon>
                {{ stat.change }}
            </div>
        </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
        <!-- 公告通知 -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium">公告通知</h3>
                <el-button type="primary" text>查看更多</el-button>
            </div>
            <el-timeline>
                <el-timeline-item v-for="(notice, index) in notices" :key="index" :timestamp="notice.date"
                    placement="top">
                    <div class="text-sm">{{ notice.title }}</div>
                </el-timeline-item>
            </el-timeline>
        </div>
        <!-- 工单统计 -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium">工单统计</h3>
                <el-button type="primary" text>查看更多</el-button>
            </div>
            <div class="space-y-4">
                <div v-for="(ticket, index) in workOrders" :key="index"
                    class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <div class="flex items-center space-x-3">
                        <div :class="['w-2 h-2 rounded-full', ticket.statusColor]"></div>
                        <div>
                            <div class="text-sm font-medium">{{ ticket.title }}</div>
                            <div class="text-xs text-gray-500">{{ ticket.time }}</div>
                        </div>
                    </div>
                    <el-tag :type="ticket.type" size="small">{{ ticket.status }}</el-tag>
                </div>
            </div>
        </div>
        <!-- 快捷服务 -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium mb-4">我的应用</h3>
            <div class="grid grid-cols-3 gap-4">
                <div v-for="(service, index) in quickServices" :key="index"
                    class="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <el-icon :size="24" :class="service.iconColor">
                        <component :is="service.icon" />
                    </el-icon>
                    <span class="mt-2 text-sm">{{ service.name }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 趋势图表 -->
    <div class="grid grid-cols-2 gap-6 mb-6" style="margin-top: 30px;">
        <!-- 供水趋势图表 -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium mb-4">供水趋势分析</h3>
            <div ref="chartRef" style="height: 400px"></div>
        </div>
        <!-- 系统访问趋势图表 -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium mb-4">系统访问统计</h3>
            <div ref="visitChartRef" style="height: 400px"></div>
        </div>
    </div>
    
    <footer class="bg-white">
            <div class="px-6 py-8">
                <div class="grid grid-cols-4 gap-8">
                    <div>
                        <h4 class="text-lg font-medium mb-4">关于我们</h4>
                        <p class="text-sm text-gray-500">
                            智慧供水管理平台致力于为城市供水提供智能化解决方案，实现供水管理的数字化转型。
                        </p>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium mb-4">联系方式</h4>
                        <div class="space-y-2 text-sm text-gray-500">
                            <p>电话：400-888-8888</p>
                            <p>邮箱：support@water.com</p>
                            <p>地址：北京市朝阳区科技园区88号</p>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium mb-4">服务支持</h4>
                        <div class="space-y-2 text-sm text-gray-500">
                            <p>常见问题</p>
                            <p>使用指南</p>
                            <p>技术支持</p>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium mb-4">关注我们</h4>
                        <div class="flex space-x-4">
                            <el-icon :size="24">
                                <Message />
                            </el-icon>
                            <el-icon :size="24">
                                <Service />
                            </el-icon>
                            <div
                                class="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-5 shadow-2xl cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 flex items-center justify-center z-50">
                                <div class="absolute w-full h-full rounded-full bg-white opacity-20 animate-ping">
                                </div>
                                <el-icon :size="28" class="relative">
                                    <Connection />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                    © 2024 智慧供水管理平台 版权所有
                </div>
            </div>
    </footer>
</template>
<script lang="ts" setup>
//首页
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { User, ArrowUp, ArrowDown, Message, Service, Fold, Expand, Monitor, DataLine, Warning, DataAnalysis, Management, Setting, HomeFilled, Connection, Platform } from '@element-plus/icons-vue';

const workOrders = ref([
    {
        title: '管网压力异常报警处理',
        time: '10分钟前',
        status: '待处理',
        type: 'danger',
        statusColor: 'bg-red-500'
    },
    {
        title: '水质检测设备维护',
        time: '30分钟前',
        status: '处理中',
        type: 'warning',
        statusColor: 'bg-yellow-500'
    },
    {
        title: '小区供水管网更换',
        time: '2小时前',
        status: '已完成',
        type: 'success',
        statusColor: 'bg-green-500'
    },
    {
        title: '泵站设备检修',
        time: '4小时前',
        status: '已完成',
        type: 'success',
        statusColor: 'bg-green-500'
    }
]);
const statistics = ref([
    { label: '实时供水量', value: '12,458 m³', trend: 'up', change: '5.2%' },
    { label: '管网压力', value: '0.6 MPa', trend: 'up', change: '2.1%' },
    { label: '水质达标率', value: '99.9%', trend: 'up', change: '0.3%' },
    { label: '管网漏损率', value: '3.2%', trend: 'down', change: '0.5%' },
    { label: '设备在线率', value: '98.7%', trend: 'up', change: '0.2%' },
    { label: '数据异常率', value: '0.8%', trend: 'down', change: '0.3%' }
]);
const notices = ref([
    { date: '2024-01-15', title: '关于春节期间供水保障工作的通知' },
    { date: '2024-01-12', title: '2024年度供水管网改造工程项目公告' },
    { date: '2024-01-10', title: '智慧供水平台系统升级维护通知' },
    { date: '2024-01-08', title: '关于开展居民用水满意度调查的通知' }
]);
const quickServices = ref([
    { name: '物联网平台', icon: Monitor, iconColor: 'text-blue-500' },
    { name: '数据中台', icon: DataLine, iconColor: 'text-green-500' },
    { name: '漏损控制系统', icon: Warning, iconColor: 'text-purple-500' },
    { name: '工程管理系统', icon: DataAnalysis, iconColor: 'text-orange-500' },
    { name: '网格化管理系统', icon: Management, iconColor: 'text-red-500' },
    { name: '供水单元管理系统', icon: Setting, iconColor: 'text-indigo-500' }
]);
const chartRef = ref<HTMLElement>();
const visitChartRef = ref<HTMLElement>();
onMounted(() => {
    // 供水趋势图表
    const chart = echarts.init(chartRef.value!);
    const option = {
        animation: false,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['供水量', '用水人数']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']
        },
        yAxis: [
            {
                type: 'value',
                name: '供水量(m³)',
                position: 'left'
            },
            {
                type: 'value',
                name: '用水人数',
                position: 'right'
            }
        ],
        series: [
            {
                name: '供水量',
                type: 'line',
                smooth: true,
                data: [920, 832, 951, 934, 1290, 1530, 1220, 1100]
            },
            {
                name: '用水人数',
                type: 'line',
                smooth: true,
                yAxisIndex: 1,
                data: [150, 165, 260, 220, 232, 301, 234, 190]
            }
        ]
    };
    chart.setOption(option);
    // 系统访问趋势图表
    const visitChart = echarts.init(visitChartRef.value!);
    const visitOption = {
        animation: false,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['访问人数', '访问次数']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['供水服务一部', '供水服务二部', '供水管理部', '建设管理部', '供水调度部', '加压总站', '污水污泥监测部', '知识城分中心']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '访问人数',
                type: 'line',
                smooth: true,
                data: [156, 142, 187, 198, 165, 124, 112, 145],
                itemStyle: {
                    color: '#409EFF'
                }
            },
            {
                name: '访问次数',
                type: 'line',
                smooth: true,
                data: [320, 282, 391, 454, 290, 230, 210, 325],
                itemStyle: {
                    color: '#67C23A'
                }
            }
        ]
    };
    visitChart.setOption(visitOption);
    window.addEventListener('resize', () => {
        chart.resize();
        visitChart.resize();
    });
});

</script>
<style scoped>
.el-timeline-item__content {
    cursor: pointer;
}

.el-timeline-item__content:hover {
    color: #409EFF;
}
</style>