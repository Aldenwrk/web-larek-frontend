import { IOrderData } from "../types";

export class OrderData implements IOrderData{
  payment: string ="";
  address: string ="";
  email: string ="";
  phone: string ="";
}