import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ContactFormContent } from '../../components/FooterComponents/ContactForm';

export default function ContactFormPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserEmail(parsedUser.UserMail || '');
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 w-full flex flex-col items-center justify-center p-4 pt-20">
      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors text-white z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow mb-2">📧 Contact Us</h1>
        <p className="text-gray-400">Let us know if you can't find a movie or TV show</p>
      </div>

      {/* Form Content */}
      <div className="w-full max-w-lg">
        <ContactFormContent 
          userEmail={userEmail} 
          onClose={() => navigate(-1)} 
        />
      </div>
    </div>
  );
}
