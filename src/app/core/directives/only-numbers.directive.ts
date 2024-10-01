import {Directive, ElementRef, HostListener, forwardRef, Renderer2, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
  selector: 'input[numbersOnly]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberDirective),
    multi: true,
  }],
  standalone: true
})
export class NumberDirective implements ControlValueAccessor {
  private onChange!: (val: string) => void;
  private onTouched!: () => void;
  private value!: string;

  @Input() rangeValidator: string | null = null; // Rango opcional

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string): void {
    const valorFiltrado: string = this.rangeValidator ? filtrarValorConRango(value, this.rangeValidator) : filtrarValorNumerico(value);
    this.actualizarTextInput(valorFiltrado, this.value !== valorFiltrado);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private actualizarTextInput(nuevoValor: string, propagarCambio: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', nuevoValor);
    if (propagarCambio) {
      this.onChange(nuevoValor);
    }
    this.value = nuevoValor;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  writeValue(valor: any): void {
    valor = valor ? String(valor) : '';
    this.actualizarTextInput(valor, false);
  }
}

function filtrarValorNumerico(valor: string): string {
  // Filtra solo números
  return valor.replace(/\D*/g, '');
}

function filtrarValorConRango(valor: string, rango: string): string {
  const [min, max] = rango.split('-').map(Number);
  const parsedValue = parseInt(valor, 10);

  if (!isNaN(parsedValue) && parsedValue >= min && parsedValue <= max) {
    return valor;
  }
  return '';
}
