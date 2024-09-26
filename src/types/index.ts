export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number|null;
  index?: number;
}

export interface ICardsList {
  total: number;
  items: ICard[];
}

export interface IAppData {
  cards: ICard[];
  preview: string|null;
  addItem(cardId: string): void;
  getCard(cardId: string): ICard;
  cart: ICard[];
  total: number;
  deleteItem(id: string): void;
}

export type TCardPreview = Omit<ICard, 'description'>;
export type TCardBasketItem = Pick<ICard, 'id'|'title'|'price'>;
export type TAnyCard = ICard|TCardPreview|TCardBasketItem;

export interface IOrderData {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderResult {
  id: string;
  total: number|null;
}

export interface IRequestError {
  error: string;
}


export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method: ApiPostMethods): Promise<T>;
}