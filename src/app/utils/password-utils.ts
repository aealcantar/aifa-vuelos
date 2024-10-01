export function cambiarVisibilidadPassword(input: HTMLInputElement, event: MouseEvent): void {
  const imgElement = event.target as HTMLImageElement;
  if (input.type === 'password') {
    input.type = 'text';
    imgElement.src = 'assets/images/icons/eye-closed.svg';
  } else {
    input.type = 'password';
    imgElement.src = 'assets/images/icons/eye-open.svg';
  }
}
