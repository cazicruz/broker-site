const taskService = require('../Services/taskServices');
const userService =require('../Services/userServices');
const ApiError = require('../Utils/apiError');


const createTask = async (req,res)=>{
    const {name, amount} = req.body;
    if(!name || !amount){
        return res.status(400).json({msg:'Name and amount are required'});
    }
    const task = await taskService.createTask(name,amount);
    if (!task){
        return res.status(500).json({msg:'Error creating task'});
    }
    return res.status(200).json({
        msg:'Task created successfully',
        task:task
    })
}
const getAllTasks = async (req,res)=>{
    const tasks = await taskService.getAllTasks();
    if(!tasks){
        return res.status(500).json({msg:'Error getting tasks'});
    }
    return res.status(200).json({
        msg:'Tasks retrieved successfully',
        tasks:tasks
    })
}

const getTask = async (req,res)=>{
    const tasks = await taskService.getRandomTask(10);
    if(!tasks){
        return res.status(500).json({msg:'Error getting tasks'});
    }
    return res.status(200).json({
        msg:'Tasks retrieved successfully',
        tasks:tasks
    })
}

const updateTask = async (req,res)=>{
    const {id} = req.params;
    const {name, amount} = req.body;
    if (!name && !amount){
        return res.status(400).json({msg:'Name or amount is required'});
    }
    let updateObj = {}
    if(name) updateObj.name = name;
    if(amount) updateObj.amount = amount;

    const task = await taskService.updateTask(id,updateObj);
    if(!task){
        return res.status(500).json({msg:'Error updating task'});
    }
    
    if(task===1){
        return res.status(400).json({msg:'Task with name already exists'});
    }
    return res.status(200).json({
        msg:'Task updated successfully',
        task:task
    })
}

const deleteTask = async (req,res)=>{
    const {id} = req.params;
    const task = await taskService.deleteTask(id);
    if(!task){
        return res.status(500).json({msg:'Error deleting task'});
    }
    if(task===1){
        return res.status(400).json({msg:'Task not found'});
    }
    return res.status(200).json({
        msg:'Task deleted successfully',
        task:task
    })
}

const assignUserTask = async (req, res) => {
  const { userId } = req.params;
  let { taskIds } = req.body;
//   testing custom errors 
//throw new ApiError(400,'setApiError');

  // Check if taskIds is an array
  if (taskIds && !Array.isArray(taskIds)) {
    return res.status(400).json({ msg: 'TaskIds must be an array' });
  }

  // Calculate the number of tasks to assign (up to 10)
  let size = taskIds ? Math.min(10, taskIds.length) : 0;

  // If there are remaining tasks to assign, get random tasks to complete 10 tasks
  if (size < 10) {
    const tasks = await taskService.getRandomTask(10 - size);
    if (!tasks) {
      return res.status(500).json({ msg: 'Error getting tasks' });
    }
    // Merge the existing taskIds with the new tasks
    taskIds = taskIds ? taskIds.concat(tasks.map(task => task._id.toString())) : tasks.map(task => task._id.toString());
  }

  // Assign the tasks to the user (you would need to implement this logic)
  // userService.assignTasksToUser(userId, taskIds);
  const user = await taskService.assignTasksToUser(userId, taskIds);
  if(user ===1){
    return res.status(400).json({msg:'User not found'});
  }
  if(user===2){
    return res.status(400).json({msg:'one or more Task ids not found'});
  }
  if(user===3){
    return res.status(400).json({msg:'Task already assigned to user'});
  }
  if (!user) {
    return res.status(500).json({ msg: 'Error assigning tasks to user' });
  }

  return res.status(200).json({
    msg: 'Tasks assigned successfully',
    tasks: taskIds,
  });
};



const taskController = {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
    assignUserTask
}

module.exports = taskController;