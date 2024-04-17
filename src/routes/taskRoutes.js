/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 12/11/2023 08:12:40
 */
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ taskController.getTasks);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ taskController.getTasksByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ taskController.searchTaskByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ taskController.showTaskById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ taskController.createTask);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ taskController.sortTaskByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ taskController.updateTaskById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ taskController.removeTaskById);

module.exports = router;
