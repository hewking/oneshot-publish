import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { ItemsService } from "./items.service";
import { Item } from "./item.entity";

@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(): Item[] {
    return this.itemsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Item {
    return this.itemsService.findOne(id);
  }

  @Post()
  create(@Body() item: Omit<Item, "id">): Item {
    return this.itemsService.create(item);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatedItem: Partial<Item>
  ): Item {
    return this.itemsService.update(id, updatedItem);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): { success: boolean } {
    this.itemsService.remove(id);
    return { success: true };
  }
}
