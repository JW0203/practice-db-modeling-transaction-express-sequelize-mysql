const Post = require('./Post');
const Comment = require('./Comment')
const Category = require('./Category')
const Hashtag = require('./Hashtag')
const PostHashtag = require('./PostHashtag')

// associations( 1:1, 1:N, N:M)

// Category :Post = 1 : N
Post.belongsTo(Category, {foreignKey: 'categoryId'})
Category.hasMany(Post, {foreignKey: 'categoryId'})

// Post: Comment = 1 : N
Comment.belongsTo(Post, {foreignKey:'postId'})
Post.hasMany(Comment, {foreignKey: 'postId'})


// Post: hashtag = N:M
Hashtag.belongsToMany(Post, {through:PostHashtag, foreignKey: 'hashtagId'})
Post.belongsToMany(Hashtag, {through: PostHashtag, foreignKey: 'postId'})

// 아래 방식도 생성가능하지만, 추가적인 콜롬을 생성이 불가능하다.
// Hashtag.belongsToMany(Post, {through:'PostHashtagTest', foreignKey: 'hashtagId'})
// Post.belongsToMany(Hashtag, {through: 'PostHashtagTest', foreignKey: 'postId'})

module.exports={
    Post,
    Comment,
    Category,
    Hashtag,
    PostHashtag
}