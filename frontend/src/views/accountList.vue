<template>
  <el-container style="justify-content: center; background-color: #f5f7fa; min-height: 100vh;">
    <el-main style="max-width: 700px; width: 100%;">
      <!-- 标题 -->
      <h2 style="text-align: center; margin-top: 20px; color: #303133;">记账本</h2>
      <el-divider></el-divider>

      <!-- 筛选导航栏 -->
      <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 20px;">
        <el-select v-model="filterType" placeholder="筛选方式" style="width: 150px;">
          <el-option label="不限" value="none" />
          <el-option label="按类型" value="type" />
          <el-option label="按时间" value="time" />
          <el-option label="按金额" value="amount" />
        </el-select>

        <!-- 根据不同筛选方式显示不同输入 -->
        <template v-if="filterType === 'type'">
          <el-select v-model="filterValue" placeholder="选择类型" style="width: 120px;">
            <el-option label="支出" :value="-1" />
            <el-option label="收入" :value="1" />
          </el-select>
        </template>

        <template v-else-if="filterType === 'time'">
          <el-date-picker
            v-model="filterValue"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </template>

        <template v-else-if="filterType === 'amount'">
          <el-input-number v-model="minAmount" placeholder="最小" :min="0" />
          <el-input-number v-model="maxAmount" placeholder="最大" :min="0" />
        </template>

        <el-button type="primary" @click="applyFilter">筛选</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </div>

      <!-- 账单列表 -->
      <div v-if="accounts.length > 0">
        <el-card
          v-for="item in accounts"
          :key="item._id"
          shadow="hover"
          style="margin-bottom: 16px; border-left: 6px solid;"
          :style="item.type === -1 ? 'border-color: #F56C6C;' : 'border-color: #67C23A;'"
        >
          <div class="account-item">
            <div class="account-info">
              <div class="account-date">{{ formatDate(item.time) }}</div>
              <div class="account-title">
                {{ item.title }}
                <el-tag
                  :type="item.type === -1 ? 'danger' : 'success'"
                  size="small"
                  style="margin-left: 8px;"
                >
                  {{ item.type === -1 ? '支出' : '收入' }}
                </el-tag>
              </div>
            </div>
            <div class="account-actions">
              <div class="account-amount" :style="item.type === -1 ? 'color:#F56C6C' : 'color:#67C23A'">
                {{ item.account * item.type }}
              </div>
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                circle
                @click="deleteRecord(item._id)"
              ></el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 无数据提示 -->
      <div v-else style="text-align: center; color: #909399; margin-top: 40px;">
        暂无账目记录
      </div>

      <!-- 添加按钮 -->
      <div style="text-align: center; margin-top: 30px;">
        <el-button type="primary" @click="$router.push('/account/create')">
          添加记录
        </el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import moment from 'moment'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteAccount } from '@/api/account.js'

const accounts = ref([])

// 筛选相关变量
const filterType = ref('none')
const filterValue = ref(null)
const minAmount = ref(null)
const maxAmount = ref(null)

const formatDate = (date) => moment(date).format('YYYY-MM-DD')


// 加载账单数据
async function loadAccounts() {
  try {
    const res = await axios.get('http://localhost:3000/api/account')
    accounts.value = res.data.data
  } catch (err) {
    console.error('加载账单失败：', err)
  }
}

// 应用筛选条件
async function applyFilter() {
  try {
    let query = {}

    if (filterType.value === 'type') {
      query.type = filterValue.value
    } else if (filterType.value === 'time' && filterValue.value?.length === 2) {
      query.start = filterValue.value[0]
      query.end = filterValue.value[1]
    } else if (filterType.value === 'amount') {
      if (minAmount.value !== null && minAmount.value !== '') query.min = minAmount.value
      if (maxAmount.value !== null && maxAmount.value !== '') query.max = maxAmount.value
    }

    const res = await axios.get('http://localhost:3000/api/account/search', {
      params: query
    })

    accounts.value = res.data.data || []
  } catch (err) {
    console.error('筛选失败：', err)
    ElMessage.error('筛选请求出错')
  }
}


// 重置筛选
function resetFilter() {
  filterType.value = 'none'
  filterValue.value = null
  minAmount.value = null
  maxAmount.value = null
  loadAccounts()
}

// 删除账单
async function deleteRecord(id) {
  try {
    await ElMessageBox.confirm('确定要删除这条账目吗？', '提示', {
      type: 'warning',
    })
    const res = await deleteAccount(id)
    if (res.code === '0000') {
      ElMessage.success('删除成功')
      await loadAccounts()
    } else {
      ElMessage.error('删除失败：' + res.message)
    }
  } catch (err) {
    if (err !== 'cancel') {
      console.error(err)
      ElMessage.error('请求出错')
    }
  }
}

onMounted(loadAccounts)
</script>

<style scoped>
.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-info {
  flex: 1;
}

.account-date {
  font-size: 13px;
  color: #909399;
}

.account-title {
  margin-top: 6px;
  font-weight: 500;
  color: #303133;
}

.account-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.account-amount {
  font-size: 16px;
  font-weight: bold;
}
</style>
