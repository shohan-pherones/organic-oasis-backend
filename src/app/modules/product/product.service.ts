import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";
import AppError from "../../errors/app.error";
import CategoryModel from "../category/category.model";
import { IProduct } from "./product.interface";
import ProductModel from "./product.model";

const createProduct = async (productData: IProduct): Promise<IProduct> => {
  const session = await startSession();

  try {
    session.startTransaction();

    const { name, description, price, stock, categories, images } = productData;

    const products = await ProductModel.find();
    const conflicted = products.filter((pr) => pr.name === name);

    if (conflicted.length > 0) {
      throw new AppError(StatusCodes.CONFLICT, "Product already exists");
    }

    const product = await ProductModel.create(
      [{ name, description, price, stock, categories, images }],
      { session }
    );

    await CategoryModel.updateMany(
      { _id: { $in: categories } },
      { $push: { products: product[0]._id } },
      { session }
    );

    await session.commitTransaction();
    return (await product[0].populate("categories")).toObject();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const ProductServices = {
  createProduct,
};
