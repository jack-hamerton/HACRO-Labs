import { useState } from 'react';
import pb from '@/lib/pocketbaseClient';

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPayment = async (paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const payment = await pb.collection('payments').create(paymentData, { $autoCancel: false });
      return payment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMemberPayments = async (memberId) => {
    setLoading(true);
    setError(null);
    try {
      const payments = await pb.collection('payments').getFullList({
        filter: `member_id = "${memberId}"`,
        sort: '-created',
        $autoCancel: false,
      });
      return payments;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const payments = await pb.collection('payments').getFullList({
        sort: '-created',
        expand: 'member_id',
        $autoCancel: false,
      });
      return payments;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId, status) => {
    setLoading(true);
    setError(null);
    try {
      const payment = await pb.collection('payments').update(
        paymentId,
        { payment_status: status },
        { $autoCancel: false }
      );
      return payment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAcknowledgment = async (paymentId, file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('acknowledgment_file', file);
      const payment = await pb.collection('payments').update(paymentId, formData, { $autoCancel: false });
      return payment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPayment,
    getMemberPayments,
    getAllPayments,
    updatePaymentStatus,
    uploadAcknowledgment,
  };
};
