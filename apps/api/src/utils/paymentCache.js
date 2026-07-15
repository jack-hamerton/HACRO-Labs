 

                                       

                                             

 
const paymentCache = new Map();

 

                                 

                                                          

                                                                                 

                                                                           

 
export function cachePayment(checkoutRequestId, metadata, ttlMs = 24 * 60 * 60 * 1000) {
  paymentCache.set(checkoutRequestId, {
    ...metadata,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttlMs,
  });
}

 

                              

                                                          

                                                                       

 
export function getPayment(checkoutRequestId) {
  const payment = paymentCache.get(checkoutRequestId);

  if (!payment) {
    return null;
  }

  

  if (Date.now() > payment.expiresAt) {
    paymentCache.delete(checkoutRequestId);
    return null;
  }

  return payment;
}

 

                            

                                                          

 
export function removePayment(checkoutRequestId) {
  paymentCache.delete(checkoutRequestId);
}

 

                                        

 
export function clearExpiredPayments() {
  const now = Date.now();
  for (const [key, value] of paymentCache.entries()) {
    if (now > value.expiresAt) {
      paymentCache.delete(key);
    }
  }
}



setInterval(clearExpiredPayments, 60 * 60 * 1000);

export default {
  cachePayment,
  getPayment,
  removePayment,
  clearExpiredPayments,
};
