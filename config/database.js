const {Sequelize} = require('sequelize');
const cls = require('cls-hooked');
const  namespace = cls.createNamespace('sequelize-namespace');
Sequelize.useCLS(namespace);



const sequelize = new Sequelize('test_mini', 'root','',{
    host: '127.0.0.1',
    dialect: 'mysql',
    logQueryParametersL: true
})

const checkConnection = async () =>{
    try{
        await sequelize.authenticate(); // 서버 실행시 디비와의 연결 테스트 용
        console.log("연결 성공! ")

    } catch (err){
        console.log('실패!!', err);
    }
}

checkConnection();

module.exports = sequelize;