import { IEvents } from "./base/events";
import { Component } from "./Component";

interface IPage {
  basketCounter: HTMLElement;
  basketButton: HTMLElement;
  gallery:HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage>{
  protected _basketCounter: HTMLElement;
  protected _gallery:HTMLElement;
  protected _basketButton: HTMLElement;
  protected _wrapper:HTMLElement;
  events:IEvents;

  constructor(container:HTMLElement, events:IEvents){
    super(container)
    this.events = events;
    this._basketButton = container.querySelector('.header__basket');
    this._basketCounter = container.querySelector('.header__basket-counter');
    this._gallery = container.querySelector('.gallery');
    this._wrapper = container.querySelector('.page__wrapper');
    this._basketButton.addEventListener('click', ()=>{
      this.events.emit('basket:open', {card:this});
      console.log('basket:open', {card:this});
    });
  }

  set basketCounter(count:number){
    this.setText(this._basketCounter, count);
  }

  set gallery(items:HTMLElement[]){
    this._gallery.replaceChildren(...items);
  }

  set locked(lock:boolean){
    //решить как блочить
  }
}