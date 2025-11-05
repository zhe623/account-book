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
      ...req.body,
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
  let id = req.params.id;
  try{
  await AccountModel.deleteOne({_id:id});
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

module.exports = router;
