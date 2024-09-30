import { IApi, ICard, IOrderData, IOrderResult, IRequestError, IServerOrderData } from "../types";
import { ICardsList } from "../types";

export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi:IApi){
    this._baseApi = baseApi;
  }

  getCards(): Promise<ICard[]> {
    return this._baseApi.get<ICardsList>(`/product/`).then((data:ICardsList)=> data.items);
  }

  getCard(cardId:string): Promise<ICard> {
    return this._baseApi.get<ICard>(`/product/${cardId}`).then((card:ICard)=> card);
  }

  sendOrderData(orderData:IServerOrderData):Promise<IOrderResult|IRequestError> {
    return this._baseApi.post<IOrderResult|IRequestError>(`/order/`, orderData, 'POST');
  }
}