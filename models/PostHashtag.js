const sequelize = require('../config/database')
const {DataTypes} = require('sequelize')

const PostHashtag = sequelize.define('post_hashtag', {
    id :{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    postId:{
        type: DataTypes.INTEGER,
        // hashtag가 추가 되지 않아서 추가함
        references:{
            model:'posts',
            key: 'id'
        }
    },
    hashtagId:{
        type: DataTypes.INTEGER,
        references: {
            model:'hashtags',
            key:'id'
        }
    },
    // new:{
    //     type: DataTypes.INTEGER
    // }
},{
    underscored:true
})

module.exports = PostHashtag;