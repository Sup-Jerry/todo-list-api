// api/todos.js - 主要的待办清单API
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

    // GET请求：获取待办列表
    if (req.method === 'GET') {
        const { status, priority, category } = req.query;

        let filteredTodos = [...todoList];

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

        // 成功响应
        res.status(200).json({
            code: 200,
            message: 'success',
            data: filteredTodos,
            total: filteredTodos.length,
            timestamp: Date.now()
        });
        return;
    }

    // POST请求：创建新任务（模拟）
    if (req.method === 'POST') {
        try {
            const newTask = req.body ? JSON.parse(req.body) : {};

            const taskWithId = {
                id: (todoList.length + 1).toString(),
                title: newTask.title || '新任务',
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

            res.status(201).json({
                code: 201,
                message: '任务创建成功',
                data: taskWithId,
                timestamp: Date.now()
            });
        } catch (error) {
            res.status(400).json({
                code: 400,
                message: '请求数据格式错误: ' + error.message,
                data: null,
                timestamp: Date.now()
            });
        }
        return;
    }

    // PUT请求：更新任务（模拟）
    if (req.method === 'PUT') {
        try {
            const updatedTask = req.body ? JSON.parse(req.body) : {};
            const taskId = req.query.id;

            if (!taskId) {
                res.status(400).json({
                    code: 400,
                    message: '缺少任务ID参数',
                    data: null,
                    timestamp: Date.now()
                });
                return;
            }

            // 模拟更新任务
            const taskIndex = todoList.findIndex(task => task.id === taskId);
            if (taskIndex === -1) {
                res.status(404).json({
                    code: 404,
                    message: '任务不存在',
                    data: null,
                    timestamp: Date.now()
                });
                return;
            }

            todoList[taskIndex] = {
                ...todoList[taskIndex],
                ...updatedTask,
                update_time: Date.now()
            };

            res.status(200).json({
                code: 200,
                message: '任务更新成功',
                data: todoList[taskIndex],
                timestamp: Date.now()
            });
        } catch (error) {
            res.status(400).json({
                code: 400,
                message: '请求数据格式错误',
                data: null,
                timestamp: Date.now()
            });
        }
        return;
    }

    // DELETE请求：删除任务（模拟）
    if (req.method === 'DELETE') {
        const taskId = req.query.id;

        if (!taskId) {
            res.status(400).json({
                code: 400,
                message: '缺少任务ID参数',
                data: null,
                timestamp: Date.now()
            });
            return;
        }

        // 模拟删除任务
        const taskIndex = todoList.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            res.status(404).json({
                code: 404,
                message: '任务不存在',
                data: null,
                timestamp: Date.now()
            });
            return;
        }

        const deletedTask = todoList.splice(taskIndex, 1)[0];

        res.status(200).json({
            code: 200,
            message: '任务删除成功',
            data: deletedTask,
            timestamp: Date.now()
        });
        return;
    }

    // 不支持的请求方法
    res.status(405).json({
        code: 405,
        message: 'Method Not Allowed',
        data: null,
        timestamp: Date.now()
    });
}