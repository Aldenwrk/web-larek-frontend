import { ICard } from "../types";
import { createElement, ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Component } from "./Component";
interface IBasket {
  items: HTMLElement[];
  basketPriceTotal: number;
}

export class Basket extends Component<IBasket>{
  protected _basketListContainer: HTMLUListElement;
  protected _basketPriceTotal: HTMLElement;
  protected _button:HTMLButtonElement;
  protected events:IEvents;

  constructor(container:HTMLElement, events:IEvents){
    super(container);
    this.events = events;
    this.items = [];//пустой массив, для разметки добавленных карточек и проверки

    this._basketListContainer = ensureElement<HTMLUListElement>('.basket__list', this.container);
    //console.log(this._basketListContainer)
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this._basketPriceTotal = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button.addEventListener('click', ()=>{
      this.events.emit('order:open');
    });
  }

  set total(totalPrice:number){
    this.setText(this._basketPriceTotal, `${totalPrice} синапсов`)
  }

  set items(basketCardsArray:HTMLElement[]){
   // console.log(basketCardsArray)
    if(basketCardsArray.length){
      this._basketListContainer.replaceChildren(...basketCardsArray);   
    }
  }

  blockButton(){
    this.setDisabled(this._button, true);
  }

  unblockButton(){
    this.setDisabled(this._button, false);
  }

  basketReset(){
    this._basketListContainer.replaceChildren();
  }
  //уточнить надо ли заглушку
}
