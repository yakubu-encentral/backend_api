import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "../db";
import { Item } from "./item.model";
import { randomUUID } from "crypto";
import { CreateItemDto, UpdateItemDto } from "./item.dto";
import { BadRequestError, NotFoundError } from "../errors";

export class ItemService {
  private readonly documentClient: DynamoDBDocumentClient;

  private ITEM_TABLE = process.env.ITEM_TABLE as string;

  constructor() {
    this.documentClient = dynamoDBClient();
  }

  async createItem(dto: CreateItemDto): Promise<Item> {
    this.validateCreateItemDto(dto);

    const itemData: Item = {
      itemId: randomUUID(),
      name: dto.name,
      description: dto.description,
      createdAt: new Date().toISOString(),
    };

    const commandInput: PutCommandInput = {
      TableName: this.ITEM_TABLE,
      Item: itemData,
    };
    const command = new PutCommand(commandInput);
    const item = await this.documentClient.send(command);
    return item.Attributes as Item;
  }

  async updateItem(itemId: string, dto: UpdateItemDto): Promise<Item> {
    this.validateUpdateItemDto(dto);
    await this.getItem(itemId);

    const commandInput: UpdateCommandInput = {
      TableName: this.ITEM_TABLE,
      Key: { itemId },
      UpdateExpression: "set #name = :name, #description = :description",
      ExpressionAttributeNames: {
        "#name": "name",
        "#description": "description",
      },
      ExpressionAttributeValues: {
        ":name": dto.name,
        ":description": dto.description,
      },
      ReturnValues: "ALL_NEW",
    };
    const command = new UpdateCommand(commandInput);
    const item = await this.documentClient.send(command);
    return item.Attributes as Item;
  }

  async getItem(itemId: string): Promise<any> {
    const commandInput: GetCommandInput = {
      TableName: this.ITEM_TABLE,
      Key: { itemId },
    };
    const command = new GetCommand(commandInput);
    const item = await this.documentClient.send(command);
    if (!item.Item) {
      throw new NotFoundError("Item not found");
    }
    return item.Item as Item;
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.getItem(itemId);

    const commandInput: DeleteCommandInput = {
      TableName: this.ITEM_TABLE,
      Key: { itemId },
    };
    const command = new DeleteCommand(commandInput);
    await this.documentClient.send(command);
  }

  private validateCreateItemDto(dto: CreateItemDto) {
    if (!dto) {
      throw new BadRequestError("Request body must be provided");
    }

    if (!dto.name) {
      throw new BadRequestError("Name is required");
    }

    if (!dto.description) {
      throw new BadRequestError("Description is required");
    }
  }

  private validateUpdateItemDto(dto: UpdateItemDto) {
    if (!dto) {
      throw new BadRequestError("Request body must be provided");
    }

    if (!dto.name) {
      throw new BadRequestError("Name is required");
    }

    if (!dto.description) {
      throw new BadRequestError("Description is required");
    }
  }
}
