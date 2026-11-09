exports.createPayment = (paymentDetails) => {
  return new Promise((resolve, reject) => {
    // Simulate payment processing delay
    setTimeout(() => {
      // Simulate a successful payment response
      resolve({ success: true, paymentId: 'mock-payment-id' });
    }, 1000);
  });
};