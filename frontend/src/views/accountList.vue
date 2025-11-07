<template>
  <el-container style="justify-content: center; background-color: #f5f7fa; min-height: 100vh;">
    <el-main style="max-width: 700px; width: 100%;">
      <!-- 标题 -->
      <h2 style="text-align: center; margin-top: 20px; color: #303133;">记账本</h2>
      <el-divider></el-divider>

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
