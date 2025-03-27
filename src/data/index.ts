import { Query } from "../types";
import { products } from "./products";
import { customers } from "./customers";
import { employees } from "./employees";
import { orders } from "./orders";
import { suppliers } from "./suppliers";

export const mockQueries: Query[] = [
  {
    id: 1,
    query: "SELECT * FROM employees;",
    data: employees,
  },
  {
    id: 2,
    query: "SELECT * FROM customers;",
    data: customers,
  },
  {
    id: 3,
    query: "SELECT * FROM products;",
    data: products,
  },
  {
    id: 4,
    query: "SELECT * FROM suppliers;",
    data: suppliers,
  },
  {
    id: 5,
    query: "SELECT * FROM orders;",
    data: orders,
  },
];
