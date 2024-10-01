export interface JwtPayload {
  iss: string,
  iat: number,
  exp: number,
  nbf: number,
  jti: string,
  sub: number,
  prv: string,
  curp: string,
  idRol: number,
  nombre: string,
  rol: string;
  indPrivacidad: boolean;
}


