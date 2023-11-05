const express = require('express');
const router = express.Router();
const app = express();
const sequelize = require('../config/database');
const {Post, Comment, Category,Hashtag,PostHashtag} = require("../models/index")
const {Op} = require('sequelize');
app.use(express.json());


function sortDateAscending(a, b) {
    return new Date(a.createdAt) - new Date(b.createdAt)
}

function sortDateDescending(a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt)
}

router.post("/",  async (req, res) => {
    console.log(req.body);
    const {title, content, categoryId, hashtags} = req.body;

    try{
        const newPost = await sequelize.transaction(async () => {
            // 에러로 인해서 추가한 코드 : category 확인

            const validCategory = await Category.findByPk(categoryId);
            if (!validCategory){
                return res.status(400).send("Error: Invalid categoryId");
            }

            const post = await Post.create({
                title: title,
                content: content,
                categoryId: categoryId,
            });

            for (let hashtag of hashtags){
                let existingHashtag = await Hashtag.findOne({
                    where: {word: hashtag},
                })
                // console.log(existingHashtag)

                if (!existingHashtag){
                    existingHashtag = await Hashtag.create({
                        word:hashtag
                    });
                }
                await post.addHashtag(existingHashtag);
            }
            return post;
        });
        res.status(201).send(newPost);
    } catch(error){
        console.error("Error while creating post:", error);
        res.status(500).send(error);
    }
});

// 최근에 작성된 순으로 게시글이 조회되어야 한다.
router.get("/", async (req, res) => {
    // https://velog.io/@jujube0/Sequelize-%EB%AC%B8%EC%A0%9C%ED%95%B4%EA%B2%B0
    // 참고해서
    const allPosts = await Post.findAll({
        include:[
            {
                model: Category,
                attributes:["name"],
            },
            {
                model: Hashtag,
                attributes: ["word"],
                through:{
                    attributes: []
                }
            }
        ],
        order: [['createdAt', 'DESC']]
    });
    console.log(allPosts);
    res.status(200).send(allPosts);

    //  이 부분 이해가 안되네 map은 okay, ... -> 스프레드 방식
    // const allPostsName = allPosts.map((post) =>{
    //     console.log("----------")
    //     console.log(post.dataValues);
    //
    //     return{
    //         ...post.dataValues,
    //         category : post.category.name,
    //         hashtags : post.hashtags.map((h) => h.word),
    //         updatedAt: undefined
    //     }
    // })
    // console.log(allPostsName);
    // const allPostsArray = Array.from(allPosts)
    //
    // console.log(allPostsArray);
    // console.log(Array.isArray(allPostsArray));
    // allPostsArray.sort(sortDateDescending);

    // res.status(200).send(JSON.stringify(allPostsName, null, 2));
    // res.status(200).send(allPostsName);
});


// 특정 해쉬 태그를 가진 게시글 전체 조회하기 - Include 없이구현
// GET /posts/hashtag
router.get('/hashtag', async(req,res) => {
    const {hashtag} = req.query
    console.log(hashtag)

    try {
        const foundHashtag = await Hashtag.findOne({where: {word: hashtag}});

        const foundPostHashtags = await PostHashtag.findAll({
            where: {
                hashtagId: foundHashtag.id
            },
        });

        // foundPostHashtags -> postId
        const postIds = [];
        for (const postHashtag of foundPostHashtags){
            const postId = postHashtag.dataValues.postId
            postIds.push(postId)
        }

        // postId -> get Posts
        const foundPosts = [];
        for (const postId of postIds){
            const foundPost = await Post.findOne({
                where:{
                    id: postId
                }
            })
            foundPosts.push(foundPost)
        }

        const trimmedPosts = []
        for (const foundPost of foundPosts) {
            foundPost.dataValues['hashtag'] = hashtag;
            trimmedPosts.push(foundPost.dataValues)

        }
        console.log(trimmedPosts);


        res.status(200).send(trimmedPosts);
    }catch (e){
        console.log(e)
        res.status(500).send(e);
    }

});

// 특정 해쉬 태그를 가진 게시글 전체 조회하기 - Include 사용
router.get('/hashtag-include', async (req, res) =>{
    const {hashtag} = req.query;
    try{
        const foundHashtag = await Hashtag.findOne({
            where:{
                word:hashtag
            }
        });

        const foundPostHashtags = await PostHashtag.findAll({
            where : {
                hashtagId : foundHashtag.id
                }
        });

        const postIds = []
        for(const postHashtag of foundPostHashtags){
            postIds.push(postHashtag.postId)
        }

        const foundPosts = await Post.findAll({
            where :{
                id : {
                    [Op.in] : postIds
                }
            },
            include:[
                {
                    model: Hashtag,
                    attributes:['word'],
                    // 아래의 코드로 hashtag에서 모든 데이터가 출력되는 문제 해결
                    through: {
                        attributes: ['postId']
                    }
                }

            ],
            attributes: ['id', 'title', 'content', 'createdAt']
        })
        res.status(200).send(foundPosts)
    }catch(e){
        res.status(500).send(e)
    }
})



// GET /posts
router.get('/category/:categoryId', async(req,res) => {
   const {categoryId} = req.params;

   const results =  await Post.findAll({
       where:{
           'categoryId': categoryId
       },
       order: [['createdAt', 'DESC']]
   });
   // results.sort(sortDateDescending);
   res.status(200).send(results);
});



router.get('/:id', async (req, res)=>{
    const postId = req.params.id;
    console.log(postId)
    const postsComments = await Post.findAll({
        where: {id: postId},
        include:[
            {
                model: Category,
                attributes: ['name']
            },
            {
                model:Hashtag,
                attributes: ['word'],
                through: {
                    attributes: ['postId']
                }
            },
            {
                model: Comment,
                where :{ postId : postId},
                attributes : [ 'comment', 'createdAt']
            }
        ]
    })
    // console.log(postsComments);

    // const results = postsComments.map((post) =>{
    //     return{
    //         ...post.get(),
    //         category : post.category.name,
    //         hashtags : post.hashtags.map((h) => h.word)
    //
    //     }
    // })
    // res.status(200).send({searchResult, postComments});
    // res.status(200).send(results);
    res.status(200).send(postsComments);
});

router.patch('/:id', async (req, res) =>{
    const postId = req.params.id;
    const {title, content} = req.body;

    const revisedPost = await sequelize.transaction(async (t)=>{
        await Post.update(
            {
                title:title,
                content: content
            },
            {
                where:{id:postId}
            },
        )
        const revisedPost = await Post.findByPk(postId,{transaction:t})
        return revisedPost;
    })
    res.status(200).send(revisedPost);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    // await Post.destroy({where:{id: postId}})
    // await Comment.destroy({where:{id : postId}})

    // 트랜잭션을 적용시켜서 구현해라.
    // 댓글도 같이 삭제
    await sequelize.transaction(async (t)=>{
        await Comment.destroy({where: {postId: id},transaction: t }, )
        await Post.destroy({where: {id: id}, transaction: t});
    })
    res.status(204).send();
})

module.exports = router;


