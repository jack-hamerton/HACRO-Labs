import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, User, Mail, CreditCard, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const KENYA_REGIONS = [
  'Nairobi', 'Kisumu', 'Mombasa', 'Nakuru', 'Eldoret', 
  'Kericho', 'Kisii', 'Nyeri', 'Muranga', 'Machakos', 
  'Naivasha', 'Isiolo', 'Garissa', 'Wajir', 'Turkana'
];

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollTimerRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    age: '',
    spouse_kin_name: '',
    category: 'Individual',
    location: 'Nairobi',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    amount: 300,
  });

  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [mpesaPhone, setMpesaPhone] = useState('');

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        toast.error('Only JPG, PNG, and GIF files are allowed');
        return;
      }
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const validateStep1 = () => {
    if (!formData.first_name || !formData.last_name || !formData.age || !formData.category || !formData.location) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (formData.age < 18) {
      toast.error('You must be at least 18 years old to register');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email || !formData.phone || !formData.password || !formData.passwordConfirm) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      if (!mpesaPhone && formData.phone) {
        setMpesaPhone(formData.phone);
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (!polling) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const formatPhoneNumber = (phone) => {
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.slice(1);
    } else if (formatted.startsWith('7') || formatted.startsWith('1')) {
      formatted = '254' + formatted;
    }
    return formatted;
  };

  const startPolling = (checkoutRequestId, memberFormData) => {
    let attempts = 0;
    const maxAttempts = 40;

    const poll = async () => {
      try {
        const res = await apiServerClient.fetch(`/mpesa/check-payment/${checkoutRequestId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.resultCode === "0") {
            try {
              const member = await pb.collection('members').create(memberFormData, { $autoCancel: false });
              
              const paymentData = {
                member_id: member.id,
                amount: formData.amount,
                payment_date: new Date().toISOString(),
                mpesa_reference: checkoutRequestId,
                checkout_request_id: checkoutRequestId,
                payment_status: 'completed',
              };

              const payment = await pb.collection('payments').create(paymentData, { $autoCancel: false });

              setPolling(false);
              toast.success('Payment confirmed! Registration complete.');
              navigate('/registration-confirmation', { state: { member, payment } });
              return;
            } catch (creationError) {
              console.error("Account creation error:", creationError);
              toast.error("Payment succeeded, but account creation failed.");
              setPolling(false);
              return;
            }
          } else if (data.resultCode && data.resultCode !== "0") {
            setPolling(false);
            toast.error(data.resultDesc || 'Payment failed or was cancelled.');
            return;
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }

      attempts++;
      if (attempts >= maxAttempts) {
        setPolling(false);
        toast.error('Payment verification timeout. Please try again.');
      } else {
        pollTimerRef.current = setTimeout(poll, 3000);
      }
    };

    pollTimerRef.current = setTimeout(poll, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mpesaPhone) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    const formattedPhone = formatPhoneNumber(mpesaPhone);
    if (!/^254\d{9}$/.test(formattedPhone)) {
      toast.error('Invalid phone number format.');
      return;
    }

    setLoading(true);
    setPolling(true);

    try {
      const payload = {
        phoneNumber: formattedPhone,
        amount: formData.amount,
        email: formData.email,
        firstName: formData.first_name,
        lastName: formData.last_name,
      };

      const response = await apiServerClient.fetch('/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to initiate M-Pesa payment');
      }

      const data = await response.json();
      
      const memberFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'amount') memberFormData.append(key, formData[key]);
      });
      if (profilePic) {
        memberFormData.append('profile_picture', profilePic);
      }

      startPolling(data.checkoutRequestId, memberFormData);
      toast.success('M-Pesa prompt sent to your phone');

    } catch (error) {
      console.error('STK Push error:', error);
      toast.error(error.message || 'Payment initiation failed.');
      setPolling(false);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Contact', icon: Mail },
    { number: 3, title: 'Payment', icon: CreditCard },
  ];

  return (
    <>
      <Helmet>
        <title>Register - Hacro Labs</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Member registration</h1>
            <p className="text-muted-foreground">Complete the steps below to join Hacro Labs</p>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${currentStep >= step.number ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground'}`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-2 font-medium text-foreground">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-all duration-200 ${currentStep > step.number ? 'bg-primary' : 'bg-border'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-section">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Personal information</h2>

                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden mb-2">
                    {profilePicPreview ? (
                      <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                    <input type="file" accept="image/jpeg, image/png, image/gif" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <p className="text-xs text-muted-foreground">Upload Profile Picture (Max 5MB)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">First name <span className="text-destructive">*</span></label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="form-input" required />
                  </div>
                  <div>
                    <label className="form-label">Middle name</label>
                    <input type="text" name="middle_name" value={formData.middle_name} onChange={handleInputChange} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Last name <span className="text-destructive">*</span></label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="form-input" required />
                  </div>
                  <div>
                    <label className="form-label">Age <span className="text-destructive">*</span></label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="form-input" min="18" required />
                  </div>
                  <div>
                    <label className="form-label">Location / Region <span className="text-destructive">*</span></label>
                    <select name="location" value={formData.location} onChange={handleInputChange} className="form-input" required>
                      {KENYA_REGIONS.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Category <span className="text-destructive">*</span></label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="form-input" required>
                      <option value="Individual">Individual</option>
                      <option value="Family">Family</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Spouse / Next of kin name</label>
                    <input type="text" name="spouse_kin_name" value={formData.spouse_kin_name} onChange={handleInputChange} className="form-input" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Contact information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="form-label">Email address <span className="text-destructive">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" required />
                  </div>
                  <div>
                    <label className="form-label">Phone number <span className="text-destructive">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="0700123456" required />
                  </div>
                  <div>
                    <label className="form-label">Password <span className="text-destructive">*</span></label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-input" minLength="8" required />
                  </div>
                  <div>
                    <label className="form-label">Confirm password <span className="text-destructive">*</span></label>
                    <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleInputChange} className="form-input" required />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 relative">
                {polling && (
                  <div className="absolute inset-0 bg-card/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl p-6">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-lg font-medium text-foreground text-center">Waiting for M-Pesa payment prompt...</p>
                  </div>
                )}
                <h2 className="text-xl font-semibold text-foreground mb-6">Secure M-Pesa Payment</h2>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-foreground mb-4">Registration fee</h3>
                  <p className="text-3xl font-bold text-primary mb-2">{formData.amount.toLocaleString()} KSH</p>
                </div>
                <div className="bg-muted rounded-lg p-6 space-y-4">
                  <div>
                    <label className="form-label">M-Pesa Phone Number <span className="text-destructive">*</span></label>
                    <input type="tel" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} className="form-input" placeholder="e.g., 0712345678" required disabled={polling} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {currentStep > 1 && (
                <button type="button" onClick={handleBack} disabled={polling} className="btn-secondary flex items-center space-x-2 disabled:opacity-50">
                  <ChevronLeft className="w-5 h-5" /><span>Back</span>
                </button>
              )}
              {currentStep < 3 ? (
                <button type="button" onClick={handleNext} className="btn-primary flex items-center space-x-2 ml-auto">
                  <span>Next</span><ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={polling} className="btn-primary flex items-center justify-center space-x-2 ml-auto min-w-[200px]">
                  {polling ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Processing...</span></> : <span>Pay {formData.amount} KSH</span>}
                </button>
              )}
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default RegistrationPage;
