import { CategoryService } from "@/services/category.services";
import { codes, message } from "@/utils/messages";
import { NextFunction, Response } from "express";
import { RequestWithUser } from "@/interfaces/auth.interface";
import catchErrorHandler from "@/middlewares/error.middleware";
import response from "@/utils/response";

export class WebCategoryController {
    public categoryservice = new CategoryService()

    public getCategory = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { search } = req.body
            const query = { $and: [] };
            query['$and'].push({ status: 1 });
            if (search) {
                query['$and'].push({ categoryName: { $regex: search, $options: 'i' } });
            }
            const fetchAllCAtegory = await this.categoryservice.getCategorys(query)
            return res.send(response.success_response(codes.success.ok, message.category.fetchCategorySuccess, fetchAllCAtegory))
            
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public addCategory = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
            }
            const addNewCategory = await this.categoryservice.addCategory(data)
            if (addNewCategory) {
                return res.send(response.success_response(codes.success.ok, message.category.addedCategory, addNewCategory))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public updateCategory = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
            }
            const categoryUpdate = await this.categoryservice.updateCategory(data)
            if (categoryUpdate) {
                return res.send(response.success_response(codes.success.ok, message.category.updatedCategory, categoryUpdate))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public deleteCategory = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.body.categoryId
            const categoryDelete = await this.categoryservice.deleteCategory(categoryId)
            if (categoryDelete) {
                return res.send(response.success_response(codes.success.ok, message.category.deletedCategory, categoryDelete))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public globalSearchForCategoryAndProduct = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { search } = req.body
            const categorySearchFilter = { status: 1 };
            const productSearchFilter = { status: 1 };
            if (search) {
                categorySearchFilter['$or'] = [ { categoryName: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), $options: 'i' } } ]
                productSearchFilter['$or'] = [ { productName: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), $options: 'i' } } ]
                // const categorySearchFields = ['categoryName'];
                // categorySearchFilter['$or'] = categorySearchFields.map((field) => ({
                //   [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), $options: 'i' },
                // }));
            }
            
            const [categorySearchResult, productSearchResult] = await this.categoryservice.searchCategoryAndProduct(categorySearchFilter, productSearchFilter)
           
            return res.send(response.success_response(codes.success.ok, message.success.getDataSuccess, [...categorySearchResult, ...productSearchResult]))
            

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}