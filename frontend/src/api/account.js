import axios from 'axios'

//设置后端接口的基础地址
const baseURL = 'http://127.0.0.1:3000/api'

//获取账单列表
export async function getAccountList() {
  const res = await axios.get(`${baseURL}/account`)
  return res.data // 返回接口返回的数据
}

//添加新账目
export async function addAccount(data) {
  const res = await axios.post(`${baseURL}/account`, data)
  return res.data
}

//删除账目
export async function deleteAccount(id) {
  const res = await axios.delete(`${baseURL}/account/${id}`)
  return res.data
}

//获取单个账目详情
export async function getAccountDetail(id) {
  const res = await axios.get(`${baseURL}/account/${id}`)
  return res.data
}

//修改账目
export async function updateAccount(id, data) {
  const res = await axios.put(`${baseURL}/account/${id}`, data)
  return res.data
}