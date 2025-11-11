var express = require('express');
var router = express.Router();

const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//获取账目列表
router.get('/account', async function(req, res, next) {
  try {
    const data = await AccountModel.find().sort({ time: -1 }).exec();//获取所有账目
    res.json({
        code : '0000',
        message : '获取账目列表成功',
        data : data
    })
  } catch (err) {
    res.json({
        code : '0001',
        message : '获取账目列表失败: ' + err.message
    })
  }
});

//添加账目
router.post('/account', async (req, res) => {
  try {
    const data = await AccountModel.create({
      ...req.body,//使用扩展运算符将请求体中的所有字段添加到新账目中
      time: moment(req.body.time).toDate()
    });

    res.json({
        code : '0000',
        message : '添加账目成功',
        data : data
    })
  } catch (err) {
    res.json({
        code : '0001',
        message : '添加账目失败: ' + err.message
    })
  }
});

//删除功能
router.delete('/account/:id',async (req,res)=>{
  //let id = req.params.id;//获取路径参数中的id(传统写法)
  let { id } = req.params;//获取路径参数中的id(ES6解构赋值)
  try{
  await AccountModel.deleteOne({_id:id});//从数据库中删除对应id的账目
  res.json({
        code : '0000',
        message : '删除账目成功',
        data : {}
  })
    }catch(err){
        res.json({
        code : '0001',
        message : '删除账目失败: ' + err.message
        })
    }
});

//按条件查询功能
router.get('/account/search',async (req,res)=>{
  try{
    const { type, min, max, start, end } = req.query;//从请求体中获取查询参数
    const query = {};//初始化查询条件对象
    if (type) { //如果type存在，则添加到查询条件中
      query.type = type;
    }

    if (min || max) { //同上
      query.account = {};
      if (min) query.account.$gte = Number(min);
      if (max) query.account.$lte = Number(max);
    }

    if (start || end) { //同上
      query.time = {};
      if (start) query.time.$gte = new Date(start);
      if (end) query.time.$lte = new Date(end);
    }
    const results = await AccountModel.find(query).sort({ time: -1 }).exec();//查询数据库
    res.json({
      code: '0000',
      msg: '筛选成功',
      data: results
    });
  }catch(err){
    res.json({
      code: '0001',
      msg: '筛选失败: ',
      error: err.message
    });
  }
});

//修改账目
//点击编辑 → 跳转编辑页 → 读取原数据 → 修改后 PUT 更新
// PUT /api/account/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Account.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ code: '0000', msg: '修改成功', data: result });
  } catch (err) {
    res.json({ code: '0001', msg: '修改失败', error: err.message });
  }
});


module.exports = router;
