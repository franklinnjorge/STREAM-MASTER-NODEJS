export default class Shipment {
  update({id, userName}) {
    console.log(`id: ${id}: [shipment] will package the order for ${userName}`);
  }
}