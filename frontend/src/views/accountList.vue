<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-lg-offset-2">
        <h2>记账本</h2>
        <hr />
        <div class="accounts">
          <!-- 支出 / 收入记录 -->
          <div
            v-for="item in accounts"
            :key="item._id"
            class="panel"
            :class="item.type === -1 ? 'panel-danger' : 'panel-success'"
          >
            <div class="panel-heading">
              {{ formatDate(item.time) }}
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-xs-6">
                  {{ item.title }}
                </div>
                <div class="col-xs-2 text-center">
                  <span
                    class="label"
                    :class="item.type === -1 ? 'label-warning' : 'label-success'"
                  >
                    {{ item.type === -1 ? '支出' : '收入' }}
                  </span>
                </div>
                <div class="col-xs-2 text-right">
                  {{ item.account }}
                </div>
                <div class="col-xs-2 text-right">
                  <a href="javascript:void(0)" @click="deleteRecord(item._id)">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center" style="margin-top: 30px;">
          <router-link to="/account/create" class="btn btn-primary btn-md">
            添加记录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";
import { ref, onMounted } from "vue";
import axios from "axios";
import { deleteAccount } from '@/api/account.js'

// 账单数据
const accounts = ref([]);

// 格式化日期
const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

// 从后端加载数据
async function loadAccounts() {
  try {
    const res = await axios.get("http://localhost:3000/api/account");
    accounts.value = res.data.data;
    /*
    
    res.data为
    {
    code: '0000',
    message: '获取账目列表成功',
    data: data //这里的data才是真正需要的账单数组
    }
    因此为res.data.data

    */
  } catch (err) {
    console.error("加载账单失败：", err);
  }
};
async function deleteRecord(id) {
  if (!confirm('确定要删除这条账目吗？')) return
  try {
    const res = await deleteAccount(id)
    if (res.code === '0000') {
      alert('删除成功！')
      await loadAccounts() // 重新刷新账单列表
    } else {
      alert('删除失败：' + res.message)
    }
  } catch (err) {
    console.error(err)
    alert('请求出错')
  }
}
onMounted(loadAccounts);
</script>

<style scoped>
body {
  background-color: #f5f5f5;
  padding-top: 20px;
}
.container {
  max-width: 800px;
}
.panel {
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.panel-heading {
  font-weight: bold;
}
.accounts {
  margin-top: 20px;
}
.glyphicon-remove {
  color: #ccc;
}
h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}
hr {
  border-top: 1px solid #ddd;
}
</style>
