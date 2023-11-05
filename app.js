const express = require('express')
const app = express();
const port = 80; // 80 은 http 통신 디폴트
const sequelize = require('./config/database');
const {postsRouter, commentsRouter, categoriesRouter } = require('./routes');

app.use(express.json());// 에러 발생하여서 추가!!
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/categories', categoriesRouter);

// sequelize.sync({force:true});

app.get('/', (req, res) =>{
    res.send("Mini project!! - DB, ORM and API");
});

app.listen(port, () =>{
    console.log(`서버가 실행됩니다. http://localhost:${port}`);
})