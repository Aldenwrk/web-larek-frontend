import { IOrderData } from "../types";
import { IEvents } from "./base/events";
import { IFormErrors } from "../types";

export class OrderData implements IOrderData{
  protected _payment: string ="";
  protected _address: string ="";
  protected _email: string ="";
  protected _phone: string ="";
  protected events: IEvents;
  formErrors:IFormErrors = {};

  constructor(events: IEvents){
    this.events = events;
  }

  getData(){
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    }
  }

  setPaymentField(field: keyof IOrderData, value: string) {
    this[field] = value
    this.validatePaymentForm()
}

  set payment(inputPayment:string){
    this._payment = inputPayment;
  }
  set address(inputAddress:string){
    this._address = inputAddress;
  }
  set email(inputEmail:string){
    this._email = inputEmail;
  }
  set phone(inputPhone:string){
    this._phone = inputPhone;
  }

  validatePaymentForm(){
    const errors: typeof this.formErrors = {};

    if(!this.payment){
     errors.payment = "Выберите тип оплаты" 
    }

    if(!this.address){
      errors.address = "Заполните поле адреса"
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContactForm(){
    if(!this.phone){
      const error = "Заполните поле телефона"
      return error;
    }

    if(!this.email){
      const error = "Заполните поле email"
      return error;
    }
  }
}