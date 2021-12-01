import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
// import { getRepository } from 'typeorm';
// import ProductEntity from '../database/entities/Product.Entity';
import ProductModel, {
  ProductDocument,
  ProductInput,
} from '../models/product.model';

export async function createProduct(input: ProductInput) {
  // postgres
  // const repository = getRepository(ProductEntity);
  // const newProduct = repository.create(input);
  // await repository.save(newProduct);
  // return newProduct;
  const result = await ProductModel.create(input);
  return result;
}

export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) {
  const result = await ProductModel.findOne(query, {}, options);
  return result;
}

export async function findProducts(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) {
  const result = await ProductModel.find(query, {}, options);
  return result;
}

export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) {
  return ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return ProductModel.deleteOne(query);
}
