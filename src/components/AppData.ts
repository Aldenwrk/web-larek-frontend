import { IAppData } from "../types";
import { IEvents } from "./base/events";
import { ICard } from "../types";


export class AppData implements IAppData {
  protected _cards: ICard[];
  protected _preview: string|null;
  protected events: IEvents;
  protected _cart: ICard[] = [];
  total: number;
  

  constructor(events: IEvents){
    this.events = events;
  }

  set cards(cards:ICard[]){
    this._cards = cards;
    this.events.emit('cardsList:changed');
  }

  get cards(){
    return this._cards;
  }

  set preview(cardId: string|null){
    if(!cardId){
      this._preview = null;
      return;
    }
    const selectedCard = this.getCard(cardId);
    if(selectedCard){
      this._preview = cardId;
      this.events.emit('card:select');
    }
  }

  get preview(){
    return this._preview;
  }

  get cart(){
    return this._cart;
  }

  getCard(cardId: string){
    return this._cards.find((item)=>item.id===cardId)
  };

  checkInCart(cardId:string){
   return this._cart.some((item)=>item.id===cardId)
  }

  addItem(card: ICard){
    if(!this.checkInCart(card.id)){
      this._cart.push(card);
      this.events.emit('basket:changed');
    }  //Потестить, мб лучше переписать на айди
  };

  deleteItem(cardId: string){
    if(this.checkInCart(cardId)){
      this._cart = this._cart.filter((item)=>{
        return item.id !== cardId
      })
    this.events.emit('basket:changed');
    }
  };

  getTotal(){
    this.total = this._cart.length
    return this.total;
  }
 
}