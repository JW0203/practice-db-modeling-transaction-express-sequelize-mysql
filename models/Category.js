const { DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Category = sequelize.define('categories', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING
    }
},{
    underscored:true
})

module.exports = Category;