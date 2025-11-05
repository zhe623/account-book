<template>
  <div class="container-main">
    <h1 class="title">添加记录</h1>
    <div class="hr-line"></div>

    <form @submit.prevent="addRecord" class="form-horizontal" role="form">
      <div class="form-group">
        <label class="col-sm-2 control-label">事项</label>
        <div class="col-sm-10">
          <input v-model="form.title" type="text" class="form-control" placeholder="请输入事项">
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">发生时间</label>
        <div class="col-sm-10">
          <input v-model="form.time" type="date" class="form-control">
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">类型</label>
        <div class="col-sm-10">
          <select v-model="form.type" class="form-control">
            <option value="-1">支出</option>
            <option value="1">收入</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">金额</label>
        <div class="col-sm-10">
          <input v-model="form.account" type="number" class="form-control" placeholder="请输入金额">
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">备注</label>
        <div class="col-sm-10">
          <textarea v-model="form.remark" class="form-control" rows="4"></textarea>
        </div>
      </div>

      <div style="height:24px"></div>

      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="submit" class="btn btn-add">添加</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { addAccount } from '@/api/account' // 引入API方法
import { useRouter } from 'vue-router'

const router = useRouter()

// 创建表单数据
const form = reactive({
  title: '',
  time: '',
  type: '-1',
  account: '',
  remark: ''
})

// 提交方法
async function addRecord() {
  try {
    const res = await addAccount(form)
    if (res.code === '0000') {
      alert('添加成功！')
      // 提交后清空表单
      Object.keys(form).forEach(key => form[key] = '')
      router.push('/account')
    } else {
      alert('添加失败：' + res.msg)
    }
  } catch (err) {
    console.error(err)
    alert('请求出错')
  }
}
</script>

<style scoped>
body { background: #fff; }
.container-main { max-width: 720px; margin: 40px auto; }
h1.title { font-weight: 500; margin-bottom: 20px; font-size: 32px; }
.form-horizontal .form-group { margin-left: 0; margin-right: 0; }
.btn-add { width: 100%; background:#2c7bb2; border-color:#2c7bb2; color:#fff; padding:12px 16px; border-radius:4px; }
.hr-line { border-top:1px solid #eee; margin:18px 0 24px; }
.form-control { box-shadow: none; }
</style>
