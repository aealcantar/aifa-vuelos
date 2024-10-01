export const environment = {
  production: true,
  api: {
    autenticacion: 'usuarios/api/auth/',
    notificaciones: 'notificaciones/api/mail/',
    notificaciones_usuario: 'notificaciones/api/notificaciones/',
    password: 'notificaciones/api/passwd/',
    identidad: 'notificaciones/api/mail/identidad',
    validacion: 'notificaciones/api/mail/resetpwd',
    verificar: 'notificaciones/api/passwd/verifica-codigo',
    aviso: 'usuarios/api/usuarios/aceptar-aviso-privacidad',
    usuarios: 'usuarios/api/usuarios/',
    empresa: 'usuarios/api/empresa/',
    catalogos: 'catalogos/api/catalogos/',
    expedientes: 'expedientes/api/contratos-acuerdos/',
    complementarios: 'expedientes/api/contratos-acuerdos/proveedores-contratos/',
    deplegarformato: 'expedientes/api/contratos-acuerdos/generate-pdf/',
    eliminarformato:'expedientes/api/contratos-acuerdos/elimina-pdf/',
    actualizarestatus: 'expedientes/api/contratos-acuerdos/update-status',
    codigonuevo: 'notificaciones/api/mail/codigo-nuevo',
    generarnuevocodigo : 'notificaciones/api/mail/nuevo',
    solicitudcrearcuenta: 'publico/crear-cuenta'
  }
};
