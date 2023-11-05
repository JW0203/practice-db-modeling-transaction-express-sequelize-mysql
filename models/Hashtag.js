const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');


const Hashtag = sequelize.define('hashtags', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    word:{
        type: DataTypes.STRING
    }
},{
    underscored:true
})

module.exports = Hashtag;