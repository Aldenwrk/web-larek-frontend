import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Component } from "./Component";
import { IFormErrors } from "../types";

interface IForm extends IFormErrors{
  valid:boolean;
  errors:string[];
}

export abstract class Form<T> extends Component<IForm>{
  protected _submitButton:HTMLButtonElement;
  protected _formErrorContainer: HTMLSpanElement;
  protected events: IEvents;
  protected formName: string;
  protected _handleSubmit: Function;

  constructor(container:HTMLFormElement, events:IEvents){
    super(container);
    this.events = events;
    this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    this._formErrorContainer = ensureElement<HTMLSpanElement>('.form__errors', container);
    this.formName = this.container.getAttribute('name');

    this.container.addEventListener('submit', (evt:Event)=>{
      evt.preventDefault();
      this.events.emit(`${this.formName}:submit`);
    });

    this.container.addEventListener('input', (evt:InputEvent)=>{
      const target = evt.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`${this.formName}:input`, {field, value});
    })
  }

  set valid(isValid:boolean){
    this.setDisabled(this._submitButton, !isValid);
  }

  get form(){
    return this.container;
  }

  set errors(errorMessages:string[]){
    this.setText(this._formErrorContainer, errorMessages);
  }

  protected onInput(field: keyof T, value: string){
    this.events.emit(`${this.formName}.${String(field)}:change`, {
      field,
      value
    });
  }

  render(data:IForm){
    const {valid, errors} = data;
    super.render({valid, errors});
    return this.container;
  }

}