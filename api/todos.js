// api/todos.js - 优化后的待办清单API
export default function handler(req, res) {
  // 设置CORS头部，允许HarmonyOS应用访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 模拟数据库中的待办数据
  const todoList = [
    {
      id: '1',
      title: '完成HarmonyOS项目',
      content: '完善TodoList应用的云端同步功能',
      status: 0, // 0=未完成, 1=已完成
      priority: 1, // 0=普通, 1=重要
      deadline: Date.now() + 86400000, // 明天
      category: 0, // 工作-紧急
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      id: '2', 
      title: '学习ArkTS开发',
      content: '研究ArkTS的语言特性和最佳实践',
      status: 0,
      priority: 1,
      deadline: Date.now() + 259200000, // 3天后
      category: 2, // 学习
      create_time: Date.now() - 86400000,
      update_time: Date.now()
    },
    {
      id: '3',
      title: '团队技术分享',
      content: '准备下周的技术分享内容',
      status: 1, // 已完成
      priority: 0,
      deadline: Date.now() - 172800000, // 昨天
      category: 1, // 工作-普通
      create_time: Date.now() - 259200000,
      update_time: Date.now()
    },
    {
      id: '4',
      title: '健身计划',
      content: '每周三次有氧运动',
      status: 0,
      priority: 0,
      deadline: null, // 无截止时间
      category: 3, // 生活
      create_time: Date.now() - 172800000,
      update_time: Date.now()
    },
    {
      id: '5',
      title: '代码评审',
      content: '评审团队成员的代码提交',
      status: 0,
      priority: 1,
      deadline: Date.now() + 172800000, // 2天后
      category: 0, // 工作-紧急
      create_time: Date.now(),
      update_time: Date.now()
    }
  ];

  // 统一响应格式函数
  const sendResponse = (code, message, data = null) => {
    res.status(code).json({
      code,
      message,
      data,
      timestamp: Date.now(),
      ...(data && Array.isArray(data) && { total: data.length })
    });
  };

  // GET请求：获取待办列表
  if (req.method === 'GET') {
    try {
      const { status, priority, category, id } = req.query;
      
      let filteredTodos = [...todoList];
      
      // 根据ID查询单个任务
      if (id) {
        const task = todoList.find(todo => todo.id === id);
        if (task) {
          return sendResponse(200, 'success', [task]);
        } else {
          return sendResponse(404, 'Task not found');
        }
      }
      
      // 查询参数过滤
      if (status !== undefined) {
        filteredTodos = filteredTodos.filter(todo => todo.status === parseInt(status));
      }
      if (priority !== undefined) {
        filteredTodos = filteredTodos.filter(todo => todo.priority === parseInt(priority));
      }
      if (category !== undefined) {
        filteredTodos = filteredTodos.filter(todo => todo.category === parseInt(category));
      }

      sendResponse(200, 'success', filteredTodos);
      return;
      
    } catch (error) {
      sendResponse(500, 'Internal server error');
      return;
    }
  }

  // POST请求：创建新任务
  if (req.method === 'POST') {
    try {
      let newTask;
      try {
        newTask = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch (parseError) {
        return sendResponse(400, 'Invalid JSON format');
      }

      // 验证必需字段
      if (!newTask || !newTask.title || newTask.title.trim() === '') {
        return sendResponse(400, 'Task title is required');
      }

      const taskWithId = {
        id: (todoList.length + 1).toString(),
        title: newTask.title.trim(),
        content: newTask.content || '',
        status: newTask.status || 0,
        priority: newTask.priority || 0,
        deadline: newTask.deadline || null,
        category: newTask.category || 0,
        create_time: Date.now(),
        update_time: Date.now()
      };

      // 模拟添加到列表
      todoList.push(taskWithId);

      sendResponse(201, 'Task created successfully', taskWithId);
      return;
      
    } catch (error) {
      sendResponse(500, 'Failed to create task');
      return;
    }
  }

  // PUT请求：更新任务
  if (req.method === 'PUT') {
    try {
      const taskId = req.query.id;
      if (!taskId) {
        return sendResponse(400, 'Task ID is required');
      }

      let updatedData;
      try {
        updatedData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch (parseError) {
        return sendResponse(400, 'Invalid JSON format');
      }

      const taskIndex = todoList.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        return sendResponse(404, 'Task not found');
      }

      // 更新任务数据
      todoList[taskIndex] = {
        ...todoList[taskIndex],
        ...updatedData,
        update_time: Date.now(),
        id: taskId // 防止ID被修改
      };

      sendResponse(200, 'Task updated successfully', todoList[taskIndex]);
      return;
      
    } catch (error) {
      sendResponse(500, 'Failed to update task');
      return;
    }
  }

  // DELETE请求：删除任务
  if (req.method === 'DELETE') {
    try {
      const taskId = req.query.id;
      if (!taskId) {
        return sendResponse(400, 'Task ID is required');
      }

      const taskIndex = todoList.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        return sendResponse(404, 'Task not found');
      }

      const deletedTask = todoList.splice(taskIndex, 1)[0];
      sendResponse(200, 'Task deleted successfully', deletedTask);
      return;
      
    } catch (error) {
      sendResponse(500, 'Failed to delete task');
      return;
    }
  }

  // 不支持的请求方法
  sendResponse(405, 'Method Not Allowed');
}
