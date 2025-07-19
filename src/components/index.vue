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
                <el-dialog v-model="addDatasetDialogVisible" title="新增数据集" width="420px" @close="resetAddDatasetForm">
                    <el-form :model="addDatasetForm" label-width="90px">
                        <el-form-item label="页面">
                            <el-select v-model="addDatasetForm.page" placeholder="请选择页面">
                                <el-option label="页面1" value="页面1" />
                                <el-option label="页面2" value="页面2" />
                                <el-option label="页面3" value="页面3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据集名称">
                            <el-input v-model="addDatasetForm.name" placeholder="请输入数据集名称" />
                        </el-form-item>
                        <el-form-item label="数据源名称">
                            <el-select v-model="addDatasetForm.source" placeholder="请选择数据源">
                                <el-option label="数据源1" value="数据源1" />
                                <el-option label="数据源2" value="数据源2" />
                                <el-option label="数据源3" value="数据源3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="SQL">
                            <el-input v-model="addDatasetForm.sql" type="textarea" :rows="4" placeholder="请输入SQL" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button @click="resetAddDatasetForm">重置</el-button>
                        <el-button type="primary" @click="addDatasetDialogVisible = false">确认</el-button>
                        <el-button @click="addDatasetDialogVisible = false">取消</el-button>
                    </template>
                </el-dialog>
                <el-dialog v-model="editDatasetDialogVisible" title="修改数据集" width="420px" @close="resetEditDatasetForm">
                    <el-form :model="editDatasetForm" label-width="90px">
                        <el-form-item label="页面">
                            <el-select v-model="editDatasetForm.page" placeholder="请选择页面">
                                <el-option label="页面1" value="页面1" />
                                <el-option label="页面2" value="页面2" />
                                <el-option label="页面3" value="页面3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据集名称">
                            <el-input v-model="editDatasetForm.name" placeholder="请输入数据集名称" />
                        </el-form-item>
                        <el-form-item label="数据源名称">
                            <el-select v-model="editDatasetForm.source" placeholder="请选择数据源">
                                <el-option label="数据源1" value="数据源1" />
                                <el-option label="数据源2" value="数据源2" />
                                <el-option label="数据源3" value="数据源3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="SQL">
                            <el-input v-model="editDatasetForm.sql" type="textarea" :rows="4" placeholder="请输入SQL" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button @click="resetEditDatasetForm">重置</el-button>
                        <el-button type="primary" @click="confirmEditDataset">确认</el-button>
                        <el-button @click="editDatasetDialogVisible = false">取消</el-button>
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
                        <div v-if="showDatasetActions" class="mb-4 mt-6 flex gap-2">
                            <el-button type="primary" size="small" @click="addDatasetDialogVisible = true">新增</el-button>
                            <el-button type="warning" size="small" @click="showEditDatasetDialog">修改</el-button>
                            <el-button type="danger" size="small" @click="confirmDeleteDataset">删除</el-button>
                        </div>
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
                                        <el-button size="small" type="primary" plain style="padding: 0 8px;" :disabled="scope.row.name !== '水压统计'" @click="showPreviewDialog(scope.row)">数据预览</el-button>
                                        <el-button size="small" type="info" plain style="padding: 0 8px;" @click="showStructDialog(scope.row)">数据集结构</el-button>
                                        <el-button size="small" type="warning" plain style="padding: 0 8px;" :disabled="scope.row.name !== '水压统计'" @click="showLineageDialog(scope.row)">血缘分析</el-button>
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
                        <el-table-column prop="visitCount" label="访问次数" width="100" />
                        <el-table-column label="操作" width="300">
                            <template #default="scope">
                                <el-button size="small" type="info" plain @click="showVisitDialog(scope.row)">访问情况</el-button>
                                <el-button size="small" type="warning" plain @click="showEditDialog(scope.row)">修改</el-button>
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
                <el-dialog v-model="visitDialogVisible" title="访问情况" width="500px" @close="visitRecords=[]">
                    <el-table :data="visitRecords" border style="width: 100%">
                        <el-table-column prop="index" label="序号" width="60" />
                        <el-table-column prop="ip" label="访问IP" width="180" />
                        <el-table-column prop="time" label="访问时间" width="220" />
                    </el-table>
                </el-dialog>
                <el-dialog v-model="editDialogVisible" title="修改发布信息" width="400px" @close="resetEditForm">
                    <el-form :model="editForm" label-width="90px">
                        <el-form-item label="发布方式">
                            <el-select v-model="editForm.type" placeholder="请选择发布方式">
                                <el-option label="内部" value="内部" />
                                <el-option label="外部" value="外部" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="有效时间">
                            <el-date-picker v-model="editForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 220px;" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button @click="resetEditForm">重置</el-button>
                        <el-button type="primary" @click="confirmEdit">确认</el-button>
                        <el-button @click="editDialogVisible = false">取消</el-button>
                    </template>
                </el-dialog>
            </template>
            <template v-else>
                <router-view></router-view>
            </template>
        </main>
        <el-dialog v-model="previewDialogVisible" title="数据预览" width="1100px" @close="resetPreviewDialog">
    <div class="flex gap-6">
        <div class="w-64 flex-shrink-0 border-r pr-6">
            <div class="mb-2"><strong>页面：</strong> {{ previewInfo.page }}</div>
            <div class="mb-2"><strong>数据集名称：</strong> {{ previewInfo.name }}</div>
            <div class="mb-2"><strong>数据源名称：</strong> {{ previewInfo.source }}</div>
            <div class="mb-2"><strong>SQL：</strong> <span class="break-all">{{ previewInfo.sql }}</span></div>
        </div>
        <div class="flex-1">
            <el-table :data="previewTableData" border style="width: 100%">
                <el-table-column prop="id" label="id" width="60" />
                <el-table-column prop="zdbh" label="zdbh" width="160" />
                <el-table-column prop="zdmc" label="zdmc" width="140" />
                <el-table-column prop="cjsj" label="cjsj" width="120" />
                <el-table-column prop="yl" label="yl" width="80" />
                <el-table-column prop="dcdy" label="dcdy" width="80" />
                <el-table-column prop="xhqd" label="xhqd" width="80" />
            </el-table>
        </div>
    </div>
</el-dialog>
<el-dialog v-model="structDialogVisible" title="数据集结构" width="800px" @close="resetStructDialog">
    <el-form label-width="60px">
        <el-form-item label="列">
            <el-input value="zdbh" readonly style="width: 100px;" />
            <span style="margin: 0 8px;">类型</span>
            <el-input value="CHARACT" readonly style="width: 100px;" />
            <span style="margin: 0 8px;">长度</span>
            <el-input value="20" readonly style="width: 60px;" />
            <span style="margin: 0 8px;">默认值</span>
            <el-input value="" readonly style="width: 100px;" />
            <span style="margin: 0 8px;">描述</span>
            <el-input value="" readonly style="width: 100px;" />
        </el-form-item>
        <el-form-item label="列">
            <el-input value="zdmc" readonly style="width: 100px;" />
            <span style="margin: 0 8px;">类型</span>
            <el-input value="CHARACT" readonly style="width: 100px;" />
            <span style="margin: 0 8px;">长度</span>
            <el-input value="20" readonly style="width: 60px;" />
            <span style="margin: 0 8px;">默认值</span>
            <el-input value="" readonly style="width: 100px;" />
            <span style="margin: 0 8px;">描述</span>
            <el-input value="" readonly style="width: 100px;" />
        </el-form-item>
        <el-form-item label="列">
            <el-input value="cjsj" readonly style="width: 100px;" />
            <span style="margin: 0 8px;">类型</span>
            <el-input value="DATE" readonly style="width: 100px;" />
            <span style="margin: 0 8px;">长度</span>
            <el-input value="0" readonly style="width: 60px;" />
            <span style="margin: 0 8px;">默认值</span>
            <el-input value="" readonly style="width: 100px;" />
            <span style="margin: 0 8px;">描述</span>
            <el-input value="" readonly style="width: 100px;" />
        </el-form-item>
    </el-form>
</el-dialog>
<el-dialog v-model="lineageDialogVisible" title="血缘分析" width="900px" @close="resetLineageDialog">
    <div ref="lineageChartRef" style="width: 850px; height: 500px;"></div>
</el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick } from 'vue';
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

import { ElMessage, ElMessageBox } from 'element-plus';

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
        label: '全部分组',
        children: [
            { id: 11, label: '云上中心' },
            { id: 12, label: '供水一体化管控主题' },
            { id: 13, label: '供水全要素管理主题' },
            { id: 14, label: '应急指挥主题' },
            { id: 15, label: '来水专题' },
            { id: 16, label: '营业主题' },
            { id: 17, label: '客服专题' },
            { id: 18, label: '管网专题' },
            { id: 19, label: '水质专题' },
            { id: 20, label: '二供专题' },
            { id: 21, label: 'Pad端一张图' }
        ]
    }
];
const treeProps = { children: 'children', label: 'label' };
const datasetListAll = [
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
];
const datasetList = ref([]);
const datasetActionLabels = [
    '云上中心',
    '供水一体化管控主题',
    '供水全要素管理主题',
    '应急指挥主题',
    '来水专题',
    '营业主题',
    '客服专题',
    '管网专题',
    '水质专题',
    '二供专题',
    'Pad端一张图'
];
const showDatasetActions = ref(false);
function handleTreeNodeClick(node) {
    // 供水全要素管理主题 id:13
    if (node.label === '供水全要素管理主题') {
        datasetList.value = datasetListAll;
    } else {
        datasetList.value = [];
    }
    showDatasetActions.value = datasetActionLabels.includes(node.label);
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

const addDatasetDialogVisible = ref(false);
const addDatasetForm = reactive({
    page: '',
    name: '',
    source: '',
    sql: ''
});
function resetAddDatasetForm() {
    addDatasetForm.page = '';
    addDatasetForm.name = '';
    addDatasetForm.source = '';
    addDatasetForm.sql = '';
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
    { index: 1, name: '水务大屏', link: 'https://example.com/canvas/1', publishTime: '2025-07-17 10:00', type: '内部', validTime: '2025-07-17至2025-08-16', visitCount: 123 },
    { index: 2, name: '管网监控', link: 'https://example.com/canvas/2', publishTime: '2025-07-17 10:10', type: '外部', validTime: '2025-07-17至2025-08-16', visitCount: 88 },
    { index: 3, name: '能耗分析', link: 'https://example.com/canvas/3', publishTime: '2025-07-17 10:20', type: '内部', validTime: '2025-07-17至2025-08-16', visitCount: 56 },
    { index: 4, name: '设备运维', link: 'https://example.com/canvas/4', publishTime: '2025-07-17 10:30', type: '外部', validTime: '2025-07-17至2025-08-16', visitCount: 34 },
    { index: 5, name: '水质追踪', link: 'https://example.com/canvas/5', publishTime: '2025-07-17 10:40', type: '内部', validTime: '2025-07-17至2025-08-16', visitCount: 201 },
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

const visitDialogVisible = ref(false);
const visitRecords = ref([]);
function showVisitDialog(row) {
    // 模拟数据，实际可根据row加载不同数据
    visitRecords.value = [
        { index: 1, ip: '192.168.1.10', time: '2025-07-17 11:00:01' },
        { index: 2, ip: '192.168.1.11', time: '2025-07-17 11:02:15' },
        { index: 3, ip: '192.168.1.12', time: '2025-07-17 11:05:23' },
    ];
    visitDialogVisible.value = true;
}

const editDialogVisible = ref(false);
const editForm = reactive({
    index: null,
    type: '',
    dateRange: []
});
function showEditDialog(row) {
    editForm.index = row.index;
    editForm.type = row.type;
    // 有效时间格式为 '2025-07-17至2025-08-16'
    if (row.validTime && row.validTime.includes('至')) {
        const [start, end] = row.validTime.split('至');
        editForm.dateRange = [start.trim(), end.trim()];
    } else {
        editForm.dateRange = [];
    }
    editDialogVisible.value = true;
}
function resetEditForm() {
    editForm.type = '';
    editForm.dateRange = [];
}
function confirmEdit() {
    // 找到对应行并更新
    const idx = publishList.value.findIndex(item => item.index === editForm.index);
    if (idx !== -1) {
        publishList.value[idx].type = editForm.type;
        if (editForm.dateRange.length === 2) {
            publishList.value[idx].validTime = `${editForm.dateRange[0]}至${editForm.dateRange[1]}`;
        }
    }
    editDialogVisible.value = false;
}

const editDatasetDialogVisible = ref(false);
const editDatasetForm = reactive({
    page: '',
    name: '',
    source: '',
    sql: '',
    index: null
});
function showEditDatasetDialog() {
    // 这里只做演示，实际应选中某一行后再编辑
    // 这里默认编辑第一条数据
    const row = datasetList.value[0];
    if (!row) return;
    editDatasetForm.page = '页面1'; // 这里可根据实际数据回显
    editDatasetForm.name = row.name;
    editDatasetForm.source = '数据源1';
    editDatasetForm.sql = row.sql || '';
    editDatasetForm.index = row.index;
    editDatasetDialogVisible.value = true;
}
function resetEditDatasetForm() {
    editDatasetForm.page = '';
    editDatasetForm.name = '';
    editDatasetForm.source = '';
    editDatasetForm.sql = '';
    editDatasetForm.index = null;
}
function confirmEditDataset() {
    // 更新数据
    const idx = datasetList.value.findIndex(item => item.index === editDatasetForm.index);
    if (idx !== -1) {
        datasetList.value[idx].name = editDatasetForm.name;
        datasetList.value[idx].source = editDatasetForm.source;
        datasetList.value[idx].sql = editDatasetForm.sql;
        // 页面字段如需保存可扩展
    }
    editDatasetDialogVisible.value = false;
    ElMessage.success('修改成功');
}
function confirmDeleteDataset() {
    // 这里只做演示，实际应选中某一行后再删除
    if (!datasetList.value.length) return;
    ElMessageBox.confirm('确定要删除该数据集吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        datasetList.value.splice(0, 1); // 实际应删除选中行
        ElMessage.success('删除成功');
    });
}

const previewDialogVisible = ref(false);
const previewInfo = reactive({
    page: '',
    name: '',
    source: '',
    sql: ''
});
const previewTableData = ref([]);
function showPreviewDialog(row) {
    if (row.name !== '水压统计') return;
    previewInfo.page = '页面1';
    previewInfo.name = '水压统计';
    previewInfo.source = '水务中台数据源';
    previewInfo.sql = 'select * from gzsw';
    previewTableData.value = [
        { id: 1, zdbh: 'GZKFQ_XF_0203', zdmc: '翠光街4号', cjsj: '2025-07-17', yl: 0.269, dcdy: 3.67, xhqd: -79 }
    ];
    previewDialogVisible.value = true;
}
function resetPreviewDialog() {
    previewInfo.page = '';
    previewInfo.name = '';
    previewInfo.source = '';
    previewInfo.sql = '';
    previewTableData.value = [];
}

const structDialogVisible = ref(false);
function showStructDialog(row) {
    if (row.name !== '水压统计') return;
    structDialogVisible.value = true;
}
function resetStructDialog() {
    structDialogVisible.value = false;
}

const lineageDialogVisible = ref(false);
const lineageChartRef = ref(null);
let lineageChartInstance = null;
function showLineageDialog(row) {
    if (row.name !== '水压统计') return;
    lineageDialogVisible.value = true;
    nextTick(() => {
        if (!lineageChartInstance && lineageChartRef.value) {
            lineageChartInstance = echarts.init(lineageChartRef.value);
        }
        const option = {
            tooltip: {},
            series: [{
                type: 'graph',
                layout: 'force',
                roam: true,
                symbolSize: 70,
                label: { show: true },
                edgeSymbol: ['none', 'arrow'],
                edgeSymbolSize: [4, 10],
                force: { repulsion: 400, edgeLength: 120 },
                data: [
                    { name: '水务中台数据源', x: 100, y: 250 },
                    { name: '水压统计', x: 300, y: 250 },
                    { name: '柱状图-今日供水量', x: 500, y: 150 },
                    { name: '饼图-今日供水量', x: 500, y: 250 },
                    { name: '面积图-今日供水量', x: 500, y: 350 },
                    { name: '云上中心', x: 700, y: 150 },
                    { name: '营业主题', x: 700, y: 250 }
                ],
                links: [
                    { source: '水务中台数据源', target: '水压统计' },
                    { source: '水压统计', target: '柱状图-今日供水量' },
                    { source: '水压统计', target: '饼图-今日供水量' },
                    { source: '水压统计', target: '面积图-今日供水量' },
                    { source: '柱状图-今日供水量', target: '云上中心' },
                    { source: '面积图-今日供水量', target: '云上中心' },
                    { source: '饼图-今日供水量', target: '营业主题' }
                ],
                lineStyle: { color: '#aaa' }
            }]
        };
        lineageChartInstance.setOption(option);
    });
}
function resetLineageDialog() {
    if (lineageChartInstance) {
        lineageChartInstance.dispose();
        lineageChartInstance = null;
    }
}
</script>
