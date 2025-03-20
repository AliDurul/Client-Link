"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */
// Controllers;

const Todo = require('../models/todo.model');


module.exports = {
    list: async (req, res) => {

        const result = await Todo.findAll() // Select * From todos
        // findAndCountAll()

        res.status(200).send({
            error: false,
            result
        })
    },

    create: async (req, res) => {

        // const result = await Todo.create({
        //     title: "title-1",
        //     description: 'description-1',
        //     isDone: false,
        //     priority: 0
        // });

        const result = await Todo.create(req.body);

        res.status(201).send({
            error: false,
            result
        });
    },

    read: async (req, res) => {

        // const result = await Todo.findOne({ where: { id: req.params.id } });
        const result = await Todo.findByPk(req.params.id);

        res.status(202).send({
            error: false,
            result
        })
    },

    update: async (req, res) => {

        // await Todo.update({...newData},{...where}) -> [1]:success, [0]:failed 
        // const result = await Todo.update({ title: 'title-updated-5' }, { where: { id: 5 } });
        const result = await Todo.update(req.body, { where: { id: req.params.id } });

        res.status(202).send({
            error: false,
            result,
            new: await Todo.findByPk(req.params.id)

        })
    },

    delete: async (req, res) => {

        // await Todo.destroy({...where}) -> 1:success, 0:failed
        const result = await Todo.destroy({ where: { id: req.params.id } })

        /* // 204 status code does not display any response
           res.status(204).send({
              error: false,
              result
           })
       */
        if (result) { // successful
            res.sendStatus(204)
        } else { // failed
            res.errorStatusCode = 404;
            throw new Error('Delete is not succesful. Data is not found or already deleted.');
        }
    }
}