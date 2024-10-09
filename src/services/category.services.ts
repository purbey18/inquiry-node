import { HttpException } from "@/exceptions/HttpException";
import { codes, message } from "@/utils/messages";
import categoryModel from "@/models/category.model";
import productModel from "@/models/product.model";

export class CategoryService {
  public category = categoryModel;
  public product = productModel;

  public async getCategorys(query: any) {
    const getAllCategory = await this.category.find(query);

    return getAllCategory;
  }

  public async addCategory(data: any) {
    const findCategory = await this.category.findOne({
      categoryName: data.categoryName,
    });
    if (findCategory) {
      throw new HttpException(
        codes.error.conflict,
        message.category.categoryAlreadyExists
      );
    }
    const newCategory = await this.category.create(data);
    if (newCategory) {
      return newCategory;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToCreate
      );
    }
  }

  public async updateCategory(data: any) {
    const findCategory = await this.category.findOne({
      _id: { $ne: data.categoryId },
      categoryName: data.categoryName,
    });
    if (findCategory) {
      throw new HttpException(
        codes.error.conflict,
        message.category.categoryAlreadyExists
      );
    }
    const updatedCategory = await this.category.findOneAndUpdate(
      { _id: data.categoryId },
      {
        categoryName: data.categoryName,
        status: data.status,
      },
      {
        returnOriginal: false,
      }
    );
    if (updatedCategory) {
      return updatedCategory;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToCreate
      );
    }
  }

  public async deleteCategory(categoryId: string) {
    const findCategory = await this.category.findOne({ _id: categoryId });
    if (!findCategory) {
      throw new HttpException(
        codes.error.conflict,
        message.category.categoryNotFound
      );
    }
    const deletedCategory = await this.category.findOneAndDelete({ _id: categoryId });
    if (deletedCategory) {
      return deletedCategory;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToDelete
      );
    }
  }

  public async searchCategoryAndProduct( categorySearchFilter: object, productSearchFilter: object) {
    const [categoorySearchResult, productSearchResult] = await Promise.all([
      this.category.aggregate([
        { $match: categorySearchFilter },
        //   { $sort: sort },
        //   { $skip: skip },
        //   { $limit: limit },
        {
          $addFields: {
            type: "category"
          },
        },
        {
          $project: {
            _id: 1,
            categoryName: 1,
            type: 1
          },
        },
      ]),
      this.product.aggregate([
        { $match: productSearchFilter },
        {
            $addFields: {
              type: "product"
            },
          },
        {
          $project: {
            _id: 1,
            productName: 1,
            categoryId: 1,
            type: 1
          },
        },
      ]),
    ]);

    return [categoorySearchResult, productSearchResult]
  }
}