import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, User, Mail, CreditCard, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient.js';
import Header from '@/components/Header.jsx';

// Dynmic loctions
const KENYA_LOCATION_DATA = {
  'Siaya County': {
    'Alego Usonga': {
      'Central Alego': ['Oner', 'Boro', 'Kanyaboli', 'Nyajuok'],
      'North Alego': ['Komolo', 'Hono', 'Nyamila', 'Kowet', 'Ulafu', 'Umala', 'Nyalgunga'],
      'South East Alego': ['Bar-Agulu', 'Masumbi', 'Mur-Ngiya', 'Nyangoma Kogelo', 'Bar Olengo', 'Barding', 'Mur Malanga', 'Nyajuok', 'Randago'],
      'West Alego': ['Gangu', 'Kabura Uhuyi', 'Kalkada Uradi', 'Kaugagi Hawinga', 'Kaugagi Udenda', 'Kodiere', 'Komenya Kalaka', 'Komenya Kowala', 'Mahola Ulawe', 'Sigoma Uranga'],
      'Siaya Township': ['Karapul', 'Mulaha', 'Nyandiwa'],
      'Usonga': ['Sumba', 'Nyadorera "A"', 'Nyadorera "B"']
    },
    'Bondo': {
      'Central Sakwa': ['Nyangoma', 'Barkanyango', 'Uyawi', 'Ndeda / Oyamo'],
      'North Sakwa': ['Ajigo', 'Bar Kowino', 'Bar Kowino West', 'Abom', 'Bar Chando'],
      'South Sakwa': ['East Migwena', 'West Migwena', 'Got Abiero', 'Nyaguda'],
      'West Sakwa': ['Maranda', 'Kapiyo', 'Nyawita', 'Usire','Utonga'],
      'East Yimbo': ['Got Ramogi', 'Usigu', 'Barkanyango', 'Pala', 'Nyamonye', 'Othach'],
      'West Yimbo': ['Usenge', 'Got Agulu', 'Mahanga', 'Mitundu']
    },
    'Gem': {
      'Central Gem': ['Onera', 'Malele', 'Kathomo', 'Gero', 'Nyanza', 'Anyiko'],
      'East Gem': ['Marenyo', 'Lihanda', 'Ramula'],
      'North Gem': ['Ndere', 'Nyabeda', 'Malanga', 'Got Regea', 'Maliera', 'Lundha', 'Asayi', 'Sirembe'],
      'South Gem': ['Rera', 'Kambare', 'Ndori', 'Gombe', 'Onyinyore', 'Kanyadet', 'Kaudha West', 'Kaudha East'],
      'West Gem': ['Wagai East', 'Wagai West', 'Dienya East', 'Dienya West', 'Malunga East', 'Malunga Central', 'Malunga West', 'Uriri', 'Nguge', 'Ulamba'],
      'Yala Township': ['Anyiko', 'Sauri', 'Nyamninia', 'Ulumbi', 'Umiru']
    },
     'Rarieda': {
      'East Asembo': ['Omia Diere', 'Omia Malo', 'North Ramba', 'South Ramba'],
      'West Asembo': ['Central Asembo', 'Mahaya', 'Nyagoko', 'Memba'],
      'North Uyoma': ['North Ramba', 'South Ramba', 'Masala', 'Upper Katwenga', 'Lower Katwenga', 'Kochieng'],
      'South Uyoma': ['Naya', 'Ndigwa', 'Kagwel', 'Kiwiro', 'Koyoko'],
      'West Uyoma': ['Rachar', 'Kobong', 'Kokwiri', 'Kagwa']
    },
    'Ugenya': {
      'East Ugenya': ['Anyiko', 'Sihay', 'Ramunde', 'Kathieno A', 'Kathieno B', 'Kathieno C'],
      'North Ugenya': ['Sega', 'Masat', 'Sega Mission', 'Lifunga', 'Ligega', 'Yenga'],
      'West Ugenya': ['Karadolo East', 'Karadolo West', 'Sifuyo East', 'Masat West', 'Sifuyo West', 'Nyalenya', 'Uyundo', 'Ndenga'],
      'Ukwala': ['Doho East', 'Doho West', 'Simur', 'Simur-Kondiek', 'Siranga', 'Yenga']
    },
    'Ugunja': {
      'Sidindi': ['Simenya', 'Rangala', 'Yiro East', 'Yiro West', 'Ruwe','Uhuyi'],
      'Sigomere': ['Sigomere', 'Got Osimbo', 'Mungaoo', 'Tingare East', 'Tingare West', 'Asango East', 'Asango West', 'Madungu'],
      'Ugunja': ['Ugunja', 'Uner East', 'Uner West', 'Rambula', 'Ngunya','Uholo East']
    }
  },
  'Kisumu County': {
    'Kisumu Central': {
      'Railways': ['Bandari', 'Central', 'Nyawita','Obunga Central', 'Kamakowa', 'Kasarani','Sega Sega','Kanyakwar'],
      'Migosi': ['Upper Migosi', 'Lower Migosi', 'Sigalagala', 'Car Wash'],
      'Shaurimoyo/Kaloleni': ['Kaloleni Estate', 'Shaurimoyo Estate', 'Arina Estate', 'Kondele Borderline / Kibuye Borders'],
      'Market Milimani': ['CBD', 'Upper Milimani', 'Lower Milimani', 'Anderson / Ondiek', 'Nairobi Area', 'Nyamlori', 'Lower Railways'],
      'Kondele': ['Manyatta A / Manyatta Central', 'Kona Ya Choma', 'Kondele Central / Kondele Market area', 'Arina Borders', 'Afya Estate'],
      'Manyatta A': ['Manyatta Corner', 'Manyatta Central', 'Manyatta Arab', 'Gonda', 'Kuoyo', 'Kondele Borders / Kona Ya Choma Fringes', 'Highrise', 'Metameta','Kanyakwar Borders'],
      'Nyalenda B': ['Western', 'Kilo', 'Nanga', 'Dunga']
    },
    'Kisumu East': {
      'Kajulu': ['Got Nyabondo', 'Kadero', 'Okok', 'Konya', 'Wathorego'],
      'Kolwa East': ['Rweya / Buoye Center', 'Kamrongo Village', 'Barkorwa / Kasule Borders'],
      'Manyatta B': ['Kuoyo', 'Upper Kanyakwar', 'Lower Kanyakwar', 'Gesoko', 'River Auji / Kothwuon Buffers', 'Kibos Settlement Area'],
      'Kolwa Central': ['Nyamasaria / Mowlem Corridor', 'Nyamthowi (Nyamthoi)', 'Kasule Center', 'Ondiek Estate Fringes / Borderlines'],
      'Nyalenda A': ['Central Nylenda A', 'Western Nylenda A', 'Kowino', 'Dago', 'Okonyo Welo', 'Budies', 'Kanyakwar']
    },
    'Seme': {
      'West Seme': ['West Reru', 'East Reru', 'West Ngere', 'East Ngere', 'Angoga', 'Alwala', 'West Kadinga', 'East Kadinga', 'North Alungo','South Alungo'],
      'Central Seme': ['Upper Kombewa', 'Lower Kombewa','East Kanyadwera','West Kanyadwera','East Othany', 'West Othany'],
      'East Seme': ['West Kolunje', 'West Kolunje', 'Kaila', 'Kit Mikayi','Koker / Kajulu'],
      'North Seme': ['East Katieno', 'West Katieno', 'Kadero', 'North Kowe', 'South Kowe', 'North Rata', 'South Rata']
    },
    'Nyando': {
      'East Kano/Wawidhi': ['Achego', 'Ayweyo', 'Katolo', 'Magina', 'Nyakongo'],
      'Awasi/Onjiko': ['Border I', 'Border II', 'Wanganga', 'Kobongo', 'Ayucha', 'Kakmie'],
      'Ahero': ['Kakola Ahero', 'Kakola', 'Kakola Ombaka', 'Tura', 'Kochogo Central', 'Kochogo North'],
      'Kabonyo/Kanyagwa': ['Kabonyo Irrigation Scheme', 'Ogenya', 'Nduru', 'Kapiyo', 'Central Bwanda', 'Upper Bwanda', 'Kolal', 'Anyuro', 'Ugwe', 'Kadhiambo', 'Kwa Kungu'],
      'Kobura': ['Masogo', 'Rabour', 'Okana', 'Lela', 'Kotieno', 'Nyamware North', 'Kamayoga', 'Nyamware South']
    },
    'Muhoroni': {
      'Miwani': ['Miwani Central', 'Miwani North', 'Miwani East', 'Miwani West', 'Kibigori'],
      'Ombeyi': ['Kore', 'Obumba', 'Orego'],
      'Masogo/nyangoma': ['Masogo', 'Nyangoma'],
      'Chemelil': ['Chemelil', 'Kibigori', 'Nyangore', 'Got Abuoro', 'Songhor East', 'Songhor West', 'Tamu'],
      'Muhoroni/Koru': ['Muhoroni Town', 'Koru', 'Fort Ternan', 'Owaga', 'Tonde', 'Orego', 'Nyando', 'Ochoria', 'Homa Line']
    },
    'Nyakach': {
      'South West Nyakach': ['Kajimbo', 'Okanowach', 'Ramogi', 'Gari', 'West Kadianga'],
      'North Nyakach': ['Gem Rae', 'Gem Nam', 'Agoro East', 'Agoro West', 'Jimo East', 'Jimo Middle', 'Awach', 'Lisana', 'Kasaye', 'Rarieda', 'Kandaria'],
      'Central Nyakach': ['Sigoti', 'Andingo', 'Kabodho West', 'Kabodho North', 'Sango', 'Miriu'],
      'West Nyakach': ['Nyakach Kadianga', 'Gethsemane', 'Koguta', 'Sega', 'Kabonyo', 'Kadianga'],
      'South East Nyakach': ['East Koguta', 'East Kadianga', 'Siany', 'Ramogi']
    },
    'Kisumu West': {
      'South West Kisumu': ['Ojola', 'Kisian', 'Otonglo'],
      'Kisumu North': ['Bar "A"', 'Bar "B"', 'Dago', 'Mkendwa', 'Nyahera'],
      'West Kisumu': ['North Kapuonja', 'South Kapuonja', 'Upper Kadongo', 'Lower Kadongo', 'Newa'],
      'North West Kisumu': ['East Karateng', 'West Karateng', 'Marera','Sunga']
    }
  },
  'Homa Bay County': {
    'Homa Bay Town': {
      'Homa Bay Central': ['Homa Bay Town', 'Arujo', 'Kanyabala'],
      'Homa Bay West': ['North Kanyabala', 'South Kanyabala', 'Kotieno'],
      'Homa Bay East': ['Upper Kothidha', 'Lower Kothidha', 'Genga', 'Kalanya Kanyango']
    },
    'Ndhiwa': {
      'Kwabwai': ['Kamdar Rachar', 'Kamdar Kawanga', 'Kasirime Kawanga', 'Kadhola', 'Kamdar Kodondo', 'Kachuth'],
      'Kanyadoto': ['Kabura North', 'Kabura South', 'Kaganda North', 'Kaganda South'],
      'Kanyikela': ['North Kanyikela', 'South Kanyikela'],
      'Kabuoch North': ['Kawuor', 'Karading', 'Konyango', 'East Kachieng', 'West Kachieng', 'Konyango-Kachwanya'],
      'Kabuoch South / Pala': ['Koguta', 'Kobita', 'Kamenya / Kaguria'],
      'Kanyamwa Kologi': ['Kadwet', 'Kajwang', 'Kachola', 'Komungu', 'Kakaeta', 'West Kochieng','East Kochieng'],
      'Kanyamwa Kosewe': ['Kwamo', 'Kayambo', 'Kabonyo', 'Kwandiko']
    },
    'Mbita / Suba North': {
      'Mfangano Island': ['Waware', 'Wakinga', 'Soklo North', 'Soklo South', 'Ywanya', 'Ringiti / Islands'],
      'Rusinga Island': ['Kamasengre', 'Kamasengre West', 'Wawere North', 'Wawere South', 'Kaswanga', 'Wanyama'],
      'Kasgunga': ['Kasgunga Central', 'Kasgunga East', 'Kasgunga West'],
      'Gembe': ['Gembe East', 'Gembe West', 'Gembe Central'],
      'Lambwe': ['Lambwe East', 'Lambwe West']
    },
    'Suba South': {
      'Gwassi South': ['Nyandiwa', 'Nyabera', 'Gwassi Central', 'Tonga', 'Kigoto','Kiwiro'],
      'Gwassi North': ['Nyandiwa', 'Nyagwethe', 'Uterere', 'Kisaku', 'Kitawa'],
      'Kaksingri West': ['Kaksingri West', 'Rangwa East', 'Sindo'],
      'Ruma-Kaksingri East': ['Kaksingri East', 'Sumba East', 'Sumba West', 'Ruma']
    },
    'Rangwe': {
      'West Gem': ['..', '...', '....'],
      'East Gem': ['Kotieno', 'Koyolo', 'Gongo'],
      'Kagan': ['Kajulu', 'Kanyiriema', 'Central Kagan', 'Kokoko', 'Nyawita'],
      'Kochia': ['Kamenya', 'Kanam', 'Kaura', 'Korayo', 'Kothidha','Kowili']
    },
     'Kasipul': {
      'West Kasipul': ['Town Centre', 'Arujo', 'Kanyabala'],
      'South Kasipul': ['Town Centre', 'Arujo', 'Kanyabala'],
      'Central Kasipul': ['Town Centre', 'Arujo', 'Kanyabala'],
      'East Kamagak': ['Town Centre', 'Arujo', 'Kanyabala'],
      'West Kamagak': ['Kalanya', 'Kanyadaki', 'Kanyango']
    },
     'Karachuonyo': {
      'West Karachuonyo': ['Town Centre', 'Arujo', 'Kanyabala'],
      'North Karachuonyo': ['Town Centre', 'Arujo', 'Kanyabala'],
      'Central Karachuonyo': ['Town Centre', 'Arujo', 'Kanyabala'],
      'Kanyaluo': ['Town Centre', 'Arujo', 'Kanyabala'],
      'Kibiri': ['Town Centre', 'Arujo', 'Kanyabala'],
      'Wangchieng': ['Town Centre', 'Arujo', 'Kanyabala'],
      'Kendu Bay Town': ['Kalanya', 'Kanyadaki', 'Kanyango']
    },
    'Kabondo Kasipul': {
      'Kabondo East': ['Ramba', 'Kabondo', 'Kadongo', 'Wangapala', 'Othoro', 'Soso'],
      'Kabondo West': ['Kakangutu West', 'Kakumu', 'Kasewe "A"', 'Kasewe "B"', 'Kodumo West', 'Lower Kodhoch West', 'Upper Kodhoch West'],
      'Kokwanyo / Kakelo': ['Kokwanyo East', 'Kokwanyo West', 'Kakelo Dudi', 'Kakelo Kamroth'],
      'Kojwach': ['Kojwach Kamioro', 'Kojwach Kamuga', 'Kojwach Kawere', 'Kojwach East']
    }
  },
  'Migori County': {
    'Suna East': {
      'God Jope': ['God Jope', 'Suna Sagegi', 'Upper Suna', 'Suna Rabuor'],
      'Suna Central': ['Nyasere', 'Milimani', 'Ngege'],
      'Kakrao': ['Kakrao', 'Anjego', 'Nyabisawa'],
      'Kwa': ['Kwa', 'Sagegi', 'Opasi']
    },
    'Suna West': {
      'Wiga': ['Wiga', 'Wasimbete', 'Nyamagagana', 'Saba'],
      'Wasweta II': ['Wasweta', 'Bondo Nyironge', 'Giribe'],
      'Ragana â€“ Oruba': ['Ragana', 'Oruba', 'Kanyamkago', 'Kabuoch'],
      'Wasimbete': ['Wasimbete', 'Giribe', 'Bondo Nyironge']
    },
    'Rongo': {
      'North Kamagambo / Central Kamagambo': ['Kanyawanga', 'Kamagambo', 'Nyasare', 'Rongo (Central/Town)'],
      'South Kamagambo': ['South Kamagambo', 'South Kanyawanga', 'Kitere']
    },
    'Awendo': {
      'North East Sakwa': ['Sakwa East', 'North Sakwa', 'Kuja', 'Maroo'],
      'South Sakwa': ['South Sakwa', 'Kogelo West', 'Gombe'],
      'West Sakwa': ['West Sakwa', 'Kuja', 'Waware'],
      'Central Sakwa': ['Central Sakwa', 'Mariwa', 'Kokuro']
    },
     'Uriri': {
      'West Kanyamkago': ['West Kanyamkago', 'Bware', 'Thim Jope'],
      'North Kanyamkago': ['North Kanyamkago', 'Kachieng', 'God-Jope'],
      'Central Kanyamkago': ['Central Kanyamkago', 'Uriri', 'Onyalo'],
      'East Kanyamkago': ['East Kanyamkago', 'Kachieng', 'Onyalo'],
      'South Kanyamkago': ['South Kanyamkago', 'Bware', 'Thim Jope']
    },
    'Nyatike': {
      'Kachieng': ['Kachieng', 'Kabuto', 'Kanyawanga'],
      'Kanyasa': ['Muhuru', 'Kiwiro', 'Nyakweri'],
      'North Kadem': ['Gokeharaka', 'Getambwega', 'Renjoka'],
      'Macalder / Kanyarwanda': ['Ntimaru', 'Gokeharaka', 'Wath Onger'],
      'Kaler': ['Kaler', 'Ochieng (or Kachieng)', 'Wath Onger'],
      'Got Kachola': ['Got Kachola', 'Suna Center', 'Wasweta'],
      'Muhuru': ['Bwiri Village', 'Oruba', 'Kanyasa']
    },
    'Kuria East': {
      'Gokeharaka / Getambwega': ['Gokeharaka', 'Getambwega', 'Renjoka'],
      'Ntimaru West': ['Ntimaru', 'Gokeharaka', 'Getambwega'],
      'Ntimaru East': ['Ntimaru', 'Gokeharaka', 'Getambwega'],
      'Nyabasi East': ['Nyabas', 'Gokeharaka', 'Getambwega'],
      'Nyabasi West': ['Nyabasi', 'Gokeharaka', 'Getambwega']
    },
    'Kuria West': {
      'Bukira East': ['Bukira', 'Kiamkama', 'Gwikonge'],
      'Bukira Central / Ikerege': ['Ikerege', 'Bukira', 'Gwikonge'],
      'Isibania': ['Isibania', 'Ikerege', 'Nyabasi'],
      'Mokerero': ['Mokerero', 'Taragwiti', 'Nyametaburo'],
      'Masaba': ['Masaba', 'Gwikonge', 'Kiamkama'],
      'Tagare': ['Tagare', 'Gwikonge', 'Kiamkama'],
      'Nyamosense / Komosoko': ['Nyamosense', 'Komosoko', 'Gwikonge']
    }
  }
};

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollTimerRef = useRef(null);

  // Added dynamic location state controls
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    age: '',
    spouse_kin_name: '',
    category: 'Individual',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    amount: 50,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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
    if (!formData.first_name || !formData.last_name || !formData.age || !formData.category) {
      toast.error('Please fill in all required personal fields');
      return false;
    }
    if (!selectedCounty || !selectedSubCounty || !selectedWard || !selectedVillage) {
      toast.error('Please complete your complete structural location mapping');
      return false;
    }
    if (formData.category === 'Corporate' && !formData.spouse_kin_name) {
      toast.error('Corporate members must provide a spouse / next of kin name for group matching');
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
      if (!termsAccepted) {
        toast.error('Please accept the Terms & Conditions before continuing.');
        return;
      }
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
        purpose: 'Member Registration Fee',
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
      
      // Inject concatenated readable physical address structure into Pocketbase form data instance
      const absoluteLocationString = `${selectedVillage}, ${selectedWard} Ward, ${selectedSubCounty} Sub-County, ${selectedCounty}`;
      memberFormData.append('location', absoluteLocationString);

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
        <title>Register - HACRO Hub</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20 sm:pt-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Member registration</h1>
            <p className="text-muted-foreground">Complete the steps below to join HACRO Hub</p>
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
                    <label className="form-label">Category <span className="text-destructive">*</span></label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="form-input" required>
                      <option value="Individual">Individual</option>
                      <option value="Family">Family</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Spouse / Next of Kin {formData.category === 'Corporate' ? <span className="text-destructive">*</span> : null}</label>
                    <input type="text" name="spouse_kin_name" value={formData.spouse_kin_name} onChange={handleInputChange} className="form-input" placeholder="Enter spouse or next of kin name" />
                    {formData.category === 'Corporate' && (
                      <p className="text-sm text-emerald-600 mt-2">Corporate registrations with matching location and spouse/next of kin details are prioritized into the same group.</p>
                    )}
                  </div>

                  {/* Cascading Location Selection Segment */}
                  <div className={`md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 pt-5 transition-all duration-200 ${selectedCounty || selectedSubCounty || selectedWard || selectedVillage ? 'border-emerald-400 bg-emerald-100/80' : 'hover:border-emerald-400 hover:bg-emerald-100/70'}`}>
                    <div>
                      <label className="form-label">County <span className="text-destructive">*</span></label>
                      <select 
                        value={selectedCounty} 
                        onChange={(e) => {
                          setSelectedCounty(e.target.value);
                          setSelectedSubCounty('');
                          setSelectedWard('');
                          setSelectedVillage('');
                        }} 
                        className="form-input border-emerald-400 bg-white/90 text-foreground transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-100 focus:border-emerald-500 focus:ring-emerald-500" 
                        required
                      >
                        <option value="">Select County</option>
                        {Object.keys(KENYA_LOCATION_DATA).map(county => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Sub County <span className="text-destructive">*</span></label>
                      <select 
                        value={selectedSubCounty} 
                        onChange={(e) => {
                          setSelectedSubCounty(e.target.value);
                          setSelectedWard('');
                          setSelectedVillage('');
                        }} 
                        className="form-input border-emerald-400 bg-white/90 text-foreground transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-100 focus:border-emerald-500 focus:ring-emerald-500" 
                        disabled={!selectedCounty}
                        required
                      >
                        <option value="">Select Sub County</option>
                        {selectedCounty && Object.keys(KENYA_LOCATION_DATA[selectedCounty]).map(subCounty => (
                          <option key={subCounty} value={subCounty}>{subCounty}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Ward <span className="text-destructive">*</span></label>
                      <select 
                        value={selectedWard} 
                        onChange={(e) => {
                          setSelectedWard(e.target.value);
                          setSelectedVillage('');
                        }} 
                        className="form-input border-emerald-400 bg-white/90 text-foreground transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-100 focus:border-emerald-500 focus:ring-emerald-500" 
                        disabled={!selectedSubCounty}
                        required
                      >
                        <option value="">Select Ward</option>
                        {selectedSubCounty && Object.keys(KENYA_LOCATION_DATA[selectedCounty][selectedSubCounty]).map(ward => (
                          <option key={ward} value={ward}>{ward}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Village / Area Unit <span className="text-destructive">*</span></label>
                      <select 
                        value={selectedVillage} 
                        onChange={(e) => setSelectedVillage(e.target.value)} 
                        className="form-input border-emerald-400 bg-white/90 text-foreground transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-100 focus:border-emerald-500 focus:ring-emerald-500" 
                        disabled={!selectedWard}
                        required
                      >
                        <option value="">Select Village/Unit</option>
                        {selectedWard && KENYA_LOCATION_DATA[selectedCounty][selectedSubCounty][selectedWard].map(village => (
                          <option key={village} value={village}>{village}</option>
                        ))}
                      </select>
                    </div>
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
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-input"
                        minLength="8"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Confirm password <span className="text-destructive">*</span></label>
                    <div className="relative">
                      <input
                        type={showPasswordConfirm ? 'text' : 'password'}
                        name="passwordConfirm"
                        value={formData.passwordConfirm}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPasswordConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-muted border border-border rounded-3xl p-4 space-y-3">
                  <div className="text-sm text-foreground font-semibold">Terms & Conditions Summary</div>
                  <p className="text-sm text-muted-foreground">
                    By registering, you agree to HACRO Hub automated loan and savings processing rules, including deductions for overdue loans, group interest penalties, guarantor collateral handling, and in-app notifications.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Read the full Terms & Conditions on the <Link to="/community-financial-empowerment#terms" className="text-primary hover:underline">Community Financial Empowerment page</Link>.
                  </p>
                  <label className="inline-flex items-start gap-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span>I have read and agree to the <Link to="/community-financial-empowerment#terms" className="text-primary hover:underline">Terms & Conditions</Link> and Privacy Policy.</span>
                  </label>
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
      </div>
    </>
  );
};

export default RegistrationPage;

