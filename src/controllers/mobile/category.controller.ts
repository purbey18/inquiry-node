import { CategoryService } from "@/services/category.services";
import { codes, message } from "@/utils/messages";
import { NextFunction, Response } from "express";
import { RequestWithUser } from "@/interfaces/auth.interface";
import catchErrorHandler from "@/middlewares/error.middleware";
import response from "@/utils/response";

export class CategoryController {
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

    public shareCategory = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { categoryId } = req.body
            const url = `${process.env.REACT_BASE_URL}/share/products/${categoryId}`
            return res.send(response.success_response(codes.success.ok, message.category.getUrlSuccess, url))
            
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