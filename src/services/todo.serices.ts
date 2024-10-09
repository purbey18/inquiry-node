import { HttpException } from "@/exceptions/HttpException";
import { codes, message } from "@/utils/messages";
import toDoModel from "@/models/todo.model";

export class TodoService {
    public Todo = toDoModel

    public async listAllTodo(query: any, skip?: any, limit?: any) {
        const allTodoData = await this.Todo.find(query)
            .skip(skip)
            .limit(limit)
            .select('-modifiedAt')
            .sort({ createdAt: -1 })
            .lean()

        if (allTodoData) {
            return allTodoData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }
    public async addTodo(data: any) {
        const newTodo = await this.Todo.create(data);
        if (newTodo) {
            return newTodo
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToCreate);
        }
    }

    public async updateTodo(data: any) {
        const { id, ...rest } = data;
        const updateTodo = await this.Todo.findOneAndUpdate(
            { _id: data.id }, rest, { new: true, runValidators: true })

        if (updateTodo) {
            return updateTodo
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToUpdate);
        }
    }

    public async deleteTodo(data: any) {
        const toDodata = await this.Todo.findByIdAndDelete({ _id: data.id })
        if (toDodata) {
            return toDodata
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToDelete);
        }
    }

    public async changeStatus(data: any) {
        const todoData = await this.Todo.findOneAndUpdate(
            { _id: data.id }, { completionStatus: data.status },
            { new: true, runValidators: true }
        )
        if (todoData) {
            return todoData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToChangeStatus);
        }
    }
}