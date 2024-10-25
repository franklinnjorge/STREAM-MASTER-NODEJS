import {expect, describe, test, jest} from "@jest/globals";
import Payment from "../src/events/payment";
import Shipment from "../src/observers/shipment";
import Marketing from "../src/observers/marketing";
import PaymentSubject from "../src/subjects/paymentSubject";

describe('index', () => {
  test('#paymentsubject notify observers', () => {
    const subject = new PaymentSubject()

    const observer = {
      update: jest.fn()
    }

   const data = 'hello world'
   const expected = data

   subject.subscribe(observer)
   subject.notify(data)

   expect(observer.update).toHaveBeenCalledWith(expected)
  })
  test('#paymentsubject should not notify unsubscribed observers', () => {
    const subject = new PaymentSubject()

    const observer = {
      update: jest.fn()
    }

   const data = 'hello world'
   subject.subscribe(observer)
   subject.unsubscribe(observer)
   subject.notify(data)

   expect(observer.update).not.toHaveBeenCalled()
  })
  test('#paymentsubject should notify subject after a credit card transaction', () => {
    const subject = new PaymentSubject()
    const payment = new Payment(subject)

    const paymentSubjectNotifierSpy = jest.spyOn(
      subject,
      subject.notify.name
    )

    const data = { userName: 'Franklin', id: 3, age: 27}
    payment.creditCard(data)

    expect(paymentSubjectNotifierSpy).toBeCalledWith(data)


  })
  test('#all should notify subscribers after a credit card payment', () => {
    const subject = new PaymentSubject()
    const shipment = new Shipment()
    const marketing = new Marketing()

    const shipmentUpdateFnSpy = jest.spyOn(shipment, shipment.update.name)
    const marketingUpdateFnSpy = jest.spyOn(marketing, marketing.update.name)


    subject.subscribe(shipment)
    subject.subscribe(marketing)
    
    const payment = new Payment(subject)
    const data = {id: 4, userName: 'Franklin'}
    payment.creditCard(data)
  
    expect(shipmentUpdateFnSpy).toHaveBeenCalledWith(data)
    expect(marketingUpdateFnSpy).toHaveBeenCalledWith(data)
  })
});