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
    const data = await AccountModel.find().sort({ time: -1 }).exec();
    res.render('list', { accounts: data , moment: moment});
  } catch (err) {
    res.status(500).send('获取账目列表失败: ' + err.message);
  }
});

//添加记录
router.get('/account/create', function(req, res, next) {
  res.render('create');
});

//添加账目
router.post('/account', async (req, res) => {
  try {
    await AccountModel.create({
      ...req.body,
      time: moment(req.body.time).toDate()
    });

    res.render('success', { msg: '添加账目成功' });
  } catch (err) {
    res.status(500).send('添加账目失败: ' + err.message);
  }
});

//删除功能
router.get('/account/:id',async (req,res)=>{
  let id = req.params.id;
  await AccountModel.deleteOne({_id:id});
  res.render('success',{msg:'删除账目成功'});
});

module.exports = router;
