<template>
  <div class="container-main">
    <h1 class="title">{{ isEdit ? '编辑记录' : '添加记录' }}</h1>
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
          {{ isEdit ? '保存修改' : '添加' }}
        </el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addAccount, getAccountDetail, updateAccount } from '@/api/account'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const isEdit = !!route.params.id// 判断是否为编辑模式 转换为布尔值



const form = reactive({
  title: '',
  time: '',
  type: '-1',
  account: '',
  remark: ''
})

onMounted(async () => {
  if (isEdit) {
    const res = await getAccountDetail(route.params.id)
    Object.assign(form, res.data)
  }
})


async function addRecord() {
  try {
    let res
    if (isEdit) {
      // 编辑模式：发 PUT 请求
      res = await updateAccount(route.params.id, form)
    } else {
      // 新增模式：发 POST 请求
      res = await addAccount(form)
    }

    if (res.code === '0000' || res.data?.code === '0000') {
      ElMessage.success(isEdit ? '修改成功！' : '添加成功！')
      router.push('/account')
    } else {
      ElMessage.error((isEdit ? '修改失败：' : '添加失败：') + (res.msg || res.data?.msg))
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
