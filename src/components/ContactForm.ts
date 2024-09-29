import { IEvents } from "./base/events";
import { Form } from "./Form";


export class ContactForm extends Form{
  constructor(container:HTMLFormElement, events:IEvents){
    super(container, events);
  }
}