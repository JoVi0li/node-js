import { Router } from "express";
import { CategoriesRepository } from "../repositories/CategoriesRepository";
import { CreateCategoryService } from "../services/CreateCategoryService";

const categoriesRoutes = Router();
const categoriesRepositories = new CategoriesRepository();

categoriesRoutes.post("/", (req, resp) => {
  const { name, description } = req.body;

  const createCategoryService = new CreateCategoryService(categoriesRepositories);

  createCategoryService.execute({name, description});
  
  return resp.status(201).send();
});

categoriesRoutes.get("/", (req, resp) => {
  const categories = categoriesRepositories.list();

  return resp.json(categories);
})

export { categoriesRoutes };