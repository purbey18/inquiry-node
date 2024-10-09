import { HttpException } from "@/exceptions/HttpException";
import { codes, message } from "@/utils/messages";
import productModel from "@/models/product.model";

export class ProductService {
    public Products = productModel

    public async getProductsByCategoryId(query : any) {
        
        const getProducts = await this.Products.find(query)
        return getProducts ? getProducts : []
    }

    public async getProductsById(id : any) {
        
        const getProduct = await this.Products.findOne({ _id: id , status: 1 })
        return getProduct ? getProduct : null
    }

    public async checkProductExistOrNot(data : any) {

        if(data.productId){
            const existingProduct = await this.Products.findOne({ 
                _id: { $ne: data.productId }, 
                categoryId: data.categoryId, 
                productName: data.productName 
            })
            console.log('existingProduct===>', existingProduct)
            if(existingProduct){
                throw new HttpException(codes.error.conflict, message.product.productAlreadyExists)
            }
            return true
        }
        
        const existingProduct = await this.Products.findOne({ categoryId: data.categoryId, productName: data.productName })
        if(existingProduct){
            throw new HttpException(codes.error.conflict, message.product.productAlreadyExists)
        }
        return true;
    }

    public async addProduct(data: any) {

        const newProduct = await this.Products.create(data);
        if (newProduct) {
            return newProduct
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToCreate);
        }
    }

    public async updateProduct(data: any) {

        const existingProduct = await this.Products.findOne({ 
            _id: { $ne: data.productId }, 
            categoryId: data.categoryId, 
            productName: data.productName 
        })
        if(existingProduct){
            throw new HttpException(codes.error.conflict, message.product.productAlreadyExists)
        }
        let updateProduct;

        if(data.attachPhotos && data.attachPhotos.length > 0){
            updateProduct = await this.Products.findOneAndUpdate(
                {_id: data.productId },
                {
                    perUnitPrice: data.perUnitPrice,
                    productName: data.productName,
                    units: data.units,
                    $push: { attachPhotos: {$each: data.attachPhotos }},
                },
                {
                    returnOriginal: false
                }
            );
            await this.Products.findOneAndUpdate(
                {_id: data.productId },
                {
                    $pull: {
                        attachPhotos: { $in: data.oldImg }
                    }
                },
                {
                    returnOriginal: false
                }
            );
        }else{
            updateProduct = await this.Products.findOneAndUpdate(
                {_id: data.productId },
                {
                    perUnitPrice: data.perUnitPrice,
                    productName: data.productName,
                    units: data.units,
                    $pull: {
                        attachPhotos: { $in: data.oldImg }
                    }
                },
                {
                    returnOriginal: false
                }
            );
        }
        
        if (updateProduct) {
            return updateProduct
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToUpdate);
        }
    }

    public async getProductImagesByID(productId: any) {
        const productImg = await this.Products.findOne({ _id: productId }).select('attachPhotos productName')
        if (productImg) {
            return productImg
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async addOrDeleteProductImage(data: any) {

        let updateProduct;

        if(data.attachPhotos && data.attachPhotos.length > 0){
            updateProduct = await this.Products.findOneAndUpdate(
                {_id: data.productId },
                {
                    $push: { attachPhotos: {$each: data.attachPhotos }},
                },
                {
                    returnOriginal: false
                }
            );
            await this.Products.findOneAndUpdate(
                {_id: data.productId },
                {
                    $pull: {
                        attachPhotos: { $in: data.oldImg }
                    }
                },
                {
                    returnOriginal: false
                }
            );
        }else{
            updateProduct = await this.Products.findOneAndUpdate(
                {_id: data.productId },
                {
                    $pull: {
                        attachPhotos: { $in: data.oldImg }
                    }
                },
                {
                    returnOriginal: false
                }
            );
        }
        
        if (updateProduct) {
            return updateProduct
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToUpdate);
        }
    }

    public async deleteProduct(productId: any) {
        const findProduct = await this.Products.findOne({ _id: productId })
        if (findProduct) {
            const updateproductStatus = await this.Products.findOneAndDelete({ _id: productId })
            return updateproductStatus
        } else {
            throw new HttpException(codes.error.badRequest, message.product.productNotFound);
        }
    }

    public async getMultipleProductsById(ids : Array<string>) {
        
        const getProduct = await this.Products.find({ _id: { $in: ids } , status: 1 })
        return getProduct ? getProduct : null
    }
}