const express = require('express');
const router = express.Router();
const {Comment, Post} = require("../models/index")
const sequelize = require('../config/database');

router.post('/', async (req, res) =>{
    const {postId, comment} = req.body;

    const saveComment = await sequelize.transaction(async ()=>{
        const existingPost = await Post.findOne({
            where: {id: postId}
        })
        if (!existingPost){
            return res.status(400).send("Error: Invalid postId");
        }

        const newComment = await Comment.create({
            comment: comment,
            postId : postId
        });
        return newComment;
    })
    res.status(201).send(saveComment);
})

router.delete('/:id', async (req,res) =>{
    const id = req.params.id;

    await sequelize.transaction(async () =>{
        await Comment.destroy({where: {id:id}})
    })
    res.status(204).send();
})

module.exports = router;