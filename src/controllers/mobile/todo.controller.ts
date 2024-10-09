import response from "@utils/response"
import moment from "moment";
import catchErrorHandler from "@middlewares/error.middleware";
import { TodoService } from "@/services/todo.serices";
import { NextFunction, Response } from 'express';
import { message, codes } from "@/utils/messages";
import { RequestWithUser } from "@/interfaces/auth.interface";

export class ToDoController {
    public todoService = new TodoService();

    public allTodos = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            let { page, limit, startDate, endDate } = req.body
            startDate = startDate ? startDate : new Date()
            endDate = endDate ? endDate : new Date()

            const skip: any = page * limit - limit;
            const query = { $and: [] };
            query['$and'].push({ userId: req.user._id });

            const subQuery = { $or: [] };
            if (req.body.search) {
                subQuery['$or'].push({ title: { $regex: req.body.search, $options: 'i' } });
            }
            query['$and'].push({
                date: {
                    $gte: moment(startDate, 'DD-MM-YYYY').startOf('day'),
                    $lte: moment(endDate, 'DD-MM-YYYY').endOf('day')
                }
            });

            if (
                typeof subQuery !== 'undefined' &&
                Object.keys(subQuery).length > 0 &&
                subQuery['$or'].length > 0
            ) {
                query['$and'].push(subQuery);
            }

            const allTodoData = await this.todoService.listAllTodo(query, parseInt(skip), parseInt(limit));
            if (allTodoData) {
                return res.send(response.success_response(codes.success.ok, message.toDo.fetchAllToDo, allTodoData))
            }
        }
        catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public addTodo = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
                userId: req.user._id
            }
            const addNewTodo = await this.todoService.addTodo(data)
            if (addNewTodo) {
                return res.send(response.success_response(codes.success.ok, message.toDo.createdToDo, addNewTodo))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public updateTodo = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const updateTodoData = await this.todoService.updateTodo(data)
            if (updateTodoData) {
                return res.send(response.success_response(codes.success.ok, message.toDo.updatedToDo, updateTodoData))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public deleteTodo = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const id = req.body
            const deleteTodoData = await this.todoService.deleteTodo(id)
            if (deleteTodoData) {
                return res.send(response.success_response(codes.success.ok, message.toDo.deletedToDo, []))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public changeCompletionStatus = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const todoData = await this.todoService.changeStatus(data)
            if (todoData) {
                return res.send(response.success_response(codes.success.ok, message.toDo.changeStatus, todoData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}
export default ToDoController