<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 顶部导航 -->
        <header v-if="!pageDesignerVisible" class="h-16 bg-[#1e88e5] shadow-sm fixed w-full top-0 z-50 flex items-center justify-between px-6">
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
        <aside v-if="!pageDesignerVisible" class="fixed left-0 top-16 bottom-0 bg-white shadow-sm overflow-y-auto transition-all duration-300"
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
        <main v-if="!pageDesignerVisible" class="pt-16 p-6 transition-all duration-300" :class="isCollapse ? 'ml-16' : 'ml-64'">
            <!-- 其他页面内容 -->
            <template v-if="activeMenu === 'shujuyuan'">
                <div class="bg-white rounded shadow p-4">
                    
                    <!-- 查询表单 -->
                    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center gap-4">
                            <!-- 数据库数据源查询 -->
                            <div v-if="activeDataSourceType === 'database'" class="flex items-center gap-4">
                                <span class="text-sm font-medium text-gray-700">数据源名称</span>
                                <el-input 
                                    v-model="searchForm.name" 
                                    placeholder="请输入数据源名称" 
                                    style="width: 200px;"
                                    clearable
                                />
                                <span class="text-sm font-medium text-gray-700">数据库类型</span>
                                <el-select 
                                    v-model="searchForm.databaseType" 
                                    placeholder="请选择数据库类型" 
                                    style="width: 150px;"
                                    clearable
                                >
                                    <el-option label="MySQL" value="MySQL" />
                                    <el-option label="PostgreSQL" value="PostgreSQL" />
                                    <el-option label="Oracle" value="Oracle" />
                                    <el-option label="SQL Server" value="SQL Server" />
                                    <el-option label="DM" value="DM" />
                                    <el-option label="人大金仓" value="人大金仓" />
                                    <el-option label="HIVE" value="HIVE" />
                                    <el-option label="HG" value="HG" />
                                </el-select>
                                <span class="text-sm font-medium text-gray-700">连接地址</span>
                                <el-input 
                                    v-model="searchForm.address" 
                                    placeholder="请输入连接地址" 
                                    style="width: 250px;"
                                    clearable
                                />
                            </div>
                            
                            <!-- 接口数据源查询 -->
                            <div v-else class="flex items-center gap-4">
                                <span class="text-sm font-medium text-gray-700">数据源名称</span>
                                <el-input 
                                    v-model="searchForm.name" 
                                    placeholder="请输入数据源名称" 
                                    style="width: 200px;"
                                    clearable
                                />
                                <span class="text-sm font-medium text-gray-700">接口地址</span>
                                <el-input 
                                    v-model="searchForm.address" 
                                    placeholder="请输入接口地址" 
                                    style="width: 250px;"
                                    clearable
                                />
                            </div>
                            
                            <el-button type="primary" @click="searchDataSources">
                                <el-icon><Search /></el-icon>
                                查询
                            </el-button>
                            <el-button @click="resetSearch">
                                <el-icon><Refresh /></el-icon>
                                重置
                            </el-button>
                        </div>
                    </div>
                    
                    <!-- 数据源列表 -->
                    <div class="mb-6">
                        <!-- 数据库数据源列表 -->
                        <div v-if="activeDataSourceType === 'database'" class="space-y-4">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-medium">数据库数据源</h3>
                                <el-button type="primary" size="small" @click="showAddDatabaseDialog">
                                    <el-icon><Plus /></el-icon>
                                    新增数据库数据源
                                </el-button>
                            </div>
                            <el-table :data="filteredDatabaseDataSourceList" border style="width: 100%">
                                <el-table-column prop="name" label="数据源名称" width="150" />
                                <el-table-column prop="type" label="数据库类型" width="110" />
                                <el-table-column prop="host" label="连接地址" width="150" />
                                <el-table-column prop="port" label="端口" width="85" />
                                <el-table-column prop="database" label="数据库名" width="120" />
                                <el-table-column prop="status" label="状态" width="85">
                                    <template #default="scope">
                                        <el-tag :type="scope.row.status === 'connected' ? 'success' : 'danger'">
                                            {{ scope.row.status === 'connected' ? '已连接' : '未连接' }}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="createTime" label="创建时间" width="180" />
                                <el-table-column label="操作" width="230">
                                    <template #default="scope">
                                        <el-button size="small" type="primary" plain @click="testDatabaseConnection(scope.row)">测试连接</el-button>
                                        <el-button size="small" type="warning" plain @click="editDatabaseDataSource(scope.row)">编辑</el-button>
                                        <el-button size="small" type="danger" plain @click="deleteDatabaseDataSource(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        
                        <!-- 接口数据源列表 -->
                        <div v-else-if="activeDataSourceType === 'api'" class="space-y-4">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-medium">接口数据源</h3>
                                <el-button type="primary" size="small" @click="showAddApiDialog">
                                    <el-icon><Plus /></el-icon>
                                    新增接口数据源
                                </el-button>
                            </div>
                            <el-table :data="filteredApiDataSourceList" border style="width: 100%">
                                <el-table-column prop="name" label="数据源名称" width="150" />
                                <el-table-column prop="url" label="接口地址" width="250" />
                                <el-table-column prop="method" label="请求方式" width="100" />
                                <el-table-column prop="status" label="状态" width="85">
                                    <template #default="scope">
                                        <el-tag :type="scope.row.status === 'available' ? 'success' : 'danger'">
                                            {{ scope.row.status === 'available' ? '可用' : '不可用' }}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="createTime" label="创建时间" width="180" />
                                <el-table-column label="操作" width="240">
                                    <template #default="scope">
                                        <el-button size="small" type="primary" plain @click="testApiConnection(scope.row)">测试连接</el-button>
                                        <el-button size="small" type="warning" plain @click="editApiDataSource(scope.row)">编辑</el-button>
                                        <el-button size="small" type="danger" plain @click="deleteApiDataSource(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    
                    <!-- 底部切换标签 -->
                    <div class="flex justify-center border-t pt-4">
                        <el-radio-group v-model="activeDataSourceType" @change="handleDataSourceTypeChange">
                            <el-radio-button label="database">数据库数据源</el-radio-button>
                            <el-radio-button label="api">接口数据源</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                
                <!-- 新增数据库数据源对话框 -->
                <el-dialog v-model="addDatabaseDialogVisible" title="新增数据库数据源" width="500px" @close="resetDatabaseForm">
                    <el-form :model="databaseForm" label-width="100px">
                        <el-form-item label="数据源名称" required>
                            <el-input v-model="databaseForm.name" placeholder="请输入数据源名称" />
                        </el-form-item>
                        <el-form-item label="数据库类型" required>
                            <el-select v-model="databaseForm.type" placeholder="请选择数据库类型" style="width: 100%;">
                                <el-option label="MySQL" value="mysql" />
                                <el-option label="PostgreSQL" value="postgresql" />
                                <el-option label="Oracle" value="oracle" />
                                <el-option label="SQL Server" value="sqlserver" />
                                <el-option label="DM" value="dm" />
                                <el-option label="人大金仓" value="kingbase" />
                                <el-option label="HIVE" value="hive" />
                                <el-option label="HG" value="hg" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="连接地址" required>
                            <el-input v-model="databaseForm.host" placeholder="请输入连接地址" />
                        </el-form-item>
                        <el-form-item label="端口" required>
                            <el-input v-model="databaseForm.port" placeholder="请输入端口" />
                        </el-form-item>
                        <el-form-item label="数据库名" required>
                            <el-input v-model="databaseForm.database" placeholder="请输入数据库名" />
                        </el-form-item>
                        <el-form-item label="用户名" required>
                            <el-input v-model="databaseForm.username" placeholder="请输入用户名" />
                        </el-form-item>
                        <el-form-item label="密码" required>
                            <el-input v-model="databaseForm.password" type="password" show-password placeholder="请输入密码" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button @click="testDatabaseConnection">测试连接</el-button>
                        <el-button @click="resetDatabaseForm">重置</el-button>
                        <el-button type="primary" @click="confirmAddDatabase">确认</el-button>
                        <el-button @click="addDatabaseDialogVisible = false">取消</el-button>
                    </template>
                </el-dialog>
                
                <!-- 新增接口数据源对话框 -->
                <el-dialog v-model="addApiDialogVisible" title="新增接口数据源" width="500px" @close="resetApiForm">
                    <el-form :model="apiForm" label-width="100px">
                        <el-form-item label="数据源名称" required>
                            <el-input v-model="apiForm.name" placeholder="请输入数据源名称" />
                        </el-form-item>
                        <el-form-item label="接口地址" required>
                            <el-input v-model="apiForm.url" placeholder="请输入接口地址" />
                        </el-form-item>
                        <el-form-item label="请求方式" required>
                            <el-select v-model="apiForm.method" placeholder="请选择请求方式" style="width: 100%;">
                                <el-option label="GET" value="GET" />
                                <el-option label="POST" value="POST" />
                                <el-option label="PUT" value="PUT" />
                                <el-option label="DELETE" value="DELETE" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="请求头">
                            <el-input v-model="apiForm.headers" type="textarea" :rows="3" placeholder="请输入请求头（JSON格式）" />
                        </el-form-item>
                        <el-form-item label="认证信息">
                            <el-input v-model="apiForm.auth" placeholder="请输入认证信息" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button @click="testApiConnection">测试连接</el-button>
                        <el-button @click="resetApiForm">重置</el-button>
                        <el-button type="primary" @click="confirmAddApi">确认</el-button>
                        <el-button @click="addApiDialogVisible = false">取消</el-button>
                    </template>
                </el-dialog>
                
                <!-- 修改数据库数据源对话框 -->
                <el-dialog v-model="editDatabaseDialogVisible" title="修改数据库数据源" width="500px" @close="resetEditDatabaseForm">
                    <el-form :model="editDatabaseForm" label-width="100px">
                        <el-form-item label="数据源名称" required>
                            <el-input v-model="editDatabaseForm.name" placeholder="请输入数据源名称" />
                        </el-form-item>
                        <el-form-item label="数据库类型" required>
                            <el-select v-model="editDatabaseForm.type" placeholder="请选择数据库类型" style="width: 100%;">
                                <el-option label="MySQL" value="mysql" />
                                <el-option label="PostgreSQL" value="postgresql" />
                                <el-option label="Oracle" value="oracle" />
                                <el-option label="SQL Server" value="sqlserver" />
                                <el-option label="DM" value="dm" />
                                <el-option label="人大金仓" value="kingbase" />
                                <el-option label="HIVE" value="hive" />
                                <el-option label="HG" value="hg" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="连接地址" required>
                            <el-input v-model="editDatabaseForm.host" placeholder="请输入连接地址" />
                        </el-form-item>
                        <el-form-item label="端口" required>
                            <el-input v-model="editDatabaseForm.port" placeholder="请输入端口" />
                        </el-form-item>
                        <el-form-item label="数据库名" required>
                            <el-input v-model="editDatabaseForm.database" placeholder="请输入数据库名" />
                        </el-form-item>
                        <el-form-item label="用户名" required>
                            <el-input v-model="editDatabaseForm.username" placeholder="请输入用户名" />
                        </el-form-item>
                        <el-form-item label="密码" required>
                            <el-input v-model="editDatabaseForm.password" type="password" show-password placeholder="请输入密码" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button @click="testDatabaseConnection(editDatabaseForm)">测试连接</el-button>
                        <el-button @click="resetEditDatabaseForm">重置</el-button>
                        <el-button type="primary" @click="confirmEditDatabase">确认</el-button>
                        <el-button @click="editDatabaseDialogVisible = false">取消</el-button>
                    </template>
                </el-dialog>
                
                <!-- 修改接口数据源对话框 -->
                <el-dialog v-model="editApiDialogVisible" title="修改接口数据源" width="500px" @close="resetEditApiForm">
                    <el-form :model="editApiForm" label-width="100px">
                        <el-form-item label="数据源名称" required>
                            <el-input v-model="editApiForm.name" placeholder="请输入数据源名称" />
                        </el-form-item>
                        <el-form-item label="接口地址" required>
                            <el-input v-model="editApiForm.url" placeholder="请输入接口地址" />
                        </el-form-item>
                        <el-form-item label="请求方式" required>
                            <el-select v-model="editApiForm.method" placeholder="请选择请求方式" style="width: 100%;">
                                <el-option label="GET" value="GET" />
                                <el-option label="POST" value="POST" />
                                <el-option label="PUT" value="PUT" />
                                <el-option label="DELETE" value="DELETE" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="请求头">
                            <el-input v-model="editApiForm.headers" type="textarea" :rows="3" placeholder="请输入请求头（JSON格式）" />
                        </el-form-item>
                        <el-form-item label="认证信息">
                            <el-input v-model="editApiForm.auth" placeholder="请输入认证信息" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button @click="testApiConnection(editApiForm)">测试连接</el-button>
                        <el-button @click="resetEditApiForm">重置</el-button>
                        <el-button type="primary" @click="confirmEditApi">确认</el-button>
                        <el-button @click="editApiDialogVisible = false">取消</el-button>
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
                <el-dialog v-model="addDatasetDialogVisible" title="新增数据集" width="1200px" @close="resetAddDatasetForm">
                    <!-- 数据抽取界面 -->
                    <div v-if="addDatasetType === 'dataExtract'" class="flex gap-4">
                        <!-- 左侧表单 -->
                        <div class="flex-1">
                            <el-form :model="addDatasetForm" label-width="100px">
                                <el-form-item label="新增方式">
                                    <el-select v-model="addDatasetType" placeholder="请选择新增方式" style="width: 100%;">
                                        <el-option label="数据抽取" value="dataExtract"></el-option>
                                        <el-option label="接口" value="api"></el-option>
                                        <el-option label="Excel导入" value="excel"></el-option>
                                        <el-option label="模拟数据" value="mock"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="页面名称">
                                    <el-select v-model="addDatasetForm.page" placeholder="请选择页面名称" style="width: 100%;">
                                        <el-option label="资产一张图" value="资产一张图"></el-option>
                                        <el-option label="调度一张图" value="调度一张图"></el-option>
                                        <el-option label="监测数据专题图" value="监测数据专题图"></el-option>
                                        <el-option label="用户分布" value="用户分布"></el-option>
                                        <el-option label="重点用户专题图" value="重点用户专题图"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据集名称">
                                    <el-input v-model="addDatasetForm.name" placeholder="请输入数据集名称"></el-input>
                                </el-form-item>
                                <el-form-item label="数据源名称">
                                    <el-select v-model="addDatasetForm.source" placeholder="请选择数据源名称" style="width: 100%;">
                                        <el-option label="压力数据" value="压力数据"></el-option>
                                        <el-option label="流量数据" value="流量数据"></el-option>
                                        <el-option label="水质数据" value="水质数据"></el-option>
                                        <el-option label="营业数据" value="营业数据"></el-option>
                                        <el-option label="管线数据" value="管线数据"></el-option>
                                        <el-option label="模型数据" value="模型数据"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="SQL">
                                    <el-input v-model="addDatasetForm.sql" type="textarea" :rows="8" placeholder="请输入SQL语句"></el-input>
                                </el-form-item>
                            </el-form>
                            
                            <!-- 按钮组 -->
                            <div class="flex gap-2 mt-4" style="margin-left: 150px;">
                                <el-button @click="clearDatasetForm">清空</el-button>
                                <el-button type="info" @click="validateDataset" :disabled="addDatasetType !== 'dataExtract'">验证</el-button>
                                <el-button @click="addDatasetDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="saveDataset">保存</el-button>
                            </div>
                        </div>
                        
                        <!-- 右侧数据预览 -->
                        <div class="flex-1">
                            <div class="font-medium mb-2">数据预览</div>
                            <div class="border border-gray-300 rounded p-4 h-80 overflow-auto bg-gray-50">
                                <div v-if="previewData.length === 0" class="text-gray-500 text-center mt-20">
                                    点击验证按钮查看数据预览
                                </div>
                                <el-table v-else :data="previewData" size="small" style="width: 100%">
                                    <el-table-column prop="id" label="ID" width="60"></el-table-column>
                                    <el-table-column prop="name" label="名称"></el-table-column>
                                    <el-table-column prop="value" label="数值"></el-table-column>
                                    <el-table-column prop="time" label="时间"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 接口界面 -->
                    <div v-else-if="addDatasetType === 'api'" class="flex gap-4">
                        <!-- 左侧表单 -->
                        <div class="flex-1">
                            <el-form :model="addDatasetForm" label-width="100px">
                                <el-form-item label="新增方式">
                                    <el-select v-model="addDatasetType" placeholder="请选择新增方式" style="width: 100%;">
                                        <el-option label="数据抽取" value="dataExtract"></el-option>
                                        <el-option label="接口" value="api"></el-option>
                                        <el-option label="Excel导入" value="excel"></el-option>
                                        <el-option label="模拟数据" value="mock"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="页面名称">
                                    <el-select v-model="addDatasetForm.page" placeholder="请选择页面名称" style="width: 100%;">
                                        <el-option label="资产一张图" value="资产一张图"></el-option>
                                        <el-option label="调度一张图" value="调度一张图"></el-option>
                                        <el-option label="监测数据专题图" value="监测数据专题图"></el-option>
                                        <el-option label="用户分布" value="用户分布"></el-option>
                                        <el-option label="重点用户专题图" value="重点用户专题图"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据集名称">
                                    <el-input v-model="addDatasetForm.name" placeholder="请输入数据集名称"></el-input>
                                </el-form-item>
                                <el-form-item label="地址">
                                    <el-input v-model="addDatasetForm.url" placeholder="请输入接口地址"></el-input>
                                </el-form-item>
                                <el-form-item label="请求方式">
                                    <el-select v-model="addDatasetForm.method" placeholder="请选择请求方式" style="width: 100%;">
                                        <el-option label="GET" value="GET"></el-option>
                                        <el-option label="POST" value="POST"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据路径">
                                    <el-input v-model="addDatasetForm.dataPath" placeholder="请输入数据路径"></el-input>
                                </el-form-item>
                                <el-form-item label="请求头">
                                    <el-input v-model="addDatasetForm.headers" type="textarea" :rows="4" placeholder="请以json格式填写请求头"></el-input>
                                </el-form-item>
                            </el-form>
                            
                            <!-- 按钮组 -->
                            <div class="flex gap-2 mt-4" style="margin-left: 150px;">
                                <el-button @click="clearDatasetForm">清空</el-button>
                                <el-button type="info" @click="validateDataset" :disabled="addDatasetType !== 'api'">验证</el-button>
                                <el-button @click="addDatasetDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="saveDataset">保存</el-button>
                            </div>
                        </div>
                        
                        <!-- 右侧数据预览 -->
                        <div class="flex-1">
                            <div class="font-medium mb-2">数据预览</div>
                            <div class="border border-gray-300 rounded p-4 h-80 overflow-auto bg-gray-50">
                                <div v-if="previewData.length === 0" class="text-gray-500 text-center mt-20">
                                    点击验证按钮查看数据预览
                                </div>
                                <el-table v-else :data="previewData" size="small" style="width: 100%">
                                    <el-table-column prop="id" label="ID" width="60"></el-table-column>
                                    <el-table-column prop="name" label="名称"></el-table-column>
                                    <el-table-column prop="value" label="数值"></el-table-column>
                                    <el-table-column prop="time" label="时间"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Excel导入界面 -->
                    <div v-else-if="addDatasetType === 'excel'" class="flex gap-4">
                        <!-- 左侧表单 -->
                        <div class="flex-1">
                            <el-form :model="addDatasetForm" label-width="100px">
                                <el-form-item label="新增方式">
                                    <el-select v-model="addDatasetType" placeholder="请选择新增方式" style="width: 100%;">
                                        <el-option label="数据抽取" value="dataExtract"></el-option>
                                        <el-option label="接口" value="api"></el-option>
                                        <el-option label="Excel导入" value="excel"></el-option>
                                        <el-option label="模拟数据" value="mock"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="页面名称">
                                    <el-select v-model="addDatasetForm.page" placeholder="请选择页面名称" style="width: 100%;">
                                        <el-option label="资产一张图" value="资产一张图"></el-option>
                                        <el-option label="调度一张图" value="调度一张图"></el-option>
                                        <el-option label="监测数据专题图" value="监测数据专题图"></el-option>
                                        <el-option label="用户分布" value="用户分布"></el-option>
                                        <el-option label="重点用户专题图" value="重点用户专题图"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据集名称">
                                    <el-input v-model="addDatasetForm.name" placeholder="请输入数据集名称"></el-input>
                                </el-form-item>
                                <el-form-item label="Excel">
                                    <el-upload
                                        class="upload-demo"
                                        drag
                                        action="#"
                                        :auto-upload="false"
                                        :on-change="handleExcelChange"
                                        :before-upload="beforeExcelUpload"
                                        accept=".xlsx,.xls"
                                        :limit="1"
                                        :file-list="excelFileList"
                                    >
                                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                        <div class="el-upload__text">
                                            将文件拖到此处，或<em>点击上传</em>
                                        </div>
                                        <template #tip>
                                            <div class="el-upload__tip">
                                                Excel文件需小于500kb
                                            </div>
                                        </template>
                                    </el-upload>
                                </el-form-item>
                            </el-form>
                            
                            <!-- 按钮组 -->
                            <div class="flex gap-2 mt-4" style="margin-left: 150px;">
                                <el-button @click="clearDatasetForm">清空</el-button>
                                <el-button @click="addDatasetDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="saveDataset">保存</el-button>
                            </div>
                        </div>
                        
                        <!-- 右侧数据预览 -->
                        <div class="flex-1">
                            <div class="font-medium mb-2">数据预览</div>
                            <div class="border border-gray-300 rounded p-4 h-80 overflow-auto bg-gray-50">
                                <div v-if="previewData.length === 0" class="text-gray-500 text-center mt-20">
                                    请上传Excel文件查看数据预览
                                </div>
                                <el-table v-else :data="previewData" size="small" style="width: 100%">
                                    <el-table-column prop="id" label="ID" width="60"></el-table-column>
                                    <el-table-column prop="name" label="名称"></el-table-column>
                                    <el-table-column prop="value" label="数值"></el-table-column>
                                    <el-table-column prop="time" label="时间"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 模拟数据界面 -->
                    <div v-else-if="addDatasetType === 'mock'" class="flex gap-4">
                        <!-- 左侧表单 -->
                        <div class="flex-1">
                            <el-form :model="addDatasetForm" label-width="100px">
                                <el-form-item label="新增方式">
                                    <el-select v-model="addDatasetType" placeholder="请选择新增方式" style="width: 100%;">
                                        <el-option label="数据抽取" value="dataExtract"></el-option>
                                        <el-option label="接口" value="api"></el-option>
                                        <el-option label="Excel导入" value="excel"></el-option>
                                        <el-option label="模拟数据" value="mock"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="页面名称">
                                    <el-select v-model="addDatasetForm.page" placeholder="请选择页面名称" style="width: 100%;">
                                        <el-option label="资产一张图" value="资产一张图"></el-option>
                                        <el-option label="调度一张图" value="调度一张图"></el-option>
                                        <el-option label="监测数据专题图" value="监测数据专题图"></el-option>
                                        <el-option label="用户分布" value="用户分布"></el-option>
                                        <el-option label="重点用户专题图" value="重点用户专题图"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据集名称">
                                    <el-input v-model="addDatasetForm.name" placeholder="请输入数据集名称"></el-input>
                                </el-form-item>
                                <el-form-item label="添加列">
                                    <el-button type="primary" size="small" @click="addColumn">添加列</el-button>
                                </el-form-item>
                                
                                <!-- 列配置列表 -->
                                <div v-if="mockColumns.length > 0" class="mb-4">
                                    <div class="text-sm text-gray-600 mb-2" style="margin-left: 45px;">列配置：</div>
                                    <div class="space-y-2 max-h-40 overflow-y-auto" style="width: 400px; margin-left: 100px;">
                                        <div v-for="(column, index) in mockColumns" :key="index" class="flex gap-2 items-center p-2 border rounded">
                                            <el-input v-model="column.name" placeholder="列名" size="small" style="width: 120px;" @input="updatePreviewColumns" @blur="onColumnNameBlur"></el-input>
                                            <el-select v-model="column.type" placeholder="类型" size="small" style="width: 100px;">
                                                <el-option label="文本" value="text"></el-option>
                                                <el-option label="数值" value="number"></el-option>
                                                <el-option label="日期" value="date"></el-option>
                                            </el-select>
                                            <el-button type="danger" size="small" @click="deleteColumn(index)">删除</el-button>
                                        </div>
                                    </div>
                                </div>
                            </el-form>
                            
                            <!-- 按钮组 -->
                            <div class="flex gap-2 mt-4" style="margin-left: 150px;">
                                <el-button @click="clearDatasetForm">清空</el-button>
                                <el-button @click="addDatasetDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="saveDataset">保存</el-button>
                            </div>
                        </div>
                        
                        <!-- 右侧数据预览和添加数据 -->
                        <div class="flex-1">
                            <div class="flex justify-between items-center mb-2">
                                <div class="font-medium">数据预览</div>
                                <el-button type="primary" size="small" @click="addMockData" :disabled="mockColumns.length === 0">添加数据</el-button>
                            </div>
                            <div class="border border-gray-300 rounded p-4 h-80 overflow-auto bg-gray-50">
                                <div v-if="mockColumns.length === 0" class="text-gray-500 text-center mt-20">
                                    请先添加列，然后添加数据
                                </div>
                                <el-table v-else :data="mockData" size="small" style="width: 100%">
                                    <el-table-column label="序号" width="60">
                                        <template #default="scope">
                                            {{ scope.$index + 1 }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-for="(column, colIndex) in mockColumns" :key="`${colIndex}-${column.name}`" :prop="column.name" :label="column.name" width="120">
                                        <template #default="scope">
                                            <el-input v-model="scope.row[column.name]" size="small" placeholder="请输入数据"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="80">
                                        <template #default="scope">
                                            <el-button type="danger" size="small" @click="deleteMockData(scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 其他新增方式的占位 -->
                    <div v-else class="text-center text-gray-500 py-20">
                        {{ getAddTypeText() }}功能开发中...
                    </div>
                </el-dialog>
                <el-dialog v-model="editDatasetDialogVisible" title="修改数据集" width="600px" @close="resetEditDatasetForm">
                    <!-- 数据抽取界面 -->
                    <div v-if="editDatasetType === 'dataExtract'">
                        <el-form :model="editDatasetForm" label-width="100px">
                            <el-form-item label="创建方式">
                                <el-input value="数据抽取" disabled />
                            </el-form-item>
                                <el-form-item label="页面名称">
                                    <el-select v-model="editDatasetForm.page" placeholder="请选择页面名称" style="width: 100%;">
                                        <el-option label="资产一张图" value="资产一张图"></el-option>
                                        <el-option label="调度一张图" value="调度一张图"></el-option>
                                        <el-option label="监测数据专题图" value="监测数据专题图"></el-option>
                                        <el-option label="用户分布" value="用户分布"></el-option>
                                        <el-option label="重点用户专题图" value="重点用户专题图"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据集名称">
                                    <el-input v-model="editDatasetForm.name" placeholder="请输入数据集名称"></el-input>
                                </el-form-item>
                                <el-form-item label="数据源名称">
                                    <el-select v-model="editDatasetForm.source" placeholder="请选择数据源名称" style="width: 100%;">
                                        <el-option label="压力数据" value="压力数据"></el-option>
                                        <el-option label="流量数据" value="流量数据"></el-option>
                                        <el-option label="水质数据" value="水质数据"></el-option>
                                        <el-option label="营业数据" value="营业数据"></el-option>
                                        <el-option label="管线数据" value="管线数据"></el-option>
                                        <el-option label="模型数据" value="模型数据"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="SQL">
                                    <el-input v-model="editDatasetForm.sql" type="textarea" :rows="8" placeholder="请输入SQL语句"></el-input>
                                </el-form-item>
                            </el-form>
                            
                            <!-- 按钮组 -->
                            <div class="flex gap-2 mt-4" style="margin-left: 150px;">
                                <el-button @click="resetEditDatasetForm">重置</el-button>
                                <el-button @click="editDatasetDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="confirmEditDataset">保存</el-button>
                            </div>
                    </div>
                    
                    <!-- 接口界面 -->
                    <div v-else-if="editDatasetType === 'api'">
                        <el-form :model="editDatasetForm" label-width="100px">
                            <el-form-item label="创建方式">
                                <el-input value="接口" disabled />
                            </el-form-item>
                                <el-form-item label="页面名称">
                                    <el-select v-model="editDatasetForm.page" placeholder="请选择页面名称" style="width: 100%;">
                                        <el-option label="资产一张图" value="资产一张图"></el-option>
                                        <el-option label="调度一张图" value="调度一张图"></el-option>
                                        <el-option label="监测数据专题图" value="监测数据专题图"></el-option>
                                        <el-option label="用户分布" value="用户分布"></el-option>
                                        <el-option label="重点用户专题图" value="重点用户专题图"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据集名称">
                                    <el-input v-model="editDatasetForm.name" placeholder="请输入数据集名称"></el-input>
                                </el-form-item>
                                <el-form-item label="地址">
                                    <el-input v-model="editDatasetForm.url" placeholder="请输入接口地址"></el-input>
                                </el-form-item>
                                <el-form-item label="请求方式">
                                    <el-select v-model="editDatasetForm.method" placeholder="请选择请求方式" style="width: 100%;">
                                        <el-option label="GET" value="GET"></el-option>
                                        <el-option label="POST" value="POST"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据路径">
                                    <el-input v-model="editDatasetForm.dataPath" placeholder="请输入数据路径"></el-input>
                                </el-form-item>
                                <el-form-item label="请求头">
                                    <el-input v-model="editDatasetForm.headers" type="textarea" :rows="4" placeholder="请以json格式填写请求头"></el-input>
                                </el-form-item>
                            </el-form>
                            
                            <!-- 按钮组 -->
                            <div class="flex gap-2 mt-4" style="margin-left: 150px;">
                                <el-button @click="resetEditDatasetForm">重置</el-button>
                                <el-button @click="editDatasetDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="confirmEditDataset">保存</el-button>
                            </div>
                    </div>
                    
                    <!-- Excel导入界面 -->
                    <div v-else-if="editDatasetType === 'excel'">
                        <el-form :model="editDatasetForm" label-width="100px">
                            <el-form-item label="创建方式">
                                <el-input value="Excel导入" disabled />
                            </el-form-item>
                                <el-form-item label="页面名称">
                                    <el-select v-model="editDatasetForm.page" placeholder="请选择页面名称" style="width: 100%;">
                                        <el-option label="资产一张图" value="资产一张图"></el-option>
                                        <el-option label="调度一张图" value="调度一张图"></el-option>
                                        <el-option label="监测数据专题图" value="监测数据专题图"></el-option>
                                        <el-option label="用户分布" value="用户分布"></el-option>
                                        <el-option label="重点用户专题图" value="重点用户专题图"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据集名称">
                                    <el-input v-model="editDatasetForm.name" placeholder="请输入数据集名称"></el-input>
                                </el-form-item>
                                <el-form-item label="Excel">
                                    <el-upload
                                        class="upload-demo"
                                        drag
                                        action="#"
                                        :auto-upload="false"
                                        :on-change="handleEditExcelChange"
                                        :before-upload="beforeExcelUpload"
                                        accept=".xlsx,.xls"
                                        :limit="1"
                                        :file-list="editExcelFileList"
                                    >
                                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                        <div class="el-upload__text">
                                            将文件拖到此处，或<em>点击上传</em>
                                        </div>
                                        <template #tip>
                                            <div class="el-upload__tip">
                                                Excel文件需小于500kb
                                            </div>
                                        </template>
                                    </el-upload>
                                </el-form-item>
                            </el-form>
                            
                            <!-- 按钮组 -->
                            <div class="flex gap-2 mt-4" style="margin-left: 150px;">
                                <el-button @click="resetEditDatasetForm">重置</el-button>
                                <el-button @click="editDatasetDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="confirmEditDataset">保存</el-button>
                            </div>
                    </div>
                    
                    <!-- 模拟数据界面 -->
                    <div v-else-if="editDatasetType === 'mock'">
                        <el-form :model="editDatasetForm" label-width="100px">
                            <el-form-item label="创建方式">
                                <el-input value="模拟数据" disabled />
                            </el-form-item>
                                <el-form-item label="页面名称">
                                    <el-select v-model="editDatasetForm.page" placeholder="请选择页面名称" style="width: 100%;">
                                        <el-option label="资产一张图" value="资产一张图"></el-option>
                                        <el-option label="调度一张图" value="调度一张图"></el-option>
                                        <el-option label="监测数据专题图" value="监测数据专题图"></el-option>
                                        <el-option label="用户分布" value="用户分布"></el-option>
                                        <el-option label="重点用户专题图" value="重点用户专题图"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据集名称">
                                    <el-input v-model="editDatasetForm.name" placeholder="请输入数据集名称"></el-input>
                                </el-form-item>
                                <el-form-item label="列配置">
                                    <div class="border border-gray-300 rounded p-4 bg-gray-50">
                                        <div class="flex justify-between items-center mb-3">
                                            <span class="font-medium">数据列</span>
                                            <el-button type="primary" size="small" @click="addEditColumn">添加列</el-button>
                                        </div>
                                        <div v-for="(column, index) in editMockColumns" :key="index" class="flex gap-2 mb-2">
                                            <el-input v-model="column.name" placeholder="列名" style="width: 150px;" @blur="onEditColumnNameBlur" />
                                            <el-select v-model="column.type" placeholder="类型" style="width: 100px;">
                                                <el-option label="文本" value="text"></el-option>
                                                <el-option label="数字" value="number"></el-option>
                                                <el-option label="日期" value="date"></el-option>
                                            </el-select>
                                            <el-button type="danger" size="small" @click="deleteEditColumn(index)">删除</el-button>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="数据预览">
                                    <div class="border border-gray-300 rounded p-4 bg-gray-50">
                                        <div class="flex justify-between items-center mb-3">
                                            <span class="font-medium">模拟数据</span>
                                            <el-button type="primary" size="small" @click="addEditMockData">添加数据</el-button>
                                        </div>
                                        <el-table :data="editMockData" size="small" style="width: 100%">
                                            <el-table-column prop="index" label="序号" width="60"></el-table-column>
                                            <el-table-column v-for="column in editMockColumns" :key="column.name" :prop="column.name" :label="column.name">
                                                <template #default="scope">
                                                    <el-input v-model="scope.row[column.name]" size="small" />
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="操作" width="80">
                                                <template #default="scope">
                                                    <el-button type="danger" size="small" @click="deleteEditMockData(scope.$index)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </el-form-item>
                            </el-form>
                            
                            <!-- 按钮组 -->
                            <div class="flex gap-2 mt-4" style="margin-left: 150px;">
                                <el-button @click="resetEditDatasetForm">重置</el-button>
                                <el-button @click="editDatasetDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="confirmEditDataset">保存</el-button>
                            </div>
                    </div>
                </el-dialog>
                <div class="flex gap-6">
                    <!-- 左侧目录树 -->
                    <div class="w-56 bg-white rounded shadow p-4">
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
                        <el-table :data="pagedDatasetList" border style="width: 100%" @selection-change="handleDatasetSelectionChange">
                            <el-table-column type="selection" width="40" />
                            <el-table-column prop="index" label="序号" width="60" />
                            <el-table-column prop="name" label="数据集名称" width="140" />
                            <el-table-column prop="source" label="数据源名称" width="125" />
                            <el-table-column prop="createdAt" label="创建时间" width="160" />
                            <el-table-column prop="updatedAt" label="更新时间" width="160" />
                            <el-table-column prop="mode" label="创建方式" width="90" />
                            <el-table-column prop="enabled" label="是否启用" width="85">
                                <template #default="scope">
                                    <div v-if="enabledSelectVisible[scope.row.index]" class="w-full">
                                        <el-select
                                            v-model="scope.row.enabled"
                                            placeholder="请选择"
                                            size="small"
                                            style="width: 100%"
                                            @change="handleEnableChange(scope.row)"
                                            @blur="hideEnabledSelect(scope.row.index)"
                                            ref="enabledSelectRef"
                                        >
                                            <el-option label="是" :value="true" />
                                            <el-option label="否" :value="false" />
                                        </el-select>
                                    </div>
                                    <div v-else @click="showEnabledSelect(scope.row.index)" class="cursor-pointer">
                                        <el-tag :type="scope.row.enabled ? 'success' : 'info'" class="w-full text-center">
                                            {{ scope.row.enabled ? '是' : '否' }}
                                        </el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="260">
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
                        <el-table-column prop="name" label="画布名称" width="100" />
                        <el-table-column prop="link" label="发布链接" width="155">
                            <template #default="scope">
                                <el-link :href="scope.row.link" target="_blank">{{ scope.row.link }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="publishTime" label="发布时间" width="145" />
                        <el-table-column prop="type" label="发布方式" width="85" />
                        <el-table-column prop="validTime" label="有效时间" width="210" />
                        <el-table-column prop="visitCount" label="访问次数" width="85" />
                        <el-table-column label="操作" width="240">
                            <template #default="scope">
                                <el-button size="small" type="info" plain @click="showVisitDialog(scope.row)">访问情况</el-button>
                                <el-button size="small" type="warning" plain @click="showEditDialog(scope.row)">修改</el-button>
                                <el-button size="small" type="danger" plain @click="confirmDeletePublish(scope.row)">删除</el-button>
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
            
            <template v-else-if="activeMenu === 'yemian'">
                <div class="flex h-full">
                    <!-- 左侧菜单栏 -->
                    <div class="w-64 bg-white rounded shadow p-4 mr-4">
                        <el-menu
                            :default-active="activeTemplateCategory"
                            @select="handleTemplateCategorySelect"
                            class="border-0"
                            style="--el-menu-item-height: 40px;"
                        >
                            <el-menu-item index="all">
                                <el-icon><FolderOpened /></el-icon>
                                <span>全部页面</span>
                            </el-menu-item>
                            <el-menu-item index="yunshang">
                                <el-icon><Monitor /></el-icon>
                                <span>云上中心</span>
                            </el-menu-item>
                            <el-menu-item index="gongshui">
                                <el-icon><Management /></el-icon>
                                <span>供水一体化管控主题</span>
                            </el-menu-item>
                            <el-menu-item index="quanyaosu">
                                <el-icon><DataLine /></el-icon>
                                <span>供水全要素管理主题</span>
                            </el-menu-item>
                            <el-menu-item index="yingji">
                                <el-icon><Warning /></el-icon>
                                <span>应急指挥主题</span>
                            </el-menu-item>
                            <el-menu-item index="laishui">
                                <el-icon><TrendCharts /></el-icon>
                                <span>来水专题</span>
                            </el-menu-item>
                            <el-menu-item index="yingye">
                                <el-icon><Goods /></el-icon>
                                <span>营业主题</span>
                            </el-menu-item>
                            <el-menu-item index="kefu">
                                <el-icon><Service /></el-icon>
                                <span>客服专题</span>
                            </el-menu-item>
                            <el-menu-item index="guanwang">
                                <el-icon><Connection /></el-icon>
                                <span>管网专题</span>
                            </el-menu-item>
                            <el-menu-item index="shuizhi">
                                <el-icon><Odometer /></el-icon>
                                <span>水质专题</span>
                            </el-menu-item>
                            <el-menu-item index="ergong">
                                <el-icon><SetUp /></el-icon>
                                <span>二供专题</span>
                            </el-menu-item>
                            <el-menu-item index="pad">
                                <el-icon><Monitor /></el-icon>
                                <span>Pad端一张图</span>
                            </el-menu-item>
                        </el-menu>
                    </div>
                    
                    <!-- 右侧页面展示 -->
                    <div class="flex-1 bg-white rounded shadow p-4">
                        <!-- 顶部工具栏 -->
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-semibold">页面列表</h3>
                            <el-button 
                                v-if="activeTemplateCategory !== 'all'" 
                                type="primary" 
                                @click="showAddPageDialog"
                            >
                                <el-icon><Plus /></el-icon>
                                新增页面
                            </el-button>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-6">
                            <div v-for="template in filteredTemplates" :key="template.id" class="template-card">
                                <div class="template-image">
                                    <img 
                                        :src="template.image" 
                                        :alt="template.name" 
                                        class="w-full h-48 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" 
                                        @click="viewTemplate(template)"
                                    />
                                </div>
                                <div class="template-info mt-3">
                                    <h4 class="text-lg font-semibold text-center mb-3">{{ template.name.replace('模版', '页面') }}</h4>
                                    <div class="flex justify-center gap-2">
                                        <el-button size="small" type="primary" plain @click="viewTemplate(template)">查看</el-button>
                                        <el-button size="small" type="warning" plain @click="editTemplate(template)">编辑</el-button>
                                        <el-button size="small" type="success" plain @click="exportTemplate(template)">导出</el-button>
                                        <el-button size="small" type="danger" plain @click="deleteTemplate(template)">删除</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 页面查看对话框 -->
                <el-dialog v-model="templateViewDialogVisible" title="页面预览" width="60%" :before-close="closeTemplateView">
                    <div class="template-view-container">
                        <div class="template-info mb-4">
                            <h3 class="text-xl font-semibold mb-2">{{ currentTemplate?.name.replace('模版', '页面') }}</h3>
                            <p class="text-gray-600">分类：{{ getCategoryName(currentTemplate?.category) }}</p>
                        </div>
                        <div class="template-image-container">
                            <img 
                                :src="currentTemplate?.image" 
                                :alt="currentTemplate?.name" 
                                class="w-full h-auto max-h-[60vh] object-contain rounded shadow-lg"
                            />
                        </div>
                    </div>
                </el-dialog>
                
                <!-- 新增页面对话框 -->
                <el-dialog v-model="addPageDialogVisible" title="新增页面" width="500px" @close="closeAddPageDialog">
                    <div class="add-page-container">
                        <el-form :model="addPageForm" label-width="80px">
                            <el-form-item label="页面名称" required>
                                <el-input 
                                    v-model="addPageForm.name" 
                                    placeholder="请输入页面名称"
                                    maxlength="50"
                                    show-word-limit
                                />
                            </el-form-item>
                            <el-form-item label="页面描述">
                                <el-input 
                                    v-model="addPageForm.description" 
                                    type="textarea" 
                                    :rows="4"
                                    placeholder="请输入页面描述"
                                    maxlength="200"
                                    show-word-limit
                                />
                            </el-form-item>
                            <el-form-item label="所属分类">
                                <el-select v-model="addPageForm.category" placeholder="请选择所属分类" style="width: 100%;">
                                    <el-option label="云上中心" value="yunshang" />
                                    <el-option label="供水一体化管控主题" value="gongshui" />
                                    <el-option label="供水全要素管理主题" value="quanyaosu" />
                                    <el-option label="应急指挥主题" value="yingji" />
                                    <el-option label="来水专题" value="laishui" />
                                    <el-option label="营业主题" value="yingye" />
                                    <el-option label="客服专题" value="kefu" />
                                    <el-option label="管网专题" value="guanwang" />
                                    <el-option label="水质专题" value="shuizhi" />
                                    <el-option label="二供专题" value="ergong" />
                                    <el-option label="Pad端一张图" value="pad" />
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    
                    <template #footer>
                        <el-button @click="closeAddPageDialog">取消</el-button>
                        <el-button type="primary" @click="confirmAddPage" :disabled="!addPageForm.name.trim()">确认新增</el-button>
                    </template>
                </el-dialog>
                

            </template>
            <template v-else-if="activeMenu === 'moban'">
                <div class="flex h-full">
                    <!-- 左侧菜单栏 -->
                    <div class="w-64 bg-white rounded shadow p-4 mr-4">
                        <el-menu
                            :default-active="activeTemplateCategory"
                            @select="handleTemplateCategorySelect"
                            class="border-0"
                            style="--el-menu-item-height: 40px;"
                        >
                            <el-menu-item index="all">
                                <el-icon><FolderOpened /></el-icon>
                                <span>全部模版</span>
                            </el-menu-item>
                            <el-menu-item index="yunshang">
                                <el-icon><Monitor /></el-icon>
                                <span>云上中心</span>
                            </el-menu-item>
                            <el-menu-item index="gongshui">
                                <el-icon><Management /></el-icon>
                                <span>供水一体化管控主题</span>
                            </el-menu-item>
                            <el-menu-item index="quanyaosu">
                                <el-icon><DataLine /></el-icon>
                                <span>供水全要素管理主题</span>
                            </el-menu-item>
                            <el-menu-item index="yingji">
                                <el-icon><Warning /></el-icon>
                                <span>应急指挥主题</span>
                            </el-menu-item>
                            <el-menu-item index="laishui">
                                <el-icon><TrendCharts /></el-icon>
                                <span>来水专题</span>
                            </el-menu-item>
                            <el-menu-item index="yingye">
                                <el-icon><Goods /></el-icon>
                                <span>营业主题</span>
                            </el-menu-item>
                            <el-menu-item index="kefu">
                                <el-icon><Service /></el-icon>
                                <span>客服专题</span>
                            </el-menu-item>
                            <el-menu-item index="guanwang">
                                <el-icon><Connection /></el-icon>
                                <span>管网专题</span>
                            </el-menu-item>
                            <el-menu-item index="shuizhi">
                                <el-icon><Odometer /></el-icon>
                                <span>水质专题</span>
                            </el-menu-item>
                            <el-menu-item index="ergong">
                                <el-icon><SetUp /></el-icon>
                                <span>二供专题</span>
                            </el-menu-item>
                            <el-menu-item index="pad">
                                <el-icon><Monitor /></el-icon>
                                <span>Pad端一张图</span>
                            </el-menu-item>
                        </el-menu>
                    </div>
                    
                    <!-- 右侧模版展示 -->
                    <div class="flex-1 bg-white rounded shadow p-4">
                        <!-- 顶部工具栏 -->
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-semibold">模版列表</h3>
                            <el-button 
                                v-if="activeTemplateCategory !== 'all'" 
                                type="primary" 
                                @click="showImportDialog"
                            >
                                <el-icon><UploadFilled /></el-icon>
                                导入模版
                            </el-button>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-6">
                            <div v-for="template in filteredTemplates" :key="template.id" class="template-card">
                                <div class="template-image">
                                    <img :src="template.image" :alt="template.name" class="w-full h-48 object-cover rounded" />
                                </div>
                                <div class="template-info mt-3">
                                    <h4 class="text-lg font-semibold text-center mb-3">{{ template.name }}</h4>
                                    <div class="flex justify-center gap-2">
                                        <el-button size="small" type="primary" plain @click="viewTemplate(template)">查看</el-button>
                                        <el-button size="small" type="warning" plain @click="editTemplate(template)">修改</el-button>
                                        <el-button size="small" type="success" plain @click="exportTemplate(template)">导出</el-button>
                                        <el-button size="small" type="danger" plain @click="deleteTemplate(template)">删除</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 模版查看对话框 -->
                <el-dialog v-model="templateViewDialogVisible" title="模版预览" width="60%" :before-close="closeTemplateView">
                    <div class="template-view-container">
                        <div class="template-info mb-4">
                            <h3 class="text-xl font-semibold mb-2">{{ currentTemplate?.name }}</h3>
                            <p class="text-gray-600">分类：{{ getCategoryName(currentTemplate?.category) }}</p>
                        </div>
                        <div class="template-image-container">
                            <img 
                                :src="currentTemplate?.image" 
                                :alt="currentTemplate?.name" 
                                class="w-full h-auto max-h-[60vh] object-contain rounded shadow-lg"
                            />
                        </div>
                    </div>
                </el-dialog>
                
                <!-- 模版导入对话框 -->
                <el-dialog v-model="importDialogVisible" title="导入模版" width="500px" @close="closeImportDialog">
                    <div class="import-container">
                        <el-upload
                            ref="uploadRef"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleFileChange"
                            :before-upload="beforeUpload"
                            accept=".zip"
                            drag
                            class="upload-area"
                        >
                            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                            <div class="el-upload__text">
                                将文件拖到此处，或<em>点击上传</em>
                            </div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    只能上传zip文件，且不超过10MB
                                </div>
                            </template>
                        </el-upload>
                        
                        <div class="mt-4 text-sm text-gray-600">
                            <p>支持的文件格式：.zip</p>
                            <p>文件大小限制：10MB</p>
                        </div>
                    </div>
                    
                    <template #footer>
                        <el-button @click="closeImportDialog">取消</el-button>
                        <el-button type="primary" @click="confirmImport" :disabled="!selectedFile">确认导入</el-button>
                    </template>
                </el-dialog>
            </template>
        </main>
        
        <!-- 页面设计器 -->
        <div v-if="pageDesignerVisible" class="page-designer-fullscreen">
            <div class="page-designer-container">
                <!-- 左侧组件列表 -->
                <div class="designer-left-panel">
                    <div v-if="activeComponentCategory === 'components'" class="component-list">
                        <h4 class="text-lg font-semibold mb-4">组件列表</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <div 
                                v-for="component in componentList" 
                                :key="component.type"
                                class="component-item"
                                :draggable="component.type !== 'map' && component.type !== 'bar'"
                                :data-type="component.type"
                                @dragstart="handleDragStart($event, component)"
                                @click="handleComponentClick(component)"
                            >
                                <div class="component-icon">
                                    <el-icon><component :is="component.icon" /></el-icon>
                                </div>
                                <div class="component-name">{{ component.name }}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else-if="activeComponentCategory === 'maps'" class="map-list">
                        <div class="flex items-center mb-4">
                            <el-button size="small" @click="activeComponentCategory = 'components'" class="mr-2">
                                <el-icon><ArrowLeft /></el-icon>
                                返回
                            </el-button>
                            <h4 class="text-lg font-semibold">地图列表</h4>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div 
                                v-for="map in mapList" 
                                :key="map.type"
                                class="map-item"
                                draggable="true"
                                @dragstart="handleDragStart($event, map)"
                            >
                                <div class="map-icon">
                                    <el-icon><component :is="map.icon" /></el-icon>
                                </div>
                                <div class="map-name">{{ map.name }}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else-if="activeComponentCategory === 'bars'" class="bar-list">
                        <div class="flex items-center mb-4">
                            <el-button size="small" @click="activeComponentCategory = 'components'" class="mr-2">
                                <el-icon><ArrowLeft /></el-icon>
                                返回
                            </el-button>
                            <h4 class="text-lg font-semibold">柱图列表</h4>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div 
                                v-for="bar in barList" 
                                :key="bar.type"
                                class="bar-item"
                                draggable="true"
                                @dragstart="handleDragStart($event, bar)"
                            >
                                <div class="bar-icon">
                                    <el-icon><component :is="bar.icon" /></el-icon>
                                </div>
                                <div class="bar-name">{{ bar.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 中间画布 -->
                <div class="designer-center-panel">
                    <div 
                        class="canvas-container"
                        :style="{ backgroundColor: canvasConfig.backgroundColor }"
                        @dragover="handleDragOver"
                        @drop="handleDrop"
                    >
                        <div v-if="canvasComponents.length === 0" class="canvas-placeholder">
                            <el-icon class="text-4xl text-gray-300 mb-2"><Plus /></el-icon>
                            <p class="text-gray-500">拖拽组件到此处开始设计</p>
                        </div>
                        <div 
                            v-for="(component, index) in canvasComponents" 
                            :key="component.id"
                            class="canvas-component"
                            :style="component.style"
                            @click="selectComponent(index)"
                            :class="{ 'selected': selectedComponentIndex === index }"
                        >
                            <div class="component-content">
                                <el-icon><component :is="component.icon" /></el-icon>
                                <span>{{ component.name }}</span>
                            </div>
                            <div v-if="selectedComponentIndex === index" class="component-actions">
                                <el-button size="small" type="danger" @click="removeComponent(index)">删除</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 右侧配置面板 -->
                <div class="designer-right-panel">
                    <h4 class="text-lg font-semibold mb-4">{{ currentDesigningType === 'page' ? '页面配置' : '模版配置' }}</h4>
                    <el-form :model="canvasConfig" label-width="80px">
                        <el-form-item :label="currentDesigningType === 'page' ? '页面名称' : '模版名称'">
                            <el-input v-model="canvasConfig.name" :placeholder="currentDesigningType === 'page' ? '请输入页面名称' : '请输入模版名称'" />
                        </el-form-item>
                        <el-form-item label="背景颜色">
                            <el-color-picker v-model="canvasConfig.backgroundColor" />
                        </el-form-item>
                    </el-form>
                    
                    <div class="mt-6">
                        <el-button @click="closePageDesigner" class="w-full mb-2">退出设计器</el-button>
                        <el-button type="primary" @click="savePageDesign" class="w-full">{{ currentDesigningType === 'page' ? '保存页面' : '保存模版' }}</el-button>
                    </div>
                </div>
            </div>
        </div>
        
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
import { Monitor, DataLine, Setting, Lock, Connection, Tools, Fold, Expand, HomeFilled, Timer, Warning, TrendCharts, Odometer, DocumentDelete, Download, Edit, Refresh, Delete, Position, Collection, Link, Goods, SetUp, FolderOpened, Share, Management, Key, User, UserFilled, CircleCheck, Notebook, Guide, Bell, Document, Service, UploadFilled, FullScreen, Plus, ArrowLeft, Search } from '@element-plus/icons-vue';
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';
import { dayjs } from 'element-plus';

import { useRouter } from 'vue-router';
// const logoUrl = 'http://192.168.120.103:5173/img/logo.png';
// const logoUrl = logoImg;
const avatarUrl = 'https://ai-public.mastergo.com/ai/img_res/02eb0a5c2d4bd29638dcd199c1bd8b0a.jpg';
const isCollapse = ref(false);
const activeMenu = ref('shujuyuan');
const dateRange = ref([]);
const menus = ref([
    { key: 'shujuyuan', label: '数据源管理', icon: 'Monitor' },
    { key: 'shujuji', label: '数据集管理', icon: 'DataLine' },
    // { key: 'shejiqi', label: '页面设计器', icon: 'Tools' },
    { key: 'yemian', label: '页面管理', icon: 'Document' },
    { key: 'moban', label: '模版管理', icon: 'FolderOpened' },
    { key: 'fabu', label: '发布管理', icon: 'Share' }
]);
const router = useRouter();
function handleSelect(key, keyPath) {
    router.push(key);
    activeMenu.value = key;
};

import { ElMessage, ElMessageBox } from 'element-plus';

// 数据源管理相关
const activeDataSourceType = ref('database'); // 'database' 或 'api'

// 查询表单
const searchForm = reactive({
    name: '',
    address: '',
    databaseType: ''
});

// 数据库数据源相关
const databaseDataSourceList = ref([
    { id: 1, name: '水务中台数据库', type: 'MySQL', host: '192.168.1.100', port: '3306', database: 'water_system', status: 'connected', createTime: '2025-01-17 10:00:00' },
    { id: 2, name: '监控数据库', type: 'PostgreSQL', host: '192.168.1.101', port: '5432', database: 'monitor_db', status: 'connected', createTime: '2025-01-17 11:00:00' },
    { id: 3, name: '历史数据库', type: 'Oracle', host: '192.168.1.102', port: '1521', database: 'history_db', status: 'disconnected', createTime: '2025-01-17 12:00:00' }
]);

const addDatabaseDialogVisible = ref(false);
const databaseForm = reactive({
    name: '',
    type: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
});

// 接口数据源相关
const apiDataSourceList = ref([
    { id: 1, name: '水务API接口', url: 'http://api.water.com/v1/data', method: 'GET', status: 'available', createTime: '2025-01-17 10:00:00' },
    { id: 2, name: '监控API接口', url: 'http://api.monitor.com/v1/status', method: 'POST', status: 'available', createTime: '2025-01-17 11:00:00' },
    { id: 3, name: '第三方API接口', url: 'http://api.third.com/v1/weather', method: 'GET', status: 'unavailable', createTime: '2025-01-17 12:00:00' }
]);

const addApiDialogVisible = ref(false);
const apiForm = reactive({
    name: '',
    url: '',
    method: '',
    headers: '',
    auth: ''
});

// 修改数据库数据源相关
const editDatabaseDialogVisible = ref(false);
const editDatabaseForm = reactive({
    id: null,
    name: '',
    type: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
});

// 修改接口数据源相关
const editApiDialogVisible = ref(false);
const editApiForm = reactive({
    id: null,
    name: '',
    url: '',
    method: '',
    headers: '',
    auth: ''
});

// 数据源管理相关方法
function handleDataSourceTypeChange(type) {
    activeDataSourceType.value = type;
    // 切换类型时重置查询条件
    resetSearch();
}

// 计算属性：过滤后的数据库数据源列表
const filteredDatabaseDataSourceList = computed(() => {
    let filtered = databaseDataSourceList.value;
    
    if (searchForm.name.trim()) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchForm.name.toLowerCase())
        );
    }
    
    if (searchForm.databaseType) {
        filtered = filtered.filter(item => 
            item.type === searchForm.databaseType
        );
    }
    
    if (searchForm.address.trim()) {
        filtered = filtered.filter(item => 
            item.host.toLowerCase().includes(searchForm.address.toLowerCase())
        );
    }
    
    return filtered;
});

// 计算属性：过滤后的接口数据源列表
const filteredApiDataSourceList = computed(() => {
    let filtered = apiDataSourceList.value;
    
    if (searchForm.name.trim()) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchForm.name.toLowerCase())
        );
    }
    
    if (searchForm.address.trim()) {
        filtered = filtered.filter(item => 
            item.url.toLowerCase().includes(searchForm.address.toLowerCase())
        );
    }
    
    return filtered;
});

