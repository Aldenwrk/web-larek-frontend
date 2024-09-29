import { IEvents } from "./base/events";
import { Form } from "./Form";

interface IContactForm {
  phone: string
  email: string
}


export class ContactForm extends Form<IContactForm>{
  constructor(container:HTMLFormElement, events:IEvents){
    super(container, events);
  }
}