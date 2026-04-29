import React from 'react';
import { X, CheckCircle, Download } from 'lucide-react';
import { format } from 'date-fns';

const RegistrationConfirmationModal = ({ member, onClose }) => {
  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Registration Confirmation</h2>
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
            <h3 className="text-xl font-semibold text-foreground mb-2">Registration Successful!</h3>
            <p className="text-muted-foreground">Welcome to Hacro Labs</p>
          </div>

          <div className="bg-muted rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Member ID</p>
              <p className="text-2xl font-bold text-primary">{member.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium text-foreground">
                  {member.first_name} {member.middle_name} {member.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-medium text-foreground">{member.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium text-foreground">{member.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-medium text-foreground">{member.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                <p className="font-medium text-foreground">
                  {format(new Date(member.registration_date), 'PPP')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Important:</strong> Please save your Member ID for future reference. You can now log in to your
              member dashboard using your email and password.
            </p>
          </div>

          <div className="flex gap-4">
            <button onClick={handlePrint} className="flex-1 btn-outline flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Print Confirmation</span>
            </button>
            <button onClick={onClose} className="flex-1 btn-primary">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmationModal;
