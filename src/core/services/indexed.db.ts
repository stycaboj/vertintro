import Dexie, { Table } from 'dexie';
import { CategoryModel } from '../models/category.model';

export class IndexedDb extends Dexie {
  categories!: Table<CategoryModel, number>;

  constructor() {
    super('categoryDB');
    this.version(3).stores({
      categories: '++id',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    await db.categories.bulkAdd([
      {
        id: 0,
        isSelected: false,
        isExpanded: false,
        name: 'Продажи',
        stages: [
          { id: 0, isSelected: false, name: 'Неразобранное', color: '#99CCFD' },
          { id: 1, isSelected: false, name: 'Переговоры', color: '#FFFF99' },
          {
            id: 2,
            isSelected: false,
            name: 'Принимают решение',
            color: '#FFCC66',
          },
          { id: 3, isSelected: false, name: 'Успешно', color: '#CCFF66' },
        ],
      },
      {
        id: 1,
        isSelected: false,
        isExpanded: false,
        name: 'Сотрудники',
        stages: [
          { id: 0, isSelected: false, name: 'Неразобранное', color: '#99CCFD' },
          { id: 1, isSelected: false, name: 'Переговоры', color: '#FFFF99' },
          {
            id: 2,
            isSelected: false,
            name: 'Принимают решение',
            color: '#FFCC66',
          },
          { id: 3, isSelected: false, name: 'Успешно', color: '#CCFF66' },
        ],
      },
      {
        id: 2,
        isSelected: false,
        isExpanded: false,
        name: 'Партнёры',
        stages: [
          { id: 0, isSelected: false, name: 'Неразобранное', color: '#99CCFD' },
          { id: 1, isSelected: false, name: 'Переговоры', color: '#FFFF99' },
          {
            id: 2,
            isSelected: false,
            name: 'Принимают решение',
            color: '#FFCC66',
          },
          { id: 3, isSelected: false, name: 'Успешно', color: '#CCFF66' },
        ],
      },
      {
        id: 3,
        isSelected: false,
        isExpanded: false,
        name: 'Ивенты',
        stages: [
          { id: 0, isSelected: false, name: 'Неразобранное', color: '#99CCFD' },
          { id: 1, isSelected: false, name: 'Переговоры', color: '#FFFF99' },
          {
            id: 2,
            isSelected: false,
            name: 'Принимают решение',
            color: '#FFCC66',
          },
          { id: 3, isSelected: false, name: 'Успешно', color: '#CCFF66' },
        ],
      },
      {
        id: 4,
        isSelected: false,
        isExpanded: false,
        name: 'Входящие обращения',
        stages: [
          { id: 0, isSelected: false, name: 'Неразобранное', color: '#99CCFD' },
          { id: 1, isSelected: false, name: 'Переговоры', color: '#FFFF99' },
          {
            id: 2,
            isSelected: false,
            name: 'Принимают решение',
            color: '#FFCC66',
          },
          { id: 3, isSelected: false, name: 'Успешно', color: '#CCFF66' },
        ],
      },
    ]);
  }
}

export const db = new IndexedDb();
