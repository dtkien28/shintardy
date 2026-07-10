const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TodosService {
  async getTodos(userId) {
    return await prisma.todo.findMany({
      where: { user_id: userId },
      orderBy: { due_date: 'asc' }
    });
  }

  async createTodo(userId, data) {
    const { title, description, due_date, priority, status } = data;
    
    return await prisma.todo.create({
      data: {
        user_id: userId,
        title,
        description,
        due_date: due_date ? new Date(due_date) : null,
        priority: priority || 'medium',
        status: status || 'todo'
      }
    });
  }

  async updateTodo(userId, todoId, data) {
    const todo = await prisma.todo.findUnique({ where: { id: todoId } });
    if (!todo || todo.user_id !== userId) {
      throw { code: 'NOT_FOUND', message: 'Công việc không tồn tại hoặc không có quyền' };
    }

    if (data.due_date) {
      data.due_date = new Date(data.due_date);
    }

    return await prisma.todo.update({
      where: { id: todoId },
      data
    });
  }

  async deleteTodo(userId, todoId) {
    const todo = await prisma.todo.findUnique({ where: { id: todoId } });
    if (!todo || todo.user_id !== userId) {
      throw { code: 'NOT_FOUND', message: 'Công việc không tồn tại hoặc không có quyền' };
    }

    await prisma.todo.delete({ where: { id: todoId } });
    return { success: true };
  }
}

module.exports = new TodosService();
