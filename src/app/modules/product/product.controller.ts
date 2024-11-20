import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ProductServices } from "./product.service";

const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    const product = await ProductServices.createProduct(productData);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Product created successfully", product });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const ProductControllers = {
  createProduct,
};
