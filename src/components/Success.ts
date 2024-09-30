import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Component } from "./Component";

interface ISuccess{
  total:number;
}

export class Success extends Component<ISuccess>{
  protected _totalPrice:HTMLElement;
  protected _button:HTMLButtonElement;

  constructor(container:HTMLElement, events:IEvents){
    super(container);
    this._totalPrice = ensureElement<HTMLElement>('.order-success__description', container)
    this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this._button.addEventListener('click', ()=>{
      events.emit('success:close');
    })
  }

  set total(total:number){
    this.setText(this._totalPrice, `Списано ${total} синапсов`);
  }
}
/*
		<div class="order-success">
			<h2 class="order-success__title">Заказ оформлен</h2>
			<p class="order-success__description">Списано 0 синапсов</p>
			<button class="button order-success__close">За новыми покупками!</button>
		</div>
*/ 