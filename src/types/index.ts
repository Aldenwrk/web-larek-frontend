//пока интерфейсы и типы в одном месте для удобства, разложить по файлам перед реализацией
export interface ICard {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: number|null;
}

export interface ICardsList {
  total: number;
  items: ICard[];
}

export interface ICardsData {
  cards: ICard[];
  preview: string|null;
  addItem(card: ICard): void;
  getCard(cardId: string): ICard;
}

export type TCardPreview = Omit<ICard, 'description'>;
export type TCardBasketItem = Pick<ICard, 'id'|'title'|'price'>;

export interface IBasketData {
  cart: ICard[];
  total: number;
  deleteItem(id: string): void;
}

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