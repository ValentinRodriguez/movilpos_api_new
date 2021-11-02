import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
})
export class InputTextComponent implements OnInit,ControlValueAccessor {

  value: string;
  isDisabled: boolean;
  onChange = (_:any) => { }
  onTouch = () => { }

  constructor() { }

  ngOnInit(): void {
    
  }

  onInput(value: string) {
    // this.counter = value.length;
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
    console.log(value);
    
  }

  writeValue(value: any): void { 
    this.value = value ? value : '';
    console.log(this.value);    
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

}