// 查询方法
function searchDataSources() {
    // 查询逻辑通过计算属性自动处理
    ElMessage.success('查询完成');
}

// 重置查询
function resetSearch() {
    searchForm.name = '';
    searchForm.address = '';
    searchForm.databaseType = '';
}

function showAddDatabaseDialog() {
    addDatabaseDialogVisible.value = true;
    resetDatabaseForm();
}

function resetDatabaseForm() {
    databaseForm.name = '';
    databaseForm.type = '';
    databaseForm.host = '';
    databaseForm.port = '';
    databaseForm.database = '';
    databaseForm.username = '';
    databaseForm.password = '';
}

function testDatabaseConnection(dataSource = null) {
    const source = dataSource || databaseForm;
    ElMessage.success(`数据库"${source.name}"连接测试成功`);
}

function confirmAddDatabase() {
    if (!databaseForm.name || !databaseForm.type || !databaseForm.host || !databaseForm.port || !databaseForm.database || !databaseForm.username || !databaseForm.password) {
        ElMessage.warning('请填写完整信息');
        return;
    }
    
    const newDataSource = {
        id: databaseDataSourceList.value.length + 1,
        name: databaseForm.name,
        type: databaseForm.type,
        host: databaseForm.host,
        port: databaseForm.port,
        database: databaseForm.database,
        status: 'connected',
        createTime: new Date().toLocaleString()
    };
    
    databaseDataSourceList.value.push(newDataSource);
    ElMessage.success('数据库数据源添加成功');
    addDatabaseDialogVisible.value = false;
    resetDatabaseForm();
}

function editDatabaseDataSource(dataSource) {
    // 填充编辑表单数据
    editDatabaseForm.id = dataSource.id;
    editDatabaseForm.name = dataSource.name;
    editDatabaseForm.type = dataSource.type;
    editDatabaseForm.host = dataSource.host;
    editDatabaseForm.port = dataSource.port;
    editDatabaseForm.database = dataSource.database;
    editDatabaseForm.username = dataSource.username || '';
    editDatabaseForm.password = dataSource.password || '';
    
    // 打开编辑对话框
    editDatabaseDialogVisible.value = true;
}

function deleteDatabaseDataSource(dataSource) {
    ElMessageBox.confirm(`确定要删除数据库数据源"${dataSource.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const index = databaseDataSourceList.value.findIndex(item => item.id === dataSource.id);
        if (index !== -1) {
            databaseDataSourceList.value.splice(index, 1);
            ElMessage.success('删除成功');
        }
    }).catch(() => {
        // 用户取消删除
    });
}

function showAddApiDialog() {
    addApiDialogVisible.value = true;
    resetApiForm();
}

function resetApiForm() {
    apiForm.name = '';
    apiForm.url = '';
    apiForm.method = '';
    apiForm.headers = '';
    apiForm.auth = '';
}

function testApiConnection(dataSource = null) {
    const source = dataSource || apiForm;
    ElMessage.success(`接口"${source.name}"连接测试成功`);
}

function confirmAddApi() {
    if (!apiForm.name || !apiForm.url || !apiForm.method) {
        ElMessage.warning('请填写完整信息');
        return;
    }
    
    const newDataSource = {
        id: apiDataSourceList.value.length + 1,
        name: apiForm.name,
        url: apiForm.url,
        method: apiForm.method,
        status: 'available',
        createTime: new Date().toLocaleString()
    };
    
    apiDataSourceList.value.push(newDataSource);
    ElMessage.success('接口数据源添加成功');
    addApiDialogVisible.value = false;
    resetApiForm();
}

function editApiDataSource(dataSource) {
    // 填充编辑表单数据
    editApiForm.id = dataSource.id;
    editApiForm.name = dataSource.name;
    editApiForm.url = dataSource.url;
    editApiForm.method = dataSource.method;
    editApiForm.headers = dataSource.headers || '';
    editApiForm.auth = dataSource.auth || '';
    
    // 打开编辑对话框
    editApiDialogVisible.value = true;
}

function deleteApiDataSource(dataSource) {
    ElMessageBox.confirm(`确定要删除接口数据源"${dataSource.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const index = apiDataSourceList.value.findIndex(item => item.id === dataSource.id);
        if (index !== -1) {
            apiDataSourceList.value.splice(index, 1);
            ElMessage.success('删除成功');
        }
    }).catch(() => {
        // 用户取消删除
    });
}

// 修改数据库数据源相关方法
function resetEditDatabaseForm() {
    editDatabaseForm.id = null;
    editDatabaseForm.name = '';
    editDatabaseForm.type = '';
    editDatabaseForm.host = '';
    editDatabaseForm.port = '';
    editDatabaseForm.database = '';
    editDatabaseForm.username = '';
    editDatabaseForm.password = '';
}

function confirmEditDatabase() {
    if (!editDatabaseForm.name || !editDatabaseForm.type || !editDatabaseForm.host || !editDatabaseForm.port || !editDatabaseForm.database || !editDatabaseForm.username || !editDatabaseForm.password) {
        ElMessage.warning('请填写完整信息');
        return;
    }
    
    // 更新数据库数据源列表中的数据
    const index = databaseDataSourceList.value.findIndex(item => item.id === editDatabaseForm.id);
    if (index !== -1) {
        databaseDataSourceList.value[index] = {
            ...databaseDataSourceList.value[index],
            name: editDatabaseForm.name,
            type: editDatabaseForm.type,
            host: editDatabaseForm.host,
            port: editDatabaseForm.port,
            database: editDatabaseForm.database,
            status: 'connected' // 修改后重新设置为已连接状态
        };
        ElMessage.success('数据库数据源修改成功');
        editDatabaseDialogVisible.value = false;
        resetEditDatabaseForm();
    }
}

// 修改接口数据源相关方法
function resetEditApiForm() {
    editApiForm.id = null;
    editApiForm.name = '';
    editApiForm.url = '';
    editApiForm.method = '';
    editApiForm.headers = '';
    editApiForm.auth = '';
}

function confirmEditApi() {
    if (!editApiForm.name || !editApiForm.url || !editApiForm.method) {
        ElMessage.warning('请填写完整信息');
        return;
    }
    
    // 更新接口数据源列表中的数据
    const index = apiDataSourceList.value.findIndex(item => item.id === editApiForm.id);
    if (index !== -1) {
        apiDataSourceList.value[index] = {
            ...apiDataSourceList.value[index],
            name: editApiForm.name,
            url: editApiForm.url,
            method: editApiForm.method,
            status: 'available' // 修改后重新设置为可用状态
        };
        ElMessage.success('接口数据源修改成功');
        editApiDialogVisible.value = false;
        resetEditApiForm();
    }
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
    { index: 1, name: '水压统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '数据抽取', enabled: true },
    { index: 2, name: '水流量统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '接口', enabled: false },
    { index: 3, name: '今日供水量', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: 'Excel导入', enabled: true },
    { index: 4, name: '昨日供水量', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '模拟数据', enabled: false },
    { index: 5, name: '供水合格率', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '数据抽取', enabled: true },
    { index: 6, name: '二次供水泵房统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '接口', enabled: true },
    { index: 7, name: '进厂浊度', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: 'Excel导入', enabled: true },
    { index: 8, name: '出厂浊度', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '模拟数据', enabled: false },
    { index: 9, name: '出厂余氯', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '数据抽取', enabled: true },
    { index: 10, name: '水池统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '接口', enabled: true },
    { index: 11, name: '水箱统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: 'Excel导入', enabled: true },
    { index: 12, name: '营收统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '模拟数据', enabled: false },
    { index: 13, name: '工单统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '数据抽取', enabled: false },
    { index: 14, name: '远传抄表率', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: '接口', enabled: true },
    { index: 15, name: '取水量统计', source: '水务中台数据源', createdAt: '2025-07-17 09:15', updatedAt: '2025-07-17 09:15', mode: 'Excel导入', enabled: true },
];
const datasetList = ref([]);
const selectedDatasetRows = ref([]);
const enabledSelectVisible = ref({});
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

function handleDatasetSelectionChange(selection) {
    selectedDatasetRows.value = selection;
}

function handleEnableChange(row) {
    ElMessage.success(`数据集"${row.name}"已${row.enabled ? '启用' : '禁用'}`);
    // 选择后隐藏下拉框
    hideEnabledSelect(row.index);
}

function showEnabledSelect(index) {
    enabledSelectVisible.value[index] = true;
}

function hideEnabledSelect(index) {
    enabledSelectVisible.value[index] = false;
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
const addDatasetType = ref('dataExtract');
const addDatasetForm = reactive({
    page: '',
    name: '',
    source: '',
    sql: '',
    url: '',
    method: '',
    dataPath: '',
    headers: ''
});
const previewData = ref([]);
const excelFileList = ref([]);
const mockColumns = ref([]);
const mockData = ref([]);

function resetAddDatasetForm() {
    addDatasetForm.page = '';
    addDatasetForm.name = '';
    addDatasetForm.source = '';
    addDatasetForm.sql = '';
    addDatasetForm.url = '';
    addDatasetForm.method = '';
    addDatasetForm.dataPath = '';
    addDatasetForm.headers = '';
    addDatasetType.value = 'dataExtract';
    previewData.value = [];
    excelFileList.value = [];
    mockColumns.value = [];
    mockData.value = [];
}

function clearDatasetForm() {
    resetAddDatasetForm();
}

function validateDataset() {
    if (addDatasetType.value === 'dataExtract') {
        if (!addDatasetForm.sql.trim()) {
            ElMessage.warning('请先输入SQL语句');
            return;
        }
        
        // 模拟数据验证和预览
        previewData.value = [
            { id: 1, name: '测点A', value: '0.25MPa', time: '2025-07-17 10:00:00' },
            { id: 2, name: '测点B', value: '0.28MPa', time: '2025-07-17 10:00:00' },
            { id: 3, name: '测点C', value: '0.22MPa', time: '2025-07-17 10:00:00' },
            { id: 4, name: '测点D', value: '0.30MPa', time: '2025-07-17 10:00:00' },
            { id: 5, name: '测点E', value: '0.26MPa', time: '2025-07-17 10:00:00' }
        ];
        ElMessage.success('SQL验证成功，数据预览已更新');
    } else if (addDatasetType.value === 'api') {
        if (!addDatasetForm.url.trim()) {
            ElMessage.warning('请先输入接口地址');
            return;
        }
        if (!addDatasetForm.method) {
            ElMessage.warning('请选择请求方式');
            return;
        }
        
        // 模拟接口数据验证和预览
        previewData.value = [
            { id: 1, name: '接口数据A', value: '123.45', time: '2025-07-17 10:00:00' },
            { id: 2, name: '接口数据B', value: '234.56', time: '2025-07-17 10:00:00' },
            { id: 3, name: '接口数据C', value: '345.67', time: '2025-07-17 10:00:00' },
            { id: 4, name: '接口数据D', value: '456.78', time: '2025-07-17 10:00:00' },
            { id: 5, name: '接口数据E', value: '567.89', time: '2025-07-17 10:00:00' }
        ];
        ElMessage.success('接口验证成功，数据预览已更新');
    }
}

function saveDataset() {
    if (addDatasetType.value === 'dataExtract') {
        if (!addDatasetForm.page || !addDatasetForm.name || !addDatasetForm.source || !addDatasetForm.sql) {
            ElMessage.warning('请填写完整信息');
            return;
        }
    } else if (addDatasetType.value === 'api') {
        if (!addDatasetForm.page || !addDatasetForm.name || !addDatasetForm.url || !addDatasetForm.method) {
            ElMessage.warning('请填写完整信息');
            return;
        }
    } else if (addDatasetType.value === 'excel') {
        if (!addDatasetForm.page || !addDatasetForm.name || excelFileList.value.length === 0) {
            ElMessage.warning('请填写完整信息并上传Excel文件');
            return;
        }
    } else if (addDatasetType.value === 'mock') {
        if (!addDatasetForm.page || !addDatasetForm.name || mockColumns.value.length === 0) {
            ElMessage.warning('请填写完整信息并添加至少一个列');
            return;
        }
    }
    
    ElMessage.success('数据集保存成功');
    addDatasetDialogVisible.value = false;
    resetAddDatasetForm();
}

function getAddTypeText() {
    const typeMap = {
        'dataExtract': '数据抽取',
        'api': '接口',
        'excel': 'Excel导入',
        'mock': '模拟数据'
    };
    return typeMap[addDatasetType.value] || '未知';
}

function beforeExcelUpload(file) {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   file.type === 'application/vnd.ms-excel';
    const isLt500K = file.size / 1024 < 500;

    if (!isExcel) {
        ElMessage.error('只能上传Excel文件!');
        return false;
    }
    if (!isLt500K) {
        ElMessage.error('Excel文件大小不能超过500KB!');
        return false;
    }
    return true;
}

function handleExcelChange(file, fileList) {
    excelFileList.value = fileList;
    
    // 模拟Excel文件解析和数据预览
    if (file.status === 'ready') {
        // 模拟解析Excel数据
        previewData.value = [
            { id: 1, name: 'Excel数据A', value: '100.00', time: '2025-07-17 10:00:00' },
            { id: 2, name: 'Excel数据B', value: '200.00', time: '2025-07-17 10:00:00' },
            { id: 3, name: 'Excel数据C', value: '300.00', time: '2025-07-17 10:00:00' },
            { id: 4, name: 'Excel数据D', value: '400.00', time: '2025-07-17 10:00:00' },
            { id: 5, name: 'Excel数据E', value: '500.00', time: '2025-07-17 10:00:00' }
        ];
        ElMessage.success('Excel文件上传成功，数据预览已更新');
    }
}

function addColumn() {
    mockColumns.value.push({
        name: '',
        type: 'text'
    });
    
    // 强制触发响应式更新
    mockColumns.value = [...mockColumns.value];
}

function deleteColumn(index) {
    ElMessageBox.confirm(
        '确定要删除这个列吗？删除后该列的所有数据也会被删除。',
        '确认删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        const columnName = mockColumns.value[index].name;
        mockColumns.value.splice(index, 1);
        
        // 从所有数据行中删除该列的数据
        mockData.value.forEach(row => {
            delete row[columnName];
        });
        
        ElMessage.success('列删除成功');
    }).catch(() => {
        // 用户取消删除
    });
}

function addMockData() {
    if (mockColumns.value.length === 0) {
        ElMessage.warning('请先添加列');
        return;
    }
    
    const newRow = {};
    
    // 为每个列添加空值
    mockColumns.value.forEach(column => {
        if (column.name) {
            newRow[column.name] = '';
        }
    });
    
    mockData.value.push(newRow);
    ElMessage.success('数据行添加成功');
}

function updatePreviewColumns() {
    // 当列名更新时，同步更新现有数据的列结构
    const newMockData = [];
    
    mockData.value.forEach(row => {
        const newRow = {};
        
        // 只为存在的列保留数据
        mockColumns.value.forEach(column => {
            if (column.name) {
                newRow[column.name] = row[column.name] || '';
            }
        });
        
        newMockData.push(newRow);
    });
    
    // 强制更新数据
    mockData.value = newMockData;
}

function onColumnNameBlur() {
    // 当列名输入框失焦时，强制更新表格显示
    // 使用 nextTick 确保 DOM 更新完成后再触发
    nextTick(() => {
        // 强制重新渲染表格
        mockColumns.value = [...mockColumns.value];
        
        // 如果有列名但没有数据，添加一个空的数据行来显示表格结构
        if (mockColumns.value.length > 0 && mockData.value.length === 0) {
            const newRow = {};
            mockColumns.value.forEach(column => {
                if (column.name) {
                    newRow[column.name] = '';
                }
            });
            mockData.value = [newRow];
        }
    });
}

function deleteMockData(index) {
    ElMessageBox.confirm(
        '确定要删除这行数据吗？',
        '确认删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        mockData.value.splice(index, 1);
        ElMessage.success('数据行删除成功');
    }).catch(() => {
        // 用户取消删除
    });
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

function confirmDeletePublish(row) {
    ElMessageBox.confirm(`确定要删除画布"${row.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        // 删除对应的行
        const index = publishList.value.findIndex(item => item.index === row.index);
        if (index !== -1) {
            publishList.value.splice(index, 1);
            ElMessage.success('删除成功');
        }
    }).catch(() => {
        // 用户取消删除
    });
}

const editDatasetDialogVisible = ref(false);
const editDatasetType = ref('dataExtract');
const editDatasetForm = reactive({
    page: '',
    name: '',
    source: '',
    sql: '',
    url: '',
    method: '',
    dataPath: '',
    headers: '',
    index: null
});
const editPreviewData = ref([]);
const editExcelFileList = ref([]);
const editMockColumns = ref([]);
const editMockData = ref([]);
function showEditDatasetDialog() {
    // 获取选中的数据行
    if (selectedDatasetRows.value.length === 0) {
        ElMessage.warning('请先选择要编辑的数据集');
        return;
    }
    if (selectedDatasetRows.value.length > 1) {
        ElMessage.warning('只能选择一个数据集进行编辑');
        return;
    }
    
    const row = selectedDatasetRows.value[0];
    
    // 根据数据集的创建方式设置表单类型
    const modeMap = {
        '数据抽取': 'dataExtract',
        '接口': 'api',
        'Excel导入': 'excel',
        '模拟数据': 'mock'
    };
    editDatasetType.value = modeMap[row.mode] || 'dataExtract';
    
    // 填充表单数据
    editDatasetForm.page = '页面1'; // 这里可根据实际数据回显
    editDatasetForm.name = row.name;
    editDatasetForm.source = row.source;
    editDatasetForm.sql = row.sql || '';
    editDatasetForm.url = row.url || '';
    editDatasetForm.method = row.method || '';
    editDatasetForm.dataPath = row.dataPath || '';
    editDatasetForm.headers = row.headers || '';
    editDatasetForm.index = row.index;
    
    // 初始化预览数据
    editPreviewData.value = [];
    editExcelFileList.value = [];
    editMockColumns.value = [];
    editMockData.value = [];
    
    editDatasetDialogVisible.value = true;
}
function resetEditDatasetForm() {
    editDatasetForm.page = '';
    editDatasetForm.name = '';
    editDatasetForm.source = '';
    editDatasetForm.sql = '';
    editDatasetForm.url = '';
    editDatasetForm.method = '';
    editDatasetForm.dataPath = '';
    editDatasetForm.headers = '';
    editDatasetForm.index = null;
    editDatasetType.value = 'dataExtract';
    editPreviewData.value = [];
    editExcelFileList.value = [];
    editMockColumns.value = [];
    editMockData.value = [];
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
    // 获取选中的数据行
    if (selectedDatasetRows.value.length === 0) {
        ElMessage.warning('请先选择要删除的数据集');
        return;
    }
    
    ElMessageBox.confirm(`确定要删除选中的 ${selectedDatasetRows.value.length} 个数据集吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        // 删除选中的行
        selectedDatasetRows.value.forEach(selectedRow => {
            const index = datasetList.value.findIndex(item => item.index === selectedRow.index);
            if (index !== -1) {
                datasetList.value.splice(index, 1);
            }
        });
        // 清空选择
        selectedDatasetRows.value = [];
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

// 编辑数据集相关函数
function validateEditDataset() {
    if (editDatasetType.value === 'dataExtract') {
        if (!editDatasetForm.sql.trim()) {
            ElMessage.warning('请先输入SQL语句');
            return;
        }
        
        // 模拟数据验证和预览
        editPreviewData.value = [
            { id: 1, name: '测点A', value: '0.25MPa', time: '2025-07-17 10:00:00' },
            { id: 2, name: '测点B', value: '0.28MPa', time: '2025-07-17 10:00:00' },
            { id: 3, name: '测点C', value: '0.22MPa', time: '2025-07-17 10:00:00' },
            { id: 4, name: '测点D', value: '0.30MPa', time: '2025-07-17 10:00:00' },
            { id: 5, name: '测点E', value: '0.26MPa', time: '2025-07-17 10:00:00' }
        ];
        ElMessage.success('SQL验证成功，数据预览已更新');
    } else if (editDatasetType.value === 'api') {
        if (!editDatasetForm.url.trim()) {
            ElMessage.warning('请先输入接口地址');
            return;
        }
        if (!editDatasetForm.method) {
            ElMessage.warning('请选择请求方式');
            return;
        }
        
        // 模拟接口数据验证和预览
        editPreviewData.value = [
            { id: 1, name: '接口数据A', value: '123.45', time: '2025-07-17 10:00:00' },
            { id: 2, name: '接口数据B', value: '234.56', time: '2025-07-17 10:00:00' },
            { id: 3, name: '接口数据C', value: '345.67', time: '2025-07-17 10:00:00' },
            { id: 4, name: '接口数据D', value: '456.78', time: '2025-07-17 10:00:00' },
            { id: 5, name: '接口数据E', value: '567.89', time: '2025-07-17 10:00:00' }
        ];
        ElMessage.success('接口验证成功，数据预览已更新');
    }
}

function handleEditExcelChange(file, fileList) {
    editExcelFileList.value = fileList;
    
    // 模拟Excel文件解析和数据预览
    if (file.status === 'ready') {
        // 模拟解析Excel数据
        editPreviewData.value = [
            { id: 1, name: 'Excel数据A', value: '100.00', time: '2025-07-17 10:00:00' },
            { id: 2, name: 'Excel数据B', value: '200.00', time: '2025-07-17 10:00:00' },
            { id: 3, name: 'Excel数据C', value: '300.00', time: '2025-07-17 10:00:00' },
            { id: 4, name: 'Excel数据D', value: '400.00', time: '2025-07-17 10:00:00' },
            { id: 5, name: 'Excel数据E', value: '500.00', time: '2025-07-17 10:00:00' }
        ];
        ElMessage.success('Excel文件上传成功，数据预览已更新');
    }
}

function addEditColumn() {
    editMockColumns.value.push({
        name: '',
        type: 'text'
    });
    
    // 强制触发响应式更新
    editMockColumns.value = [...editMockColumns.value];
}

function deleteEditColumn(index) {
    ElMessageBox.confirm(
        '确定要删除这个列吗？删除后该列的所有数据也会被删除。',
        '确认删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        const columnName = editMockColumns.value[index].name;
        editMockColumns.value.splice(index, 1);
        
        // 从所有数据行中删除该列的数据
        editMockData.value.forEach(row => {
            delete row[columnName];
        });
        
        ElMessage.success('列删除成功');
    }).catch(() => {
        // 用户取消删除
    });
}

function addEditMockData() {
    const newRow = { index: editMockData.value.length + 1 };
    editMockColumns.value.forEach(column => {
        if (column.name) {
            newRow[column.name] = '';
        }
    });
    editMockData.value.push(newRow);
}

function deleteEditMockData(index) {
    ElMessageBox.confirm(
        '确定要删除这行数据吗？',
        '确认删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        editMockData.value.splice(index, 1);
        // 重新编号
        editMockData.value.forEach((row, idx) => {
            row.index = idx + 1;
        });
        ElMessage.success('数据删除成功');
    }).catch(() => {
        // 用户取消删除
    });
}

function onEditColumnNameBlur() {
    // 强制触发响应式更新
    editMockColumns.value = [...editMockColumns.value];
    
    // 如果没有任何数据行，添加一个空行
    if (editMockData.value.length === 0) {
        addEditMockData();
    }
}

// 模版管理相关
const activeTemplateCategory = ref('all');
const templateViewDialogVisible = ref(false);
const currentTemplate = ref(null);
const importDialogVisible = ref(false);
const uploadRef = ref(null);
const selectedFile = ref(null);
const addPageDialogVisible = ref(false);
const addPageForm = reactive({
    name: '',
    description: '',
    category: ''
});

// 页面设计器相关状态
const pageDesignerVisible = ref(false);
const currentDesigningPage = ref(null);
const currentDesigningType = ref('page'); // 'page' 或 'template'
const activeComponentCategory = ref('components'); // components, maps
const canvasComponents = ref([]);
const canvasConfig = reactive({
    name: '',
    backgroundColor: '#ffffff'
});

// 组件列表
const componentList = ref([
    { type: 'map', name: '地图', icon: 'Position' },
    { type: 'bar', name: '柱图', icon: 'TrendCharts' },
    { type: 'pie', name: '饼图', icon: 'DataLine' },
    { type: 'line', name: '折线图', icon: 'TrendCharts' },
    { type: 'scatter', name: '散点图', icon: 'DataLine' },
    { type: 'table', name: '表格', icon: 'Document' }
]);

// 地图列表
const mapList = ref([
    { type: '2d-map', name: '二维地图', icon: 'Position' },
    { type: '3d-map', name: '三维地图', icon: 'Position' },
    { type: 'echarts-map', name: 'Echarts地图', icon: 'Position' },
    { type: '2.5d-map', name: '2.5D地图', icon: 'Position' }
]);

// 柱图列表
const barList = ref([
    { type: 'bar', name: '柱图', icon: 'TrendCharts' },
    { type: 'horizontal-bar', name: '条形柱图', icon: 'TrendCharts' },
    { type: 'stacked-bar', name: '堆叠柱图', icon: 'TrendCharts' },
    { type: 'stacked-horizontal-bar', name: '堆叠条形柱图', icon: 'TrendCharts' },
    { type: 'grouped-bar', name: '分组柱图', icon: 'TrendCharts' },
    { type: 'polar-bar', name: '极坐标柱图', icon: 'TrendCharts' },
    { type: '3d-bar', name: '立体柱图', icon: 'TrendCharts' },
    { type: 'shadow-bar', name: '阴影柱状图', icon: 'TrendCharts' }
]);

const selectedComponentIndex = ref(-1);
const templateList = ref([
    { id: 1, name: '综合展示模版', category: 'yunshang', image: '/img/template.png' },
    { id: 2, name: 'KPI 模版', category: 'yunshang', image: '/img/template.png' },
    { id: 3, name: '领导驾驶舱模版', category: 'yunshang', image: '/img/template.png' },
    { id: 4, name: '大屏模版', category: 'yunshang', image: '/img/template.png' },
    { id: 5, name: 'APP 端指标展示模版', category: 'yunshang', image: '/img/template.png' },
    { id: 6, name: '生产模版', category: 'gongshui', image: '/img/template.png' },
    { id: 7, name: '营业模版', category: 'yingye', image: '/img/template.png' },
    { id: 8, name: '客服模版', category: 'kefu', image: '/img/template.png' },
    { id: 9, name: '管网模版', category: 'guanwang', image: '/img/template.png' },
    { id: 10, name: '水质模版', category: 'shuizhi', image: '/img/template.png' },
    { id: 11, name: '智慧运维', category: 'pad', image: '/img/template.png' },
    { id: 12, name: '数据管理', category: 'quanyaosu', image: '/img/template.png' }
]);

const filteredTemplates = computed(() => {
    if (activeTemplateCategory.value === 'all') {
        return templateList.value;
    }
    return templateList.value.filter(template => template.category === activeTemplateCategory.value);
});

function handleTemplateCategorySelect(index) {
    activeTemplateCategory.value = index;
}

function viewTemplate(template) {
    currentTemplate.value = template;
    templateViewDialogVisible.value = true;
}

function closeTemplateView() {
    templateViewDialogVisible.value = false;
    currentTemplate.value = null;
}

function showAddPageDialog() {
    addPageDialogVisible.value = true;
    // 默认选择当前分类
    addPageForm.category = activeTemplateCategory.value === 'all' ? 'yunshang' : activeTemplateCategory.value;
    addPageForm.name = '';
    addPageForm.description = '';
}

function showImportDialog() {
    importDialogVisible.value = true;
    selectedFile.value = null;
}

function closeAddPageDialog() {
    addPageDialogVisible.value = false;
    addPageForm.name = '';
    addPageForm.description = '';
    addPageForm.category = '';
}

function closeImportDialog() {
    importDialogVisible.value = false;
    selectedFile.value = null;
    if (uploadRef.value) {
        uploadRef.value.clearFiles();
    }
}

function handleFileChange(file) {
    selectedFile.value = file;
}

function beforeUpload(file) {
    const isZip = file.type === 'application/zip' || file.name.endsWith('.zip');
    if (!isZip) {
        ElMessage.error('只能上传zip文件!');
        return false;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
        ElMessage.error('文件大小不能超过10MB!');
        return false;
    }
    
    return false; // 阻止自动上传
}

function confirmAddPage() {
    if (!addPageForm.name.trim()) {
        ElMessage.warning('请输入页面名称');
        return;
    }
    
    if (!addPageForm.category) {
        ElMessage.warning('请选择所属分类');
        return;
    }
    
    // 创建新页面
    const newPage = {
        id: templateList.value.length + 1,
        name: addPageForm.name.trim(),
        description: addPageForm.description.trim(),
        category: addPageForm.category,
        image: '/img/template.png'
    };
    
    // 添加到页面列表
    templateList.value.push(newPage);
    
    // 显示成功消息
    ElMessage.success(`页面"${newPage.name}"新增成功`);
    
    // 关闭对话框并清理
    closeAddPageDialog();
}

// 页面设计器相关方法
function enterPageDesigner(page) {
    currentDesigningPage.value = page;
    currentDesigningType.value = activeMenu.value === 'yemian' ? 'page' : 'template';
    canvasConfig.name = page.name;
    pageDesignerVisible.value = true;
    activeComponentCategory.value = 'components';
    canvasComponents.value = [];
    selectedComponentIndex.value = -1;
}

function closePageDesigner() {
    pageDesignerVisible.value = false;
    currentDesigningPage.value = null;
    canvasComponents.value = [];
    selectedComponentIndex.value = -1;
}

function handleDragStart(event, component) {
    event.dataTransfer.setData('component', JSON.stringify(component));
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleComponentClick(component) {
    // 如果是地图组件，切换到地图列表
    if (component.type === 'map') {
        activeComponentCategory.value = 'maps';
    }
    // 如果是柱图组件，切换到柱图列表
    else if (component.type === 'bar') {
        activeComponentCategory.value = 'bars';
    }
}

function handleDrop(event) {
    event.preventDefault();
    const componentData = JSON.parse(event.dataTransfer.getData('component'));
    
    // 创建新组件
    const newComponent = {
        id: Date.now() + Math.random(),
        ...componentData,
        style: {
            position: 'absolute',
            left: (event.offsetX - 50) + 'px',
            top: (event.offsetY - 25) + 'px',
            width: '100px',
            height: '50px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        }
    };
    
    canvasComponents.value.push(newComponent);
}

function selectComponent(index) {
    selectedComponentIndex.value = index;
}

function removeComponent(index) {
    canvasComponents.value.splice(index, 1);
    selectedComponentIndex.value = -1;
}

function savePageDesign() {
    const messageType = currentDesigningType.value === 'page' ? '页面' : '模版';
    ElMessage.success(`${messageType}设计保存成功`);
    closePageDesigner();
}

function confirmImport() {
    if (!selectedFile.value) {
        ElMessage.warning('请先选择要导入的文件');
        return;
    }
    
    // 根据当前菜单显示不同的消息
    const isPageManagement = activeMenu.value === 'yemian';
    const messageType = isPageManagement ? '页面' : '模版';
    
    // 模拟文件上传处理
    ElMessage.success(`${messageType}文件"${selectedFile.value.name}"导入成功`);
    
    // 模拟添加新模版到列表
    const newTemplate = {
        id: templateList.value.length + 1,
        name: selectedFile.value.name.replace('.zip', ''),
        category: activeTemplateCategory.value === 'all' ? 'yunshang' : activeTemplateCategory.value,
        image: '/img/template.png'
    };
    
    templateList.value.push(newTemplate);
    
    // 关闭对话框并清理
    closeImportDialog();
}

function editTemplate(template) {
    // 页面管理和模版管理都进入页面设计器
    enterPageDesigner(template);
}

function exportTemplate(template) {
    // 根据当前菜单决定不同的内容
    const isPageManagement = activeMenu.value === 'yemian';
    const messageType = isPageManagement ? '页面' : '模版';
    const displayName = isPageManagement ? template.name.replace('模版', '页面') : template.name;
    
    // 创建一个模拟的zip文件内容
    const zipContent = `# ${displayName}
# ${messageType}导出时间: ${new Date().toLocaleString()}
# ${messageType}分类: ${getCategoryName(template.category)}

## ${messageType}信息
- ${messageType}名称: ${displayName}
- ${messageType}ID: ${template.id}
- 创建时间: ${new Date().toLocaleDateString()}

## ${messageType}配置
{
  "${messageType}Name": "${displayName}",
  "${messageType}Id": ${template.id},
  "category": "${template.category}",
  "version": "1.0.0",
  "exportTime": "${new Date().toISOString()}"
}

## ${messageType}文件结构
/${messageType.toLowerCase()}
  ├── config.json
  ├── assets/
  │   ├── images/
  │   └── styles/
  ├── components/
  └── pages/
`;

    // 创建Blob对象
    const blob = new Blob([zipContent], { type: 'application/zip' });
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${displayName}.zip`;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    ElMessage.success(`${messageType}"${displayName}"导出成功`);
}

function getCategoryName(category) {
    const categoryMap = {
        'yunshang': '云上中心',
        'gongshui': '供水一体化管控主题',
        'quanyaosu': '供水全要素管理主题',
        'yingji': '应急指挥主题',
        'laishui': '来水专题',
        'yingye': '营业主题',
        'kefu': '客服专题',
        'guanwang': '管网专题',
        'shuizhi': '水质专题',
        'ergong': '二供专题',
        'pad': 'Pad端一张图'
    };
    return categoryMap[category] || '未知分类';
}

function deleteTemplate(template) {
    // 根据当前菜单显示不同的消息
    const isPageManagement = activeMenu.value === 'yemian';
    const messageType = isPageManagement ? '页面' : '模版';
    const displayName = isPageManagement ? template.name.replace('模版', '页面') : template.name;
    
    ElMessageBox.confirm(`确定要删除${messageType}"${displayName}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const index = templateList.value.findIndex(item => item.id === template.id);
        if (index !== -1) {
            templateList.value.splice(index, 1);
            ElMessage.success('删除成功');
        }
    }).catch(() => {
        // 用户取消删除
    });
}
</script>

<style scoped>
/* 页面设计器样式 */
.page-designer-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.page-designer-container {
    display: flex;
    height: 100%;
    flex: 1;
}

.designer-left-panel {
    width: 250px;
    border-right: 1px solid #e4e7ed;
    padding: 20px;
    background-color: #fafafa;
    overflow-y: auto;
}

.designer-center-panel {
    flex: 1;
    padding: 20px;
    background-color: #f5f5f5;
    position: relative;
}

.designer-right-panel {
    width: 300px;
    border-left: 1px solid #e4e7ed;
    padding: 20px;
    background-color: #fafafa;
    overflow-y: auto;
}

.component-item, .map-item {
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    padding: 12px;
    text-align: center;
    cursor: grab;
    transition: all 0.2s;
}

.component-item[data-type="map"],
.component-item[data-type="bar"] {
    cursor: pointer;
}

.component-item:hover, .map-item:hover, .bar-item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.component-item:active, .map-item:active, .bar-item:active {
    cursor: grabbing;
}

.component-icon, .map-icon, .bar-icon {
    font-size: 24px;
    color: #409eff;
    margin-bottom: 8px;
}

.component-name, .map-name, .bar-name {
    font-size: 12px;
    color: #606266;
}

.canvas-container {
    width: 100%;
    height: 100%;
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    position: relative;
    min-height: 400px;
    background-color: white;
}

.canvas-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #909399;
}

.canvas-component {
    position: absolute;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s;
}

.canvas-component:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.canvas-component.selected {
    border-color: #409eff;
    border-width: 2px;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.component-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 12px;
    color: #606266;
}

.component-actions {
    position: absolute;
    top: -30px;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px;
}

/* 模板卡片样式 */
.template-card {
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.2s;
}

.template-card:hover {
    border-color: #409eff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.template-image {
    position: relative;
    overflow: hidden;
    border-radius: 6px;
}

.template-info {
    padding: 12px 0;
}

/* 导入容器样式 */
.import-container {
    text-align: center;
}

.upload-area {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    padding: 40px 20px;
    background-color: #fafafa;
    transition: border-color 0.2s;
}

.upload-area:hover {
    border-color: #409eff;
}

.el-upload__text {
    margin-top: 10px;
    color: #606266;
}

.el-upload__tip {
    color: #909399;
    font-size: 12px;
    margin-top: 8px;
}
</style>
