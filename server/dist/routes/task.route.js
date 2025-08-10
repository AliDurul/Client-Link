"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const router = (0, express_1.Router)();
router.route('/').get(task_controller_1.getTasks).post(task_controller_1.createTask);
router.get('/count', task_controller_1.getCountDetail);
router.route('/:id').get(task_controller_1.getTaskById).put(task_controller_1.updateTask).delete(task_controller_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.route.js.map