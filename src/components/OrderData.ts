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
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone
    }
  }

  setPaymentFields(field: keyof IOrderData, value: string) {
    this[field] = value
    this.validatePaymentForm()
}

setContactFields(field: keyof IOrderData, value: string) {
  this[field] = value
  this.validateContactForm()
}

  set payment(inputPayment:string){
    this._payment = inputPayment;
  }
  get payment(){
    return this._payment
  }
  set address(inputAddress:string){
    this._address = inputAddress;
  }
  get address(){
    return this._address
  }
  set email(inputEmail:string){
    this._email = inputEmail;
  }
  get email(){
    return this._email
  }
  set phone(inputPhone:string){
    this._phone = inputPhone;
  }
  get phone(){
    return this._phone
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
    this.events.emit('formErrorsPayment:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContactForm(){
    const errors: typeof this.formErrors = {};

    if(!this.phone){
     errors.phone = "Заполните поле телефона" 
    }

    if(!this.email){
      errors.email = "Заполните поле email"
    }
    this.formErrors = errors;
    this.events.emit('formErrorsContact:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  resetOrder() {
    this.payment = ''
    this.address = ''
    this.email = ''
    this.phone = ''
}
}