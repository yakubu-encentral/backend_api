import { APIGatewayProxyEvent } from "aws-lambda";
import { ItemService } from "./item.service";
import { CreateItemDto, UpdateItemDto } from "./item.dto";

export class ItemController {
  private readonly itemService;

  constructor() {
    this.itemService = new ItemService();
  }

  async createItem(event: APIGatewayProxyEvent) {
    const dto: CreateItemDto = JSON.parse(event.body!);
    const item = await this.itemService.createItem(dto);
    return {
      statusCode: 201,
      body: JSON.stringify(item),
    };
  }

  async updateItem(event: APIGatewayProxyEvent) {
    const itemId = event.pathParameters!.itemId!;
    const dto: UpdateItemDto = JSON.parse(event.body!);
    const item = await this.itemService.updateItem(itemId, dto);
    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  }

  async getItem(event: APIGatewayProxyEvent) {
    const itemId = event.pathParameters!.itemId!;
    const item = await this.itemService.getItem(itemId);
    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  }

  async deleteItem(event: APIGatewayProxyEvent) {
    const itemId = event.pathParameters!.itemId!;
    await this.itemService.deleteItem(itemId);
    return {
      statusCode: 204,
    };
  }
}
