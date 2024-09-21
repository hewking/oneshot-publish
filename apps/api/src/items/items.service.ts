import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
  private items: Item[] = [];

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: number): Item {
    const item = this.items.find(item => item.id === id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  create(item: Omit<Item, 'id'>): Item {
    const newItem: Item = {
      id: this.items.length + 1,
      ...item,
    };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, updatedItem: Partial<Item>): Item {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    this.items[index] = { ...this.items[index], ...updatedItem };
    return this.items[index];
  }

  remove(id: number): void {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    this.items.splice(index, 1);
  }
}