<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 顶部导航 -->
        <header class="h-16 bg-[#1e88e5] shadow-sm fixed w-full top-0 z-50 flex items-center justify-between px-6">
            <div class="flex items-center">
                <el-icon class="text-xl cursor-pointer text-white/90 hover:text-white mr-3"
                    @click="isCollapse = !isCollapse">
                    <Fold v-if="!isCollapse" />
                    <Expand v-else />
                </el-icon>
                <img src="../assets/img/gz_logo.png" alt="统一信息门户" class="h-10 w-10 object-cover" style="height: 50px; width: 50px;border: 1px solid white;border-radius: 25px;">
                <h1 class="ml-3 text-xl font-medium text-white">水务可视化平台</h1>
            </div>
            <div class="flex items-center space-x-6">
                <el-icon class="text-xl cursor-pointer text-white/90 hover:text-white">
                    <FullScreen />
                </el-icon>
                <el-badge :value="3" class="cursor-pointer">
                    <el-icon class="text-xl text-white/90 hover:text-white">
                        <Bell />
                    </el-icon>
                </el-badge>
                <el-dropdown>
                    <span class="flex items-center cursor-pointer">
                        <img :src="avatarUrl" class="w-8 h-8 rounded-full object-cover">
                        <span class="ml-2 text-white">张琪</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </header>   
        <!-- 左侧菜单 -->
         <!-- <aside class="fixed"> -->
        <aside class="fixed left-0 top-16 bottom-0 bg-white shadow-sm overflow-y-auto transition-all duration-300"
            :class="isCollapse ? 'w-16' : 'w-64'">
            
            <el-menu :default-active="activeMenu" class="h-full" :collapse="isCollapse" style="display: block;" @select="handleSelect">
                <el-menu-item v-for="menu in menus" :key="menu.key" :index="menu.key">
                    <el-icon>
                        <component :is="menu.icon" />
                    </el-icon>
                    <span>{{ menu.label }}</span>
                </el-menu-item>
            </el-menu>
        </aside>
        <!-- 主内容区 -->       
        <main class="pt-16 p-6 transition-all duration-300" :class="isCollapse ? 'ml-16' : 'ml-64'">
            <template v-if="activeMenu === 'shujuyuan'">
                <div class="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-12">
                    <div v-for="db in dbList" :key="db.key" class="flex flex-col items-center cursor-pointer hover:bg-blue-50 rounded-lg p-6 shadow border border-gray-100" @click="openDialog(db)">
                        <img :src="db.icon" :alt="db.label" class="w-16 h-16 mb-2 object-contain" />
                        <span class="mt-2 text-base font-medium">{{ db.label }}</span>
                    </div>
                </div>
                <el-dialog v-model="dialogVisible" :title="dialogTitle" width="420px" @close="resetForm">
                    <el-form :model="form" label-width="90px">
                        <el-form-item label="数据源名称">
                            <el-input v-model="form.name" placeholder="请输入数据源名称" />
                        </el-form-item>
                        <el-form-item label="连接地址">
                            <el-input v-model="form.host" placeholder="请输入连接地址" />
                        </el-form-item>
                        <el-form-item label="端口">
                            <el-input v-model="form.port" placeholder="请输入端口" />
                        </el-form-item>
                        <el-form-item label="用户名">
                            <el-input v-model="form.username" placeholder="请输入用户名" />
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
                        </el-form-item>
                        <el-form-item label="数据库名">
                            <el-input v-model="form.dbname" placeholder="请输入数据库名" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button @click="testConnection">测试</el-button>
                        <el-button @click="resetForm">重置</el-button>
                        <el-button type="primary" @click="confirm">确认</el-button>
                        <el-button @click="dialogVisible = false">取消</el-button>
                    </template>
                </el-dialog>
            </template>
            <template v-else-if="activeMenu === 'shujuji'">
                <div class="mb-4 mt-6 flex gap-2">
                    <el-button type="primary" size="small" @click="addDialogVisible = true">新增</el-button>
                    <el-button type="warning" size="small">修改</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </div>
                <el-dialog v-model="addDialogVisible" title="新增数据集" width="400px" @close="resetAddForm">
                    <el-form :model="addForm" label-width="100px">
                        <el-form-item label="数据集名称">
                            <el-input v-model="addForm.name" placeholder="请输入数据集名称" />
                        </el-form-item>
                        <el-form-item label="数据源名称">
                            <el-input v-model="addForm.source" placeholder="请输入数据源名称" />
                        </el-form-item>
                        <el-form-item label="创建方式">
                            <el-radio-group v-model="addForm.mode">
                                <el-radio label="抽取">抽取</el-radio>
                                <el-radio label="实时">实时</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button @click="resetAddForm">重置</el-button>
                        <el-button type="primary" @click="confirmAdd">确认</el-button>
                        <el-button @click="addDialogVisible = false">取消</el-button>
                    </template>
                </el-dialog>
                <div class="flex gap-6">
                    <!-- 左侧目录树 -->
                    <div class="w-36 bg-white rounded shadow p-4">
                        <el-tree
                            :data="datasetTree"
                            :props="treeProps"
                            node-key="id"
                            default-expand-all
                            highlight-current
                            @node-click="handleTreeNodeClick"
                        />
                    </div>
                    <!-- 右侧数据集列表 -->
                    <div class="flex-1 bg-white rounded shadow p-4 overflow-x-auto">
                        <el-table :data="pagedDatasetList" border style="width: 100%">
                            <el-table-column type="selection" width="40" />
                            <el-table-column prop="index" label="序号" width="60" />
                            <el-table-column prop="name" label="数据集名称" width="120" />
                            <el-table-column prop="source" label="数据源名称" width="100" />
                            <el-table-column prop="createdAt" label="创建时间" width="110" />
                            <el-table-column prop="updatedAt" label="更新时间" width="110" />
                            <el-table-column prop="mode" label="创建方式" width="90" />
                            <el-table-column prop="enabled" label="是否启用" width="80">
                                <template #default="scope">
                                    <el-tag :type="scope.row.enabled ? 'success' : 'info'">
                                        {{ scope.row.enabled ? '是' : '否' }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="220">
                                <template #default="scope">
                                    <div class="flex flex-row gap-1">
                                        <el-button size="small" type="primary" plain style="padding: 0 8px;">数据预览</el-button>
                                        <el-button size="small" type="info" plain style="padding: 0 8px;">数据集结构</el-button>
                                        <el-button size="small" type="warning" plain style="padding: 0 8px;">血缘分析</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="flex justify-end items-center mt-4">
                            <el-pagination
                                :current-page="currentPage"
                                :page-size="pageSize"
                                :page-sizes="[10, 15, 20]"
                                :total="datasetList.length"
                                layout="total, sizes, prev, pager, next, jumper"
                                :pager-count="5"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                            >
                                <template #total>
                                    <span>共 {{ datasetList.length }} 条</span>
                                </template>
                                <template #jumper="{ value, handleInput, handleChange }">
                                    <span style="margin: 0 8px;">跳至</span>
                                    <el-input
                                        class="el-pagination__editor is-in-pagination"
                                        min="1"
                                        :max="Math.ceil(datasetList.length / pageSize)"
                                        type="number"
                                        :model-value="value"
                                        @input="handleInput"
                                        @change="handleChange"
                                        style="width: 50px; display: inline-block;"
                                    />
                                    <span style="margin-left: 4px;">页</span>
                                </template>
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="activeMenu === 'fabu'">
                <div class="bg-white rounded shadow p-4 overflow-x-auto">
                    <div class="mb-4 flex flex-wrap gap-4 items-center">
                        <span>画布名称</span>
                        <el-input v-model="publishFilter.keyword" placeholder="请输入画布名称关键词" clearable style="width: 200px;" />
                        <span>日期</span>
                        <el-date-picker v-model="publishFilter.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 260px;" />
                        <span>发布方式</span>
                        <el-select v-model="publishFilter.type" placeholder="请选择发布方式" clearable style="width: 120px;">
                            <el-option label="内部" value="内部" />
                            <el-option label="外部" value="外部" />
                        </el-select>
                        <el-button type="primary" @click="filterPublishList">查询</el-button>
                        <el-button @click="resetPublishFilter">重置</el-button>
                    </div>
                    <el-table :data="pagedPublishList" border style="width: 100%">
                        <el-table-column prop="index" label="序号" width="60" />
                        <el-table-column prop="name" label="画布名称" width="140" />
                        <el-table-column prop="link" label="发布链接" width="220">
                            <template #default="scope">
                                <el-link :href="scope.row.link" target="_blank">{{ scope.row.link }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="publishTime" label="发布时间" width="160" />
                        <el-table-column prop="type" label="发布方式" width="100" />
                        <el-table-column prop="validTime" label="有效时间" width="100" />
                        <el-table-column label="操作" width="300">
                            <template #default="scope">
                                <el-button size="small" type="info" plain>访问情况</el-button>
                                <el-button size="small" type="primary" plain>预览</el-button>
                                <el-button size="small" type="warning" plain>修改</el-button>
                                <el-button size="small" type="danger" plain>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex justify-end items-center mt-4">
                        <el-pagination
                            :current-page="publishCurrentPage"
                            :page-size="publishPageSize"
                            :page-sizes="[10, 15, 20]"
                            :total="publishList.length"
                            layout="total, sizes, prev, pager, next, jumper"
                            :pager-count="5"
                            @size-change="handlePublishSizeChange"
                            @current-change="handlePublishCurrentChange"
                        >
                            <template #total>
                                <span>共 {{ publishList.length }} 条</span>
                            </template>
                            <template #jumper="{ value, handleInput, handleChange }">
                                <span style="margin: 0 8px;">跳至</span>
                                <el-input
                                    class="el-pagination__editor is-in-pagination"
                                    min="1"
                                    :max="Math.ceil(publishList.length / publishPageSize)"
                                    type="number"
                                    :model-value="value"
                                    @input="handleInput"
                                    @change="handleChange"
                                    style="width: 50px; display: inline-block;"
                                />
                                <span style="margin-left: 4px;">页</span>
                            </template>
                        </el-pagination>
                    </div>
                </div>
            </template>
            <template v-else>
                <router-view></router-view>
            </template>
        </main>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { computed } from 'vue';
import * as echarts from 'echarts';
import { Monitor, DataLine, Setting, Lock, Connection, Tools, Fold, Expand, HomeFilled, Timer, Warning, TrendCharts, Odometer, DocumentDelete, Download, Edit, Refresh, Delete, Position, Collection, Link, Goods, SetUp, FolderOpened, Share, Management, Key, User, UserFilled, CircleCheck, Notebook, Guide, Bell, Document, Service } from '@element-plus/icons-vue';
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';
import { dayjs } from 'element-plus';

import { useRouter } from 'vue-router';
// const logoUrl = 'http://192.168.120.103:5173/img/logo.png';
// const logoUrl = logoImg;
const avatarUrl = 'https://ai-public.mastergo.com/ai/img_res/02eb0a5c2d4bd29638dcd199c1bd8b0a.jpg';
const isCollapse = ref(false);
const activeMenu = ref('1-1');
const dateRange = ref([]);
const menus = ref([
    { key: 'shujuyuan', label: '数据源管理', icon: 'Monitor' },
    { key: 'shujuji', label: '数据集管理', icon: 'DataLine' },
    { key: 'zujian', label: '组件管理', icon: 'Setting' },
    { key: 'shejiqi', label: '页面设计器', icon: 'Tools' },
    { key: 'yemian', label: '页面管理', icon: 'Document' },
    { key: 'moban', label: '模版管理', icon: 'FolderOpened' },
    { key: 'zhuti', label: '主题管理', icon: 'Service' },
    { key: 'fabu', label: '发布管理', icon: 'Share' }
]);
const router = useRouter();
function handleSelect(key, keyPath) {
    router.push(key);
    activeMenu.value = key;
};

import { ElMessage } from 'element-plus';

const dbList = [
    { key: 'postgres', label: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { key: 'oracle', label: 'ORACLE', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg' },
    { key: 'mysql', label: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { key: 'sqlserver', label: 'SQLSever', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
    { key: 'dm', label: 'DM', icon: 'https://img.icons8.com/color/96/000000/database.png' },
    { key: 'hg', label: 'HG', icon: 'https://img.icons8.com/color/96/000000/database.png' },
    { key: 'api', label: '接口', icon: 'https://img.icons8.com/color/96/000000/api.png' },
    { key: 'hive', label: 'HIVE', icon: 'https://img.icons8.com/color/96/000000/hive.png' },
    { key: 'kingbase', label: '人大金仓', icon: 'https://img.icons8.com/color/96/000000/database.png' },
];

const dialogVisible = ref(false);
const dialogTitle = ref('数据源接入');
const form = reactive({
    name: '',
    host: '',
    port: '',
    username: '',
    password: '',
    dbname: ''
});
function openDialog(db) {
    dialogTitle.value = db.label + ' 数据源接入';
    dialogVisible.value = true;
    resetForm();
}
function resetForm() {
    form.name = '';
    form.host = '';
    form.port = '';
    form.username = '';
    form.password = '';
    form.dbname = '';
}
function testConnection() {
    ElMessage.success('测试连接成功（模拟）');
}
function confirm() {
    ElMessage.success('数据源接入成功（模拟）');
    dialogVisible.value = false;
}

const datasetTree = [
    {
        id: 1,
        label: '分组1',
        children: [
            { id: 11, label: '业务集1' },
            { id: 12, label: '业务集2' },
            { id: 13, label: '业务集3' },
        ]
    }
];
const treeProps = { children: 'children', label: 'label' };
const datasetList = ref([
    { index: 1, name: '水压统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '抽取', enabled: true },
    { index: 2, name: '水流量统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: false },
    { index: 3, name: '今日供水量', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: true },
    { index: 4, name: '昨日供水量', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: false },
    { index: 5, name: '供水合格率', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: true },
    { index: 6, name: '二次供水泵房统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: true },
    { index: 7, name: '进厂浊度', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: true },
    { index: 8, name: '出厂浊度', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: false },
    { index: 9, name: '出厂余氯', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: true },
    { index: 10, name: '水池统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: true },
    { index: 11, name: '水箱统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: true },
    { index: 12, name: '营收统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: false },
    { index: 13, name: '工单统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: false },
    { index: 14, name: '远传抄表率', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: true },
    { index: 15, name: '取水量统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '实时', enabled: true },
]);
function handleTreeNodeClick(node) {
    // 这里可根据业务集筛选数据集，暂未实现
}

const addDialogVisible = ref(false);
const addForm = reactive({
    name: '',
    source: '',
    mode: '抽取'
});
function resetAddForm() {
    addForm.name = '';
    addForm.source = '';
    addForm.mode = '抽取';
}
function confirmAdd() {
    ElMessage.success('新增数据集成功（模拟）');
    addDialogVisible.value = false;
}

const currentPage = ref(1);
const pageSize = ref(10);
function handleSizeChange(val) {
    pageSize.value = val;
    currentPage.value = 1;
}
function handleCurrentChange(val) {
    currentPage.value = val;
}

const pagedDatasetList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return datasetList.value.slice(start, end);
});

const publishList = ref([
    { index: 1, name: '水务大屏', link: 'https://example.com/canvas/1', publishTime: '2025-07-17 10:00', type: '内部', validTime: '一个月' },
    { index: 2, name: '管网监控', link: 'https://example.com/canvas/2', publishTime: '2025-07-17 10:10', type: '外部', validTime: '三个月' },
    { index: 3, name: '能耗分析', link: 'https://example.com/canvas/3', publishTime: '2025-07-17 10:20', type: '内部', validTime: '半年' },
    { index: 4, name: '设备运维', link: 'https://example.com/canvas/4', publishTime: '2025-07-17 10:30', type: '外部', validTime: '一年' },
    { index: 5, name: '水质追踪', link: 'https://example.com/canvas/5', publishTime: '2025-07-17 10:40', type: '内部', validTime: '永久' },
]);

const publishCurrentPage = ref(1);
const publishPageSize = ref(10);
const publishFilter = reactive({
    keyword: '',
    dateRange: [],
    type: ''
});
const filteredPublishList = computed(() => {
    return publishList.value.filter(item => {
        const matchKeyword = !publishFilter.keyword || item.name.includes(publishFilter.keyword);
        const matchType = !publishFilter.type || item.type === publishFilter.type;
        let matchDate = true;
        if (publishFilter.dateRange && publishFilter.dateRange.length === 2) {
            const start = dayjs(publishFilter.dateRange[0]);
            const end = dayjs(publishFilter.dateRange[1]);
            const pub = dayjs(item.publishTime);
            matchDate = pub.isAfter(start.subtract(1, 'day')) && pub.isBefore(end.add(1, 'day'));
        }
        return matchKeyword && matchType && matchDate;
    });
});
const pagedPublishList = computed(() => {
    const start = (publishCurrentPage.value - 1) * publishPageSize.value;
    const end = start + publishPageSize.value;
    return filteredPublishList.value.slice(start, end);
});
function filterPublishList() {
    publishCurrentPage.value = 1;
}
function resetPublishFilter() {
    publishFilter.keyword = '';
    publishFilter.dateRange = [];
    publishFilter.type = '';
    publishCurrentPage.value = 1;
}
function handlePublishSizeChange(val) {
    publishPageSize.value = val;
    publishCurrentPage.value = 1;
}
function handlePublishCurrentChange(val) {
    publishCurrentPage.value = val;
}
</script>
