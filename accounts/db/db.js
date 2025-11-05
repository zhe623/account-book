const { DBHOST, DBPORT, DBNAME } = require('../config/config');


module.exports = function (success,error){
if(typeof error !== 'function'){
  error = () => {
    console.log('❌ 数据库连接失败');
  };
}

const mongoose = require('mongoose');

const {DBHOST,DBPORT,DBNAME} = require('../config/config.js');

mongoose.set('strictQuery', true);

mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

mongoose.connection.once('open', () => {
    success();
});

mongoose.connection.on('error', (err) => {
    console.log('❌ 数据库连接失败:', err);
    failure(err);
  });

};
