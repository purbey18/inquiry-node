import { codes, message } from "@/utils/messages";
import { NextFunction, Response } from "express";
import { ProductService } from "@/services/product.serices";
import { UserService } from "@/services/auth.services";
import { SECRET_KEY, REACT_BASE_URL } from '@config';
import { sign } from 'jsonwebtoken';
import catchErrorHandler from "@/middlewares/error.middleware";
import response from "@/utils/response";
import path from "path";
import fs from 'fs'

export class ProductController {
    public productService = new ProductService()
    public userService = new UserService()

    public getProducts = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { search, categoryId } = req.body
            const query = { $and: [] };
            query['$and'].push({ categoryId: categoryId, status: 1 });
            if (search) {
                query['$and'].push({ productName: { $regex: search, $options: 'i' } });
            }
            const getAllProducts = await this.productService.getProductsByCategoryId(query)
           
            return res.send(response.success_response(codes.success.ok, message.product.fetchProductSuccess, getAllProducts))
            

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public getProductsImgById = async (req: any, res: Response, next: NextFunction) => {
        try {
            const productId = req.body.productId
            const getProductImg = await this.productService.getProductImagesByID(productId)
           
            return res.send(response.success_response(codes.success.ok, message.product.fetchProductSuccess, getProductImg))
            

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public shareProduct = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { categoryId, productId } = req.body
            const url = `${process.env.REACT_BASE_URL}/share/gallery/${categoryId}/${productId}`
            return res.send(response.success_response(codes.success.ok, message.category.getUrlSuccess, url))
            
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public shareImages = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { images, productId } = req.body
            const secretKey = SECRET_KEY;
            const expiresIn = '365d';
            const getProduct = await this.productService.getProductsById(productId)
            const token = sign({ productName: getProduct?.productName, images }, secretKey, { expiresIn })
            const link = `${REACT_BASE_URL}/share/images/?token=${token}`
            return res.send(response.success_response(codes.success.ok, message.success.tokenGetSuccess, link))

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}