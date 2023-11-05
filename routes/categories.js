const express = require('express');
const router = express.Router();
const {Category} = require("../models/index");
const sequelize = require('../config/database');

router.post('/', async (req, res) => {
    const {name } = req.body;

    const saveCategory = await sequelize.transaction(async (t) =>{
        const newCategories = []
        for( let n of name){
            const existingCategory = await Category.findOne({
                where : {name: n},
                transaction:t
            });
            if (!existingCategory){
                const makeCategory = await Category.create(
                    {name: n},{transaction:t}
                )
                newCategories.push(makeCategory)
            }else{
                console.log(`${n} is existing`)
            }

        }

        return newCategories
    })

    res.status(201).send(saveCategory);
})

router.get('/', async (req, res) => {
    const allCategories = await Category.findAll();
    res.status(200).send(allCategories);
})


module.exports = router;