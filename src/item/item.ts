import { Handler } from "aws-lambda";
import { ItemController } from "./item.controller";
import { handleRequest } from "../middleware/handler.middleware";

const itemController = new ItemController();

export const createItem: Handler = handleRequest((event) => itemController.createItem(event));

export const updateItem: Handler = handleRequest((event) => itemController.updateItem(event));

export const getItem: Handler = handleRequest((event) => itemController.getItem(event));

export const deleteItem: Handler = handleRequest((event) => itemController.deleteItem(event));
