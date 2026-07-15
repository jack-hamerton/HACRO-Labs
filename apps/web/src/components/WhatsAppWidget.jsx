import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const phoneNumber = '254757838028'; 

  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <>
      {                          }
      <div className="fixed bottom-6 right-6 z-40">
        {isOpen && (
          <div className="mb-4 bg-white rounded-2xl shadow-lg p-4 w-72 border border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">HACRO Hub</p>
                  <p className="text-xs text-green-600">Usually replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700">
                Hi there! 👋 How can we help you today? Feel free to reach out with any questions.
              </p>
            </div>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        )}

        {                      }
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2 animate-bounce flex items-center justify-center"
          aria-label="Open WhatsApp chat"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {                           }
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default WhatsAppWidget;
