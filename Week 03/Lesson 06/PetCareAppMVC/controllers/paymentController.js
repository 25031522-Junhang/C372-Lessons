const services = require('../data/mockServices');
const mockPaymentProvider = require('../services/mockPaymentProvider');

function preparePayment(req, res) {
  //
async function createMockPayment(req, res) {
    const serviceId = Number(req.params.serviceId);
    const service = services.find(item => item.id === serviceId);
  
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
   }
 
   const paymentRequest = {
     amount: service.price,
     currency: 'sgd',
     merchantReference: 'SERVICE-' + service.id,
     description: service.name,
     testStatus: req.body?.testStatus
   };
 
   // call mock provider
  const providerResult = await mockPaymentProvider.createPayment(paymentRequest);
  
  const bookingStatusByPayment = {
    APPROVED: 'CONFIRMED',
    PENDING: 'AWAITING_PAYMENT',
    DECLINED: 'PAYMENT_FAILED'
  };
  
  return res.json({
   serviceId: service.id,
   providerPaymentId: providerResult.providerPaymentId,
   merchantReference: providerResult.merchantReference,
   paymentStatus: providerResult.status,
   bookingStatus: bookingStatusByPayment[providerResult.status]
 });
}



  const service = services.find(
    (item) => String(item.id) === req.params.serviceId
  );

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.status(200).json({
    serviceId: service.id,
    serviceName: service.name,
    amount: service.price,
    currency: 'sgd',
    status: 'READY_FOR_PAYMENT'
  });
}

module.exports = { preparePayment };
