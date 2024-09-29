import { IEvents } from "./base/events";
import { Form } from "./Form";
import { ensureAllElements } from "../utils/utils";

interface IPaymentForm {
  address: string
  payment: string
}

export class PaymentForm extends Form<IPaymentForm> {
  protected _paymentButtons:HTMLButtonElement[];

  constructor(container:HTMLFormElement, events:IEvents){
    super(container, events);

    this._paymentButtons = ensureAllElements<HTMLButtonElement>('button_alt', container);

    this._paymentButtons.forEach((item) => {
      item.addEventListener('click', ()=>{
        this._paymentButtons.forEach((button)=>{
          this.toggleClass(button, 'button_alt-active', false);
        })

        this.toggleClass(item, 'button_alt-active', true);
        events.emit(`${this.formName}:paymentChange`, {
          field:'payment',
          value:item.name
        })
      })
    });
  }
}