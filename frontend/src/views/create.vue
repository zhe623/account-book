<template>
  <div class="container-main">
    <h1 class="title">添加记录</h1>
    <div class="hr-line"></div>

    <el-form
      :model="form"
      label-width="90px"
      label-position="left"
      class="form-container"
    >
      <el-form-item label="事项">
        <el-input v-model="form.title" placeholder="请输入事项" />
      </el-form-item>

      <el-form-item label="发生时间">
        <el-date-picker
          v-model="form.time"
          type="date"
          placeholder="请选择日期"
          style="width: 100%"
          
        />
      </el-form-item>

      <el-form-item label="类型">
        <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
          <el-option label="支出" value="-1" />
          <el-option label="收入" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="金额">
        <el-input
          v-model="form.account"
          type="number"
          placeholder="请输入金额"
        />
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
        />
      </el-form-item>

      <div style="height:24px"></div>

      <el-form-item>
        <el-button
          type="primary"
          class="btn-add"
          @click="addRecord"
        >
          添加
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { addAccount } from '@/api/account'
import { ElMessage } from 'element-plus'

const router = useRouter()

const form = reactive({
  title: '',
  time: '',
  type: '-1',
  account: '',
  remark: ''
})

async function addRecord() {
  try {
    const res = await addAccount(form)
    if (res.code === '0000') {
      ElMessage.success('添加成功！')
      Object.keys(form).forEach(key => (form[key] = ''))
      router.push('/account')
    } else {
      ElMessage.error('添加失败：' + res.msg)
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('请求出错')
  }
}
</script>

<style scoped>
.container-main {
  max-width: 720px;
  margin: 40px auto;
  background: #fff;
  padding: 20px 30px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

h1.title {
  font-weight: 500;
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}

.hr-line {
  border-top: 1px solid #eee;
  margin: 18px 0 24px;
}

.btn-add {
  width: 100%;
  padding: 12px 16px;
  border-radius: 4px;
}

.form-container {
  margin-top: 10px;
}
</style>
