export interface Product {
    _id: string,
    categoryId: string,
    productName: string,
    perUnitPrice: Number,
    attachPhotos: [string]
}