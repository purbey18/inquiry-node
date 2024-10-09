import { codes, message } from "@/utils/messages";
import { NextFunction, Response } from "express";
import { ProductService } from "@/services/product.serices";
import { UserService } from "@/services/auth.services";
import { SECRET_KEY } from '@config';
import { sign } from 'jsonwebtoken';
import catchErrorHandler from "@/middlewares/error.middleware";
import response from "@/utils/response";
import path from "path";
import fs from 'fs'
import Jimp from "jimp"
import { RequestWithUser } from "@/interfaces/auth.interface";


export class WebProductController {
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

    public addProduct = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
            }
            await this.productService.checkProductExistOrNot({ categoryId: data.categoryId, productName: data.productName })
            if (req.files) {
                let attachPhotosArray = [];
                let attachPhotos = req.files.attachPhotos;
                attachPhotos = Array.isArray(attachPhotos) ? attachPhotos : [attachPhotos]
                let uploadPath = './src/uploads/productImages/';

                if (attachPhotos.length > 0) {
                    attachPhotos.forEach(fileData => {
                        if (fileData.mimetype !== "image/png" && fileData.mimetype !== "image/jpg" && fileData.mimetype !== "image/jpeg") {
                            return res.send(response.error_response(codes.error.badRequest, message.file.fileTypeInvalid))
                        }
                        if (fileData.size >= (1024 * 1024 * 5)) { // if getter than 5MB
                            return res.send(response.error_response(codes.error.badRequest, message.file.fileTooBig))
                        }
                    });
                    for (let i = 0; i < attachPhotos.length; i++) {
                        const fileData = attachPhotos[i];
                        attachPhotos[i].name.trim()
                        const splitFileName = attachPhotos[i].name.split('.')
                        const addTimeStampInFileName = splitFileName[0] + '-' + Date.now() + '.' + splitFileName[1]
                        const splitName = addTimeStampInFileName.split(' ')
                        const fileName = splitName.length > 0 ? splitName.join('-') : addTimeStampInFileName
                        const uploadFile = () => {
                          return new Promise((resolve, reject) => { //upload the file, then call the callback with the location of the file
                              fileData.mv(uploadPath + fileName, async function (error) {
                                  if (error) {
                                      reject(error)
                                      return res.send(response.error_response(codes.error.badRequest, message.file.fileUploadfailed))
                                  }
                                  await Jimp.read(uploadPath + fileName, async (err, image) => {
                                    if (err) throw err;
                                    
                                    // Load the watermark image
                                    Jimp.read('./src/public/new-water-mark.png', async (err, watermark) => {
                                      if (err) throw err;
                                
                                      // Resize the watermark image to fit the input image
                                      watermark.resize(image.bitmap.width , image.bitmap.height);
                                
                                      // Place the watermark at the bottom right corner of the image
                                      const x = image.bitmap.width - watermark.bitmap.width -10 
                                      const y = image.bitmap.height - watermark.bitmap.height - 10
                              
                                      image.composite(watermark, x, y);
                                  
                                      // Save the image with the watermark
                                      image.write(uploadPath + fileName);
                                      
                                    });
                                  });
                                });
                            resolve('image uploaded successfully')
                          })
                      }
                      await uploadFile();
                      attachPhotosArray.push(fileName);
                    }
                    data.attachPhotos = attachPhotosArray
              }
            }
            const addNewProduct = await this.productService.addProduct(data)
            if (addNewProduct) {
                return res.send(response.success_response(codes.success.ok, message.product.addedProduct, addNewProduct))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public updateProduct = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
            }
            data.oldImg = data.oldImg ? JSON.parse(data.oldImg) : [];
            await this.productService.checkProductExistOrNot({ productId: data.productId, categoryId: data.categoryId, productName: data.productName })
            if (req.files) {
                let attachPhotosArray = [];
                let attachPhotos = req.files.attachPhotos;
                attachPhotos = Array.isArray(attachPhotos) ? attachPhotos : [attachPhotos]
                const storedFiles = './src/uploads/productImages/';

                if (attachPhotos.length > 0) {
                    attachPhotos.forEach(fileData => {
                        if (fileData.mimetype !== "image/png" && fileData.mimetype !== "image/jpg" && fileData.mimetype !== "image/jpeg") {
                            return res.send(response.error_response(codes.error.badRequest, message.file.fileTypeInvalid))
                        }
                        if (fileData.size >= (1024 * 1024 * 5)) { // if getter than 5MB
                            return res.send(response.error_response(codes.error.badRequest, message.file.fileTooBig))
                        }
                    });
                    for (let i = 0; i < attachPhotos.length; i++) {
                        const fileData = attachPhotos[i];
                        attachPhotos[i].name.trim()
                        const splitFileName = attachPhotos[i].name.split('.')
                        const addTimeStampInFileName = splitFileName[0] + '-' + Date.now() + '.' + splitFileName[1]
                        const splitName = addTimeStampInFileName.split(' ')
                        const fileName = splitName.length > 0 ? splitName.join('-') : addTimeStampInFileName
                        const uploadFile = () => {
                            return new Promise((resolve, reject) => { //upload the file, then call the callback with the location of the file
                                fileData.mv(storedFiles + fileName, async function (error) {
                                    if (error) {
                                        reject(error)
                                        return res.send(response.error_response(codes.error.badRequest, message.file.fileUploadfailed))
                                    }
                                    await Jimp.read(storedFiles + fileName, async (err, image) => {
                                      if (err) throw err;
                                      
                                      // Load the watermark image
                                      Jimp.read('./src/public/new-water-mark.png', async (err, watermark) => {
                                        if (err) throw err;
                                  
                                        // Resize the watermark image to fit the input image
                                        watermark.resize(image.bitmap.width , image.bitmap.height);
                                  
                                        // Place the watermark at the bottom right corner of the image
                                        const x = image.bitmap.width - watermark.bitmap.width -10 
                                        const y = image.bitmap.height - watermark.bitmap.height - 10
                                
                                        image.composite(watermark, x, y);
                                    
                                        // Save the image with the watermark
                                        image.write(storedFiles + fileName);
                                        
                                      });
                                    });
                                });
                              resolve('image uploaded successfully')
                            })
                        }
                        await uploadFile();
                        attachPhotosArray.push(fileName);
                    }
                    data.attachPhotos = attachPhotosArray
                }
            }
            if (data.oldImg && data.oldImg.length > 0) {
                const storedFiles = './src/uploads/productImages/';
                for (let i = 0; i < data.oldImg.length; i++) {
                    fs.unlinkSync(storedFiles + data.oldImg[i]);
                }
            }

            const productUpdate = await this.productService.updateProduct(data)

            if (productUpdate) {
                return res.send(response.success_response(codes.success.ok, message.product.updatedProduct, productUpdate))
            }

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

    public addOrDeleteProductImage = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
            }
            data.oldImg = data.oldImg ? JSON.parse(data.oldImg) : [];
            
            if (req.files) {
                let attachPhotosArray = [];
                let attachPhotos = req.files.attachPhotos;
                attachPhotos = Array.isArray(attachPhotos) ? attachPhotos : [attachPhotos]
                const storedFiles = './src/uploads/productImages/';

                if (attachPhotos.length > 0) {
                    attachPhotos.forEach(fileData => {
                        if (fileData.mimetype !== "image/png" && fileData.mimetype !== "image/jpg" && fileData.mimetype !== "image/jpeg") {
                            return res.send(response.error_response(codes.error.badRequest, message.file.fileTypeInvalid))
                        }
                        if (fileData.size >= (1024 * 1024 * 5)) { // if getter than 5MB
                            return res.send(response.error_response(codes.error.badRequest, message.file.fileTooBig))
                        }
                    });
                    for (let i = 0; i < attachPhotos.length; i++) {
                        const fileData = attachPhotos[i];
                        attachPhotos[i].name.trim()
                        const splitFileName = attachPhotos[i].name.split('.')
                        const addTimeStampInFileName = splitFileName[0] + '-' + Date.now() + '.' + splitFileName[1]
                        const splitName = addTimeStampInFileName.split(' ')
                        const fileName = splitName.length > 0 ? splitName.join('-') : addTimeStampInFileName
                        const uploadFile = () => {
                            return new Promise((resolve, reject) => { //upload the file, then call the callback with the location of the file
                                fileData.mv(storedFiles + fileName, async function (error) {
                                    if (error) {
                                        reject(error)
                                        return res.send(response.error_response(codes.error.badRequest, message.file.fileUploadfailed))
                                    }
                                    await Jimp.read(storedFiles + fileName, async (err, image) => {
                                      if (err) throw err;
                                      
                                      // Load the watermark image
                                      Jimp.read('./src/public/new-water-mark.png', async (err, watermark) => {
                                        if (err) throw err;
                                  
                                        // Resize the watermark image to fit the input image
                                        watermark.resize(image.bitmap.width , image.bitmap.height);
                                  
                                        // Place the watermark at the bottom right corner of the image
                                        const x = image.bitmap.width - watermark.bitmap.width -10 
                                        const y = image.bitmap.height - watermark.bitmap.height - 10
                                
                                        image.composite(watermark, x, y);
                                    
                                        // Save the image with the watermark
                                        image.write(storedFiles + fileName);
                                        
                                      });
                                    });
                                });
                              resolve('image uploaded successfully')
                            })
                        }
                        await uploadFile();
                        attachPhotosArray.push(fileName);
                    }
                    data.attachPhotos = attachPhotosArray
                }
            }
            if (data.oldImg && data.oldImg.length > 0) {
                const storedFiles = './src/uploads/productImages/';
                for (let i = 0; i < data.oldImg.length; i++) {
                    fs.unlinkSync(storedFiles + data.oldImg[i]);
                }
            }

            const updateProductImgs = await this.productService.addOrDeleteProductImage(data)
           
            return res.send(response.success_response(codes.success.ok, message.product.fetchProductSuccess, updateProductImgs))
            

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

            return res.send(response.success_response(codes.success.ok, message.success.tokenGetSuccess, token))

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public deleteProduct = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const productId = req.body.productId
            const productDelete = await this.productService.deleteProduct(productId)
            if (productDelete) {
                return res.send(response.success_response(codes.success.ok, message.product.deletedProduct, productDelete))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public getMultipleProductsById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const productIds = req.body.productIds
            const getProducts = await this.productService.getMultipleProductsById(productIds)
            if (getProducts) {
                return res.send(response.success_response(codes.success.ok, message.product.productGetSuccess, getProducts))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}