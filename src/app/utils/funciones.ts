import {TipoDropdown} from "../core/models/tipo-dropdown.interface";

export function mapearArregloTipoDropdown(arr: [] = [], label: string = '', value: string = ''): TipoDropdown[] {
  return arr.map(obj => ({
    label: obj[label],
    value: obj[value]
  }));
}

export function calcularDiferenciaFechas(fechaInicial: string, fechaFinal: string): string {
  const inicio = new Date(fechaInicial);
  const fin = new Date(fechaFinal);

  let years = fin.getFullYear() - inicio.getFullYear();
  let meses = fin.getMonth() - inicio.getMonth();
  let dias = fin.getDate() - inicio.getDate();

  if (meses < 0) {
    years--;
    meses += 12;
  }

  if (dias < 0) {
    meses--;
    const ultimoDiaMesAnterior = new Date(fin.getFullYear(), fin.getMonth(), 0).getDate();
    dias += ultimoDiaMesAnterior;
  }

  const resultado = [];
  if (years > 0) resultado.push(`${years} año${years > 1 ? 's' : ''}`);
  if (meses > 0) resultado.push(`${meses} mes${meses > 1 ? 'es' : ''}`);
  if (dias > 0) resultado.push(`${dias} día${dias > 1 ? 's' : ''}`);

  return resultado.length > 0 ? resultado.join(', ') : 'Sin diferencia';
}
