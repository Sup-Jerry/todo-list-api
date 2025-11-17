// api/todos.js - 适配 Vercel Functions 的版本
export default async function handler(req, res) {
  // 设置CORS头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 模拟数据
  const todoList = [
    {
      id: '1',
      title: '完成HarmonyOS项目',
      content: '完善TodoList应用的云端同步功能',
      status: 0,
      priority: 1,
      deadline: Date.now() + 86400000,
      category: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      id: '2', 
      title: '学习ArkTS开发',
      content: '研究ArkTS的语言特性和最佳实践',
      status: 0,
      priority: 1,
      deadline: Date.now() + 259200000,
      category: 2,
      create_time: Date.now() - 86400000,
      update_time: Date.now()
    }
  ];

  // 统一响应函数
  const sendResponse = (code, message, data = null) => {
    const response = {
      code,
      message,
      data,
      timestamp: Date.now()
    };
    
    if (data && Array.isArray(data)) {
      response.total = data.length;
    }
    
    return res.status(code).json(response);
  };

  try {
    // GET 请求
    if (req.method === 'GET') {
      const { status, priority, category, id } = req.query;
      
      let filteredTodos = [...todoList];
      
      // ID 查询
      if (id) {
        const task = todoList.find(todo => todo.id === id);
        return task ? sendResponse(200, 'success', [task]) : sendResponse(404, 'Task not found');
      }
      
      // 过滤
      if (status !== undefined) filteredTodos = filteredTodos.filter(todo => todo.status === parseInt(status));
      if (priority !== undefined) filteredTodos = filteredTodos.filter(todo => todo.priority === parseInt(priority));
      if (category !== undefined) filteredTodos = filteredTodos.filter(todo => todo.category === parseInt(category));
      
      return sendResponse(200, 'success', filteredTodos);
    }

    // 其他方法暂时返回简单响应
    return sendResponse(200, 'API is working', todoList);
    
  } catch (error) {
    console.error('API Error:', error);
    return sendResponse(500, 'Internal server error');
  }
}
