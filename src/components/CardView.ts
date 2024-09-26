import { ICard } from "../types";
import { CDN_URL } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";
import { Component } from "./Component";

//общий родительский класс для всех карточек
export class CardView extends Component<ICard>{
  protected _title: HTMLElement; 
	protected _price: HTMLElement;
  protected element: HTMLElement;
  protected events: IEvents;

  constructor(template:HTMLTemplateElement, events:IEvents){
    super();
    this.events = events;
    this.element = cloneTemplate(template);

    this._title = this.element.querySelector('.card__title');
    this._price = this.element.querySelector('.card__price');
  }

  render(cardData:ICard){
    const {title, price, ...otherCardData} = cardData;
    if (title) this.title = title;
    if (price) this.price = price;
    Object.assign(this, otherCardData);
    return this.element;
  }

  set title(cardTitle: string){
    this.setText(this._title, cardTitle.toString());
  }

  set price(cardPrice:number|null){
    cardPrice === null ? this.setText(this._price, "Бесценно") : this.setText(this._price, cardPrice.toString());
    this._price.textContent = cardPrice.toString();
  }

}
//класс для карточек в корзине
export class CardBasketView extends CardView{
  protected element: HTMLElement;
  protected events: IEvents;
  protected _id: string;
  protected _title: HTMLElement; 
	protected _price: HTMLElement; 
	protected _button: HTMLButtonElement; 
  protected _index: HTMLElement;

  constructor(template:HTMLTemplateElement, events:IEvents){
    super(template, events)
    this.events = events;
    this.element = cloneTemplate(template);

    this._title = this.element.querySelector('.card__title');
    this._price = this.element.querySelector('.card__price');
    this._button = this.element.querySelector('.basket__item-delete');
    this._index = this.element.querySelector('.basket__item-index');

    this._button.addEventListener('click', ()=>{
      this.events.emit('card:remove', {card:this});
      console.log('card:remove', {card:this});
    });
  }

  render(cardData:ICard){
    const {id, title, price, index, ...otherCardData} = cardData;
    if (id) this.id = id;
    if (title) this.title = title;
    if (price) this.price = price;
    if (index) this.index = index;
    Object.assign(this, otherCardData);
    return this.element;
  }

  set id(cardId:string){
    this._id = cardId;
  }

  set title(cardTitle: string){
    this.setText(this._title, cardTitle.toString());
  }

  set price(cardPrice:number|null){
    cardPrice === null ? this.setText(this._price, "Бесценно") : this.setText(this._price, cardPrice.toString());
  }

  set index(cardIndex:number){
    this.setText(this._index, cardIndex.toString());
  }

  deleteCard(){
    this.element.remove();
    this.element = null;
  }
}

//класс для карточки в главном списке
export class CardCatalogueView extends CardView{
  protected element: HTMLElement;
  protected events: IEvents;
  protected _id: string;
  protected _title: HTMLElement; 
	protected _price: HTMLElement; 
	protected _button: HTMLButtonElement; 
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  /*<template id="card-catalog">
  <button class="gallery__item card">
    <span class="card__category card__category_soft">софт-скил</span>
    <h2 class="card__title">+1 час в сутках</h2>
    <img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt="" />
    <span class="card__price">750 синапсов</span>
  </button>
</template>*/

  constructor(template:HTMLTemplateElement, events:IEvents){
    super(template, events)
    this.events = events;
    this.element = cloneTemplate(template);

    this._title = this.element.querySelector('.card__title');
    this._price = this.element.querySelector('.card__price');
    this._button = this.element.querySelector('.card');
    this._image = this.element.querySelector('.card__image');
    this._category = this.element.querySelector('.card__category');
    //кнопка не находится, завтра попробовать вернуть наследный контейнер и работать через него
    console.log(this._button);
  }

  render(cardData:ICard){
    const {id, title, price, image, category, ...otherCardData} = cardData;
    if (id) this.id = id;
    if (title) this.title = title;
    if (price) this.price = price;
    if (image) this.image = image;
    if (category) this.category = category;
    Object.assign(this, otherCardData);
    console.log(this.element);
    return this.element;
  }

  set id(cardId:string){
    this._id = cardId;
  }

  set title(cardTitle: string){
    this.setText(this._title, cardTitle.toString());
  }

  set price(cardPrice:number|null){
    cardPrice === null ? this.setText(this._price, "Бесценно") : this.setText(this._price, cardPrice.toString());
  }

  set image(cardImage:string){
    this.setImage(this._image, `${CDN_URL}` + `${cardImage}`, this.title);
  }

  set category(cardCategory:string){
    this.setText(this._category, cardCategory);
  }
  deleteCard(){
    this.element.remove();
    this.element = null;
  }
}