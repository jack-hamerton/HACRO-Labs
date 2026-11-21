import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, User, Mail, CreditCard, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';



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
  const { updateCurrentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [customArea, setCustomArea] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    age: '',
    field_officer: '',
    category: 'Individual',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);


  // Group selection state
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [groupAction, setGroupAction] = useState(''); // 'join' or 'create'
  const [newGroupName, setNewGroupName] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(false);

  const loadGroupsForLocation = async (location) => {
    setLoadingGroups(true);
    try {
      const response = await pb.collection('groups').getList(1, 50, {
        filter: `region = '${location}'`
      });
      setAvailableGroups(response.items || []);
      setSelectedGroupId('');
      setGroupAction('');
      setNewGroupName('');
    } catch (err) {
      console.error('Error loading groups:', err);
      setAvailableGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.field_officer) {
      toast.error('Please enter the field officer assigned to your registration');
      return false;
    }
    if (formData.age < 18) {
      toast.error('You must be at least 18 years old to register');
      return false;
    }
    // Validate group selection
    if (!groupAction) {
      toast.error('Please select or create a group');
      return false;
    }
    if (groupAction === 'join' && !selectedGroupId) {
      toast.error('Please select a group to join');
      return false;
    }
    if (groupAction === 'create' && !newGroupName.trim()) {
      toast.error('Please enter a group name');
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
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const location = `${selectedVillage}, ${selectedWard} Ward, ${selectedSubCounty} Sub-County, ${selectedCounty}`;
      const hubArea = customArea.trim() ? `${customArea.trim()}, ${location}` : location;
      const normalizedPhone = formData.phone.replace(/\D/g, '').replace(/^254/, '0').replace(/^\+/, '');
      const normalizedEmail = formData.email.trim().toLowerCase();
      const existing = await pb.collection('members').getFirstListItem(`email = "${normalizedEmail.replaceAll('"', '\\"')}"`, { $autoCancel: false }).catch(() => null);
      if (existing) {
        throw new Error('This email is already registered. Please log in or use a different email.');
      }

      const member = await pb.collection('members').create({
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim(),
        last_name: formData.last_name.trim(),
        age: Number(formData.age),
        category: formData.category,
        field_officer: formData.field_officer.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        location,
        hub_area: hubArea,
      }, { $autoCancel: false });

      const auth = await pb.collection('members').authWithPassword(member.email || formData.email.trim().toLowerCase(), formData.password);
      pb.authStore.save(auth.token, auth.record);
      updateCurrentUser(auth.record);

      let group;
      if (groupAction === 'create') {
        group = await pb.collection('groups').create({
          group_name: newGroupName.trim(),
          region: location,
          field_officer: formData.field_officer.trim(),
          description: `Community group created by ${formData.first_name.trim()} ${formData.last_name.trim()} during registration`,
        }, { $autoCancel: false });
      } else {
        group = await pb.collection('groups').getOne(selectedGroupId, { $autoCancel: false });
        if (String(group.region || '').toLowerCase() !== location.toLowerCase()) {
          throw new Error('The selected group does not match your registration location.');
        }
      }

      try {
        await pb.collection('group_members').create({
          group_id: group.id,
          member_id: member.id,
          joined_date: new Date().toISOString(),
        }, { $autoCancel: false });
      } catch (membershipError) {
        console.warn('Group membership will be completed from the member dashboard.', membershipError?.message);
      }

      try {
        await pb.collection('hub_member_preferences').create({ owner: member.id, focus_area: hubArea }, { $autoCancel: false });
      } catch (preferenceError) {
        console.info('Hub preference will be saved on the next Hub visit.', preferenceError?.message);
      }

      toast.success('Your free HACRO Hub registration is complete.');
      navigate('/registration-confirmation', { replace: true, state: { member: auth.record, group, payment: null, registrationFee: 0 } });
    } catch (error) {
      console.error('Registration failed:', error);
      const message = error?.response?.message || error?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Contact', icon: Mail },
    { number: 3, title: 'Review', icon: CreditCard },
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
                    <label className="form-label">Field Officer <span className="text-destructive">*</span></label>
                    <input type="text" name="field_officer" value={formData.field_officer} onChange={handleInputChange} className="form-input" placeholder="Enter field officer name" />
                    <p className="text-sm text-emerald-600 mt-2">Your registration will be grouped using the assigned field officer together with your location.</p>
                  </div>
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
                          setAvailableGroups([]);
                          setGroupAction('');
                          setSelectedGroupId('');
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
                          setAvailableGroups([]);
                          setGroupAction('');
                          setSelectedGroupId('');
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
                          setAvailableGroups([]);
                          setGroupAction('');
                          setSelectedGroupId('');
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
                        onChange={(e) => {
                          setSelectedVillage(e.target.value);
                          const absoluteLocationString = `${e.target.value}, ${selectedWard} Ward, ${selectedSubCounty} Sub-County, ${selectedCounty}`;
                          loadGroupsForLocation(absoluteLocationString);
                        }} 
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
                    <div className="sm:col-span-2">
                      <label className="form-label">Neighborhood, settlement, or community name <span className="text-muted-foreground">(optional)</span></label>
                      <input type="text" value={customArea} onChange={(event) => setCustomArea(event.target.value)} className="form-input" placeholder="e.g. Nyalenda, Obunga, Manyatta" maxLength={160} />
                      <p className="mt-1 text-xs text-muted-foreground">This helps us connect your account to the specific local area you work in; your selected village and county are still saved separately in your address.</p>
                    </div>
                  </div>

                  {/* Group Selection Section */}
                  {selectedVillage && (
                    <div className="md:col-span-2 rounded-2xl border border-blue-200 bg-blue-50/70 p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Join or Create a Group</h3>
                      <p className="text-sm text-muted-foreground">Select an existing group in your location or create a new one</p>
                      
                      {loadingGroups ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 text-primary animate-spin mr-2" />
                          <span className="text-muted-foreground">Loading groups...</span>
                        </div>
                      ) : (
                        <>
                          {/* Join Existing Group Option */}
                          {availableGroups.length > 0 && (
                            <div className="space-y-3">
                              <label className="flex items-center gap-3 p-3 rounded-lg border border-blue-300 cursor-pointer hover:bg-blue-100/50 transition-colors" style={{ backgroundColor: groupAction === 'join' ? 'rgba(59, 130, 246, 0.1)' : '' }}>
                                <input 
                                  type="radio" 
                                  name="groupAction" 
                                  value="join" 
                                  checked={groupAction === 'join'}
                                  onChange={(e) => setGroupAction(e.target.value)}
                                  className="w-4 h-4 text-primary"
                                />
                                <span className="font-medium text-foreground">Join an existing group</span>
                              </label>
                              
                              {groupAction === 'join' && (
                                <div className="pl-7 space-y-2">
                                  {availableGroups.map((group) => (
                                    <label key={group.id} className="flex items-center gap-3 p-2 rounded border border-blue-200 cursor-pointer hover:bg-blue-100/30">
                                      <input 
                                        type="radio" 
                                        name="selectedGroup" 
                                        value={group.id}
                                        checked={selectedGroupId === group.id}
                                        onChange={(e) => setSelectedGroupId(e.target.value)}
                                        className="w-4 h-4 text-primary"
                                      />
                                      <div>
                                        <div className="font-medium text-foreground">{group.group_name}</div>
                                        <div className="text-xs text-muted-foreground">{group.member_count || 0} members</div>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Create New Group Option */}
                          <div className="space-y-3 pt-4 border-t border-blue-200">
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-blue-300 cursor-pointer hover:bg-blue-100/50 transition-colors" style={{ backgroundColor: groupAction === 'create' ? 'rgba(59, 130, 246, 0.1)' : '' }}>
                              <input 
                                type="radio" 
                                name="groupAction" 
                                value="create" 
                                checked={groupAction === 'create'}
                                onChange={(e) => setGroupAction(e.target.value)}
                                className="w-4 h-4 text-primary"
                              />
                              <span className="font-medium text-foreground">Create a new group</span>
                            </label>
                            
                            {groupAction === 'create' && (
                              <div className="pl-7">
                                <input 
                                  type="text" 
                                  placeholder="Enter group name" 
                                  value={newGroupName}
                                  onChange={(e) => setNewGroupName(e.target.value)}
                                  className="form-input"
                                />
                                <p className="text-xs text-muted-foreground mt-2">The group will be created with your location as the region.</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

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
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Review your registration</h2>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Registration fee</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-900">Free</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-900/80">No payment or automatic savings deduction is made during registration. Any future financial transaction must be separately authorized by you.</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground">Your community location</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{customArea.trim() ? `${customArea.trim()}, ` : ''}{selectedVillage}, {selectedWard} Ward, {selectedSubCounty} Sub-County, {selectedCounty}</p>
                  <p className="mt-2 text-xs text-muted-foreground">This location will be used to select your default Youth Livelihoods Hub area.</p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {currentStep > 1 && (
                <button type="button" onClick={handleBack} disabled={loading} className="btn-secondary flex items-center space-x-2 disabled:opacity-50">
                  <ChevronLeft className="w-5 h-5" /><span>Back</span>
                </button>
              )}
              {currentStep < 3 ? (
                <button type="button" onClick={handleNext} className="btn-primary flex items-center space-x-2 ml-auto">
                  <span>Next</span><ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center space-x-2 ml-auto min-w-[200px]">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating account…</span></> : <span>Complete free registration</span>}
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

