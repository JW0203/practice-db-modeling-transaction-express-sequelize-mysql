const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Post = sequelize.define('posts', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING
    },
    content:{
        type: DataTypes.STRING
    },
    createdAt:{
        type: DataTypes.DATE
    }
    // categoryId:{
    //     type: DataTypes.INTEGER
    // }
},{
    underscored:true
} )

module.exports = Post;