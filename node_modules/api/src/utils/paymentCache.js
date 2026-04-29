/**
 * In-memory cache for payment tracking
 * Maps checkoutRequestId to payment metadata
 */
const paymentCache = new Map();

/**
 * Store payment request in cache
 * @param {string} checkoutRequestId - Checkout request ID
 * @param {Object} metadata - Payment metadata (email, phoneNumber, amount, etc.)
 * @param {number} ttlMs - Time to live in milliseconds (default: 24 hours)
 */
export function cachePayment(checkoutRequestId, metadata, ttlMs = 24 * 60 * 60 * 1000) {
  paymentCache.set(checkoutRequestId, {
    ...metadata,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Retrieve payment from cache
 * @param {string} checkoutRequestId - Checkout request ID
 * @returns {Object|null} Payment metadata or null if not found/expired
 */
export function getPayment(checkoutRequestId) {
  const payment = paymentCache.get(checkoutRequestId);

  if (!payment) {
    return null;
  }

  // Check if expired
  if (Date.now() > payment.expiresAt) {
    paymentCache.delete(checkoutRequestId);
    return null;
  }

  return payment;
}

/**
 * Remove payment from cache
 * @param {string} checkoutRequestId - Checkout request ID
 */
export function removePayment(checkoutRequestId) {
  paymentCache.delete(checkoutRequestId);
}

/**
 * Clear all expired payments from cache
 */
export function clearExpiredPayments() {
  const now = Date.now();
  for (const [key, value] of paymentCache.entries()) {
    if (now > value.expiresAt) {
      paymentCache.delete(key);
    }
  }
}

// Cleanup expired payments every hour
setInterval(clearExpiredPayments, 60 * 60 * 1000);

export default {
  cachePayment,
  getPayment,
  removePayment,
  clearExpiredPayments,
};
