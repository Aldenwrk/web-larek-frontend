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

  constructor(container:HTMLElement, events:IEvents){
    super(container);
    this.events = events;
    this.element = container;

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

  constructor(container:HTMLTemplateElement, events:IEvents){
    super(container, events);
    this.events = events;
    this.element = container;

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

  get id(){
    return this._id;
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

  constructor(container:HTMLElement, events:IEvents){
    super(container, events)
    this.element = container;
    this.events = events;

    this._title = this.element.querySelector('.card__title');
    this._price = this.element.querySelector('.card__price');
    this._button = this.element.querySelector('.card');
    this._image = this.element.querySelector('.card__image');
    this._category = this.element.querySelector('.card__category');

    container.addEventListener('click', ()=>{
      this.events.emit('card:select', {card:this});
      console.log('card:select', {card:this});
    });
   // console.log(container);
    
  }

  render(cardData:ICard){
    const {id, title, price, image, category, ...otherCardData} = cardData;
    if (id) this.id = id;
    if (title) this.title = title;
    if(price){
      this.price = price;
    } else {
      this.price = null;
    }

    if (image) this.image = image;
    if (category) this.category = category;
    Object.assign(this, otherCardData);
    //console.log(this.element);
    return this.element;
  }

  set id(cardId:string){
    this._id = cardId;
  }

  get id(){
    return this._id;
  }

  set title(cardTitle: string){
    this.setText(this._title, cardTitle.toString());
  }

  set price(cardPrice:number|null){
    cardPrice === null ? this.setText(this._price, "Бесценно") : this.setText(this._price, `${cardPrice.toString()} синапсов`);
  }

  set image(cardImage:string){
    this.setImage(this._image, `${CDN_URL}` + `${cardImage}`, this.title);
  }

  set category(cardCategory:string){
    const categoryBaseclass = 'card__category';
    this._category.className = categoryBaseclass;
    this.setText(this._category, cardCategory);
    const categories: {[key:string]:string} = {
      "софт-скил":"soft",
      "хард-скил":"hard",
      "другое":"other",
      "дополнительное":"additional",
      "кнопка":"button"
    };
    this.toggleClass(this._category, `card__category_${categories[cardCategory]}`, true)
  }

  deleteCard(){
    this.element.remove();
    this.element = null;
  }
}

export class CardPreview extends CardCatalogueView{
  protected element: HTMLElement;
  protected events: IEvents;
  protected _id: string;
  protected _title: HTMLElement; 
	protected _price: HTMLElement; 
	protected _button: HTMLButtonElement; 
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;

  constructor(container:HTMLElement, events:IEvents){
    super(container, events)
    this.element = container;
    this.events = events;

    this._title = this.element.querySelector('.card__title');
    this._price = this.element.querySelector('.card__price');
    this._button = this.element.querySelector('.card__button');
    this._image = this.element.querySelector('.card__image');
    this._category = this.element.querySelector('.card__category');
    this._description = this.element.querySelector('.card__text');
    console.log(this._button)
    
    this._button.addEventListener('click', ()=>{
      this.events.emit('card:add', {card:this});
      console.log('card:add', {card:this});
    });
    this._button.addEventListener('click', (event) => event.stopPropagation());   
  }

  render(cardData:ICard){
    const {id, title, price, image, category, ...otherCardData} = cardData;
    if (id) this.id = id;
    if (title) this.title = title;
    if(price){
      this.price = price;
    } else {
      this.price = null;
    }
    if (image) this.image = image;
    if (category) this.category = category;
    Object.assign(this, otherCardData);
    this.events.emit('preview:ready', {card:this});
    //console.log('preview:ready', {card:this})
    return this.element;
  }

  set id(cardId:string){
    this._id = cardId;
  }

  get id(){
    return this._id;
  }

  set title(cardTitle: string){
    this.setText(this._title, cardTitle.toString());
  }

  set price(cardPrice:number|null){
    cardPrice === null ? this.setText(this._price, "Бесценно") : this.setText(this._price, `${cardPrice.toString()} синапсов`);
  }

  set image(cardImage:string){
    this.setImage(this._image, `${CDN_URL}` + `${cardImage}`, this.title);
  }

  set category(cardCategory:string){
    const categoryBaseclass = 'card__category';
    this._category.className = categoryBaseclass;
    this.setText(this._category, cardCategory);
    const categories: {[key:string]:string} = {
      "софт-скил":"soft",
      "хард-скил":"hard",
      "другое":"other",
      "дополнительное":"additional",
      "кнопка":"button"
    };
    this.toggleClass(this._category, `card__category_${categories[cardCategory]}`, true)
  }

  set description(cardDescription:string){
    this.setText(this._description, cardDescription);
  }

  blockButton(){
    this.setDisabled(this._button, true);
  }

  unblockButton(){
    this.setDisabled(this._button, false);
  }

  deleteCard(){
    this.element.remove();
    this.element = null;
  }
}