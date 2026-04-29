import React from 'react';
import { X, Download, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';

const PaymentAcknowledgmentModal = ({ payment, member, onClose }) => {
  if (!payment || !member) return null;

  const handleDownload = () => {
    // If there's an acknowledgment file attached from admin, download it
    if (payment.acknowledgment_file) {
      const fileUrl = pb.files.getUrl(payment, payment.acknowledgment_file);
      window.open(fileUrl, '_blank');
    } else {
      // Fallback: Trigger browser print behavior to act as PDF download
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:static print:bg-transparent print:p-0">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl print:shadow-none print:max-h-none print:w-full">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center print:hidden">
          <h2 className="text-2xl font-bold text-foreground">Payment Acknowledgment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-success" />
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">Payment Received</h3>
            <p className="text-muted-foreground">Thank you for your payment</p>
          </div>

          <div className="bg-muted rounded-lg p-6 space-y-4 print:bg-transparent print:border print:border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member Name</p>
                <p className="font-medium text-foreground">
                  {member.first_name} {member.middle_name} {member.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member ID</p>
                <p className="font-medium text-foreground">{member.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                <p className="font-medium text-foreground">KES {payment.amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                <p className="font-medium text-foreground">{payment.payment_date ? format(new Date(payment.payment_date), 'PPP') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">M-Pesa Reference</p>
                <p className="font-medium text-foreground uppercase">{payment.mpesa_reference || payment.checkout_request_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <span
                  className={
                    payment.payment_status === 'completed'
                      ? 'badge-completed'
                      : payment.payment_status === 'pending'
                      ? 'badge-pending'
                      : 'badge-failed'
                  }
                >
                  {payment.payment_status}
                </span>
              </div>
            </div>
          </div>

          <div className="print:hidden flex gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>
            <button onClick={onClose} className="flex-1 btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAcknowledgmentModal;
