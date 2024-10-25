export default class Payment {
  constructor(paymentSubject) {
    this.paymentSubject = paymentSubject
  }

  creditCard({id, userName, age}) {
    console.log(`Payment ocurred from ${userName}`);
    this.paymentSubject.notify({id, userName, age});
  }


}