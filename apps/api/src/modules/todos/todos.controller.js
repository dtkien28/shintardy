const todosService = require('./todos.service');

class TodosController {
  async getAll(req, res) {
    try {
      const todos = await todosService.getTodos(req.userId);
      res.status(200).json({ data: todos });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async create(req, res) {
    try {
      const todo = await todosService.createTodo(req.userId, req.body);
      res.status(201).json({ data: todo });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async update(req, res) {
    try {
      const todo = await todosService.updateTodo(req.userId, req.params.id, req.body);
      res.status(200).json({ data: todo });
    } catch (error) {
      if (error.code) return res.status(404).json({ error });
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async delete(req, res) {
    try {
      await todosService.deleteTodo(req.userId, req.params.id);
      res.status(200).json({ message: 'Xóa công việc thành công' });
    } catch (error) {
      if (error.code) return res.status(404).json({ error });
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }
}

module.exports = new TodosController();
