import { Product } from '../models/common.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    code: 'A001',
    name: 'Product A',
    category: 'Accessories',
    quantity: 10,
    status: 'ACTIVE',
  },
  {
    id: 2,
    code: 'B002',
    name: 'Product B',
    category: 'Electronics',
    quantity: 5,
    status: 'INACTIVE',
  },
  {
    id: 3,
    code: 'C003',
    name: 'Product C',
    category: 'Fitness',
    quantity: 0,
    status: 'ARCHIVED',
  },
  {
    id: 4,
    code: 'D004',
    name: 'Product D',
    category: 'Clothing',
    quantity: 8,
    status: 'ACTIVE',
  },
];