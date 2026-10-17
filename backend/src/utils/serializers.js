// UTILIDAD
// Convierte los datos de la base antes de enviarlos (por ejemplo, los precios pasan de texto a número).

const aNumero = (valor) => (valor === null || valor === undefined ? valor : Number(valor));

const serializarGabinete = (gabinete) =>
  gabinete && { ...gabinete, costoUnitario: aNumero(gabinete.costoUnitario) };

const serializarMaterial = (material) =>
  material && { ...material, costoUnitario: aNumero(material.costoUnitario) };

export { aNumero, serializarGabinete, serializarMaterial };
