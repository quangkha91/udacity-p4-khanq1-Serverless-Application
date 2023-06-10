import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const logger = createLogger('Todos business logic')
const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  logger.info(`Get all Todos userId: ${userId}`)
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(
  userId: string,
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {  
  logger.info(`Create new Todo`)
  const itemId = uuid.v4()
  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false
  })
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<TodoUpdate> {
  logger.info(`Update Todo todoId: ${todoId} - userId: ${userId} `)
  return await todoAccess.updateTodo(todoId, userId, {
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function deleteTodo(todoId: string, userId: string) {
  logger.info(`Delete Todo todoId: ${todoId} - userId: ${userId} `)
  await todoAccess.deleteTodo(todoId, userId)
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
) {
  logger.info('Create attachment presigned url')
  const imageId = uuid.v4()
  const url = attachmentUtils.getAttachmentUrl(imageId)
  await todoAccess.updateTodoAttachmentUrl(todoId, userId, url)
  return attachmentUtils.getUploadUrl(imageId)
}
