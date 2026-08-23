export type Lang = "en" | "ta";

export type Department = {
  id: string;
  slug: string;
  name: string;
  nameTa: string;
  short: string;
  shortTa: string;
  description: string;
  descriptionTa: string;
  services: string[];
  servicesTa: string[];
  opd: string;
  image: string;
  hod?: string;
  status?: "active" | "inactive";
};

export type Doctor = {
  id: string;
  slug: string;
  name: string;
  nameTa: string;
  qualifications: string;
  departmentId: string;
  speciality: string;
  specialityTa: string;
  experience: number;
  photo: string;
  expertise: string[];
  expertiseTa: string[];
  bio: string;
  bioTa: string;
  days: number[];
  start: string;
  end: string;
  lunchStart: string;
  lunchEnd: string;
  eveningStart?: string;
  eveningEnd?: string;
  registration?: string;
  fee?: number;
  status?: "active" | "inactive";
};

export type HealthPackage = {
  id: string;
  slug: string;
  name: string;
  nameTa: string;
  suitable: string;
  suitableTa: string;
  tests: string[];
  testsTa: string[];
  price: number;
  description?: string;
  type?: string;
  originalPrice?: number;
  duration?: string;
  notes?: string;
  image?: string;
  status?: "active" | "inactive";
};

export type HospitalService = {
  id: string;
  name: string;
  nameTa: string;
  description: string;
  descriptionTa: string;
  status?: "active" | "inactive";
};

export const HOSPITAL = {
  name: "Neha Hospitals",
  nameTa: "நேஹா மருத்துவமனை",
  city: "Chennai",
  address: "42, GST Road, Chromepet, Chennai – 600044, Tamil Nadu",
  addressTa: "42, ஜி.எஸ்.டி. சாலை, குரோம்பேட்டை, சென்னை – 600044, தமிழ்நாடு",
  phone: "+91 44 4567 8900",
  phoneRaw: "04445678900",
  emergency: "+91 44 4567 8911",
  emergencyRaw: "04445678911",
  whatsapp: "919840012345",
  email: "care@nehahospitals.in",
  hours: "OPD: 9:00 AM – 6:00 PM | Emergency: 24×7",
  hoursTa: "வெளிநோயாளர்: காலை 9:00 – மாலை 6:00 | அவசர சிகிச்சை: 24×7",
  mapEmbed:
    "https://maps.google.com/maps?q=Chromepet%20Chennai&t=&z=15&ie=UTF8&iwloc=&output=embed",
  stats: {
    years: 18,
    doctors: 86,
    beds: 220,
    departments: 16,
    patients: "4.2L+",
  },
};

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80",
  intro: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1400&q=80",
  building: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1600&q=80",
  reception: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80",
  rooms: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&w=1600&q=80",
  icu: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80",
  ot: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=80",
  emergency: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80",
  lab: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80",
  pharmacy: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=80",
  waiting: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80",
  cafeteria: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
  parking: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1600&q=80",
  corridor: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1600&q=80",
  consult: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80",
  care: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80",
  leadership: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  technology: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80",
};

export const DEPARTMENTS: Department[] = [
  {
    id: "general-medicine",
    slug: "general-medicine",
    name: "General Medicine",
    nameTa: "பொது மருத்துவம்",
    short: "Adult internal medicine for acute and chronic illness.",
    shortTa: "கடுமையான மற்றும் நாள்பட்ட நோய்களுக்கான உள் மருத்துவம்.",
    description:
      "The Department of General Medicine provides comprehensive evaluation and management of adult medical conditions, including fever, infections, diabetes, hypertension, thyroid disorders and multi-system illness. Physicians work closely with specialists to coordinate investigations and inpatient care.",
    descriptionTa:
      "பொது மருத்துவத் துறை காய்ச்சல், தொற்றுகள், நீரிழிவு, உயர் இரத்த அழுத்தம், தைராய்டு கோளாறுகள் உள்ளிட்ட வயதுவந்தோர் மருத்துவ நிலைகளை முழுமையாக மதிப்பீடு செய்து சிகிச்சை அளிக்கிறது.",
    services: ["Fever & infection clinic", "Lifestyle disease management", "Pre-operative medical clearance", "Inpatient physician care"],
    servicesTa: ["காய்ச்சல் மற்றும் தொற்று மருத்துவமனை", "வாழ்க்கை முறை நோய் மேலாண்மை", "அறுவை சிகிச்சைக்கு முன் மருத்துவ அனுமதி", "உள்நோயாளி மருத்துவ பராமரிப்பு"],
    opd: "Monday – Saturday, 9:00 AM – 5:30 PM",
    image: IMAGES.consult,
  },
  {
    id: "cardiology",
    slug: "cardiology",
    name: "Cardiology",
    nameTa: "இதயவியல்",
    short: "Heart disease diagnosis, intervention and cardiac rehabilitation.",
    shortTa: "இதய நோய் கண்டறிதல், தலையீடு மற்றும் இதய மறுவாழ்வு.",
    description:
      "Cardiology services cover clinical cardiology, echocardiography, ECG, treadmill testing and management of coronary artery disease, heart failure and arrhythmias. Emergency cardiac care is available around the clock.",
    descriptionTa:
      "இதயவியல் சேவைகள் மருத்துவ இதய பரிசோதனை, எக்கோ, ஈசிஜி, டிரெட்மில் சோதனை மற்றும் இதய நோய், இதய செயலிழப்பு மேலாண்மையை உள்ளடக்கியது. அவசர இதய சிகிச்சை நாள் முழுவதும் கிடைக்கும்.",
    services: ["ECG & 2D Echo", "Treadmill test", "Cardiac risk assessment", "Heart failure clinic"],
    servicesTa: ["ஈசிஜி மற்றும் 2டி எக்கோ", "டிரெட்மில் சோதனை", "இதய ஆபத்து மதிப்பீடு", "இதய செயலிழப்பு மருத்துவமனை"],
    opd: "Monday – Saturday, 9:00 AM – 5:00 PM",
    image: IMAGES.icu,
  },
  {
    id: "neurology",
    slug: "neurology",
    name: "Neurology",
    nameTa: "நரம்பியல்",
    short: "Disorders of the brain, spine and peripheral nerves.",
    shortTa: "மூளை, முதுகெலும்பு மற்றும் நரம்பு கோளாறுகள்.",
    description:
      "Neurology at Neha Hospitals manages stroke, epilepsy, headache, neuropathies, Parkinson’s disease and neuromuscular conditions with access to neuroimaging and dedicated inpatient support.",
    descriptionTa:
      "பக்கவாதம், வலிப்பு, தலைவலி, நரம்பு பாதிப்பு மற்றும் பார்கின்சன் நோய் உள்ளிட்ட நிலைகளுக்கு நரம்பியல் துறை சிகிச்சை அளிக்கிறது.",
    services: ["Stroke evaluation", "Headache clinic", "EEG", "Movement disorder review"],
    servicesTa: ["பக்கவாத மதிப்பீடு", "தலைவலி மருத்துவமனை", "ஈஈஜி", "இயக்கக் கோளாறு பரிசோதனை"],
    opd: "Monday – Saturday, 10:00 AM – 4:30 PM",
    image: IMAGES.corridor,
  },
  {
    id: "orthopaedics",
    slug: "orthopaedics",
    name: "Orthopaedics",
    nameTa: "எலும்பியல்",
    short: "Bone, joint, trauma and sports injury care.",
    shortTa: "எலும்பு, மூட்டு, காயம் மற்றும் விளையாட்டு காய சிகிச்சை.",
    description:
      "Orthopaedics provides fracture management, joint replacement counselling, sports injury care and treatment of arthritis and spinal conditions. The team works with physiotherapy for structured rehabilitation.",
    descriptionTa:
      "எலும்பு முறிவு சிகிச்சை, மூட்டு மாற்று ஆலோசனை, விளையாட்டு காயங்கள் மற்றும் கீல்வாத மேலாண்மை ஆகியவை எலும்பியல் துறையில் வழங்கப்படுகின்றன.",
    services: ["Fracture clinic", "Joint pain clinic", "Sports injury care", "Post-operative rehabilitation"],
    servicesTa: ["எலும்பு முறிவு மருத்துவமனை", "மூட்டு வலி மருத்துவமனை", "விளையாட்டு காய சிகிச்சை", "அறுவை சிகிச்சைக்குப் பின் மறுவாழ்வு"],
    opd: "Monday – Saturday, 9:00 AM – 5:30 PM",
    image: IMAGES.ot,
  },
  {
    id: "obg",
    slug: "obstetrics-gynaecology",
    name: "Obstetrics & Gynaecology",
    nameTa: "மகப்பேறு மற்றும் மகளிர் நோய்",
    short: "Pregnancy care, gynaecology and women’s health.",
    shortTa: "கர்ப்பகால பராமரிப்பு மற்றும் மகளிர் நலன்.",
    description:
      "The department supports antenatal care, high-risk pregnancy review, labour and delivery, and gynaecological conditions across all age groups, with an emphasis on dignity and continuity of care.",
    descriptionTa:
      "கர்ப்பகால பரிசோதனை, அதிக ஆபத்துள்ள கர்ப்பம், பிரசவம் மற்றும் மகளிர் நோய் சிகிச்சைகள் இத்துறையில் வழங்கப்படுகின்றன.",
    services: ["Antenatal clinic", "Gynaecology OPD", "Family planning counselling", "Menstrual disorder clinic"],
    servicesTa: ["கர்ப்பகால மருத்துவமனை", "மகளிர் நோய் வெளிநோயாளர்", "குடும்ப நல ஆலோசனை", "மாதவிடாய் கோளாறு மருத்துவமனை"],
    opd: "Monday – Saturday, 9:00 AM – 4:00 PM",
    image: IMAGES.care,
  },
  {
    id: "paediatrics",
    slug: "paediatrics",
    name: "Paediatrics",
    nameTa: "குழந்தை மருத்துவம்",
    short: "Newborn, infant and child healthcare.",
    shortTa: "புதிதாகப் பிறந்த குழந்தை மற்றும் குழந்தை நலன்.",
    description:
      "Paediatrics covers well-baby visits, immunisation guidance, childhood infections, growth and development concerns and adolescent health, delivered in a child-friendly environment.",
    descriptionTa:
      "நோய்த்தடுப்பு, குழந்தை தொற்றுகள், வளர்ச்சி கண்காணிப்பு மற்றும் இளம் பருவ நலன் ஆகியவை குழந்தை மருத்துவத் துறையில் வழங்கப்படுகின்றன.",
    services: ["Well-baby clinic", "Childhood illness", "Growth monitoring", "Adolescent health"],
    servicesTa: ["குழந்தை நல மருத்துவமனை", "குழந்தை நோய்கள்", "வளர்ச்சி கண்காணிப்பு", "இளம் பருவ நலன்"],
    opd: "Monday – Saturday, 9:00 AM – 6:00 PM",
    image: IMAGES.consult,
  },
  {
    id: "dermatology",
    slug: "dermatology",
    name: "Dermatology",
    nameTa: "தோல் மருத்துவம்",
    short: "Skin, hair and nail disorders.",
    shortTa: "தோல், முடி மற்றும் நகம் தொடர்பான கோளாறுகள்.",
    description:
      "Dermatology treats acne, eczema, infections, pigmentation, hair loss and allergic skin conditions with medical and procedural options as clinically indicated.",
    descriptionTa:
      "முகப்பரு, அரிக்கும் தோல் அழற்சி, தோல் தொற்று, நிறமாற்றம் மற்றும் முடி உதிர்தல் ஆகியவற்றுக்கு தோல் மருத்துவம் சிகிச்சை அளிக்கிறது.",
    services: ["Acne clinic", "Allergy & eczema", "Hair & nail clinic", "Skin infection care"],
    servicesTa: ["முகப்பரு மருத்துவமனை", "ஒவ்வாமை மற்றும் அரிக்கும் தோல்", "முடி மற்றும் நகம்", "தோல் தொற்று சிகிச்சை"],
    opd: "Monday – Saturday, 10:00 AM – 4:00 PM",
    image: IMAGES.corridor,
  },
  {
    id: "ent",
    slug: "ent",
    name: "ENT",
    nameTa: "காது, மூக்கு, தொண்டை",
    short: "Ear, nose, throat and sinus care.",
    shortTa: "காது, மூக்கு, தொண்டை மற்றும் சைனஸ் சிகிச்சை.",
    description:
      "ENT services include hearing assessment, sinusitis, tonsillitis, voice disorders and paediatric ENT complaints, with endoscopy support where required.",
    descriptionTa:
      "கேட்கும் திறன் பரிசோதனை, சைனசிடிஸ், டான்சிலிடிஸ் மற்றும் குரல் கோளாறுகளுக்கு ENT துறை சிகிச்சை அளிக்கிறது.",
    services: ["Sinus clinic", "Hearing evaluation", "Throat infections", "Paediatric ENT"],
    servicesTa: ["சைனஸ் மருத்துவமனை", "கேட்கும் திறன் பரிசோதனை", "தொண்டை தொற்று", "குழந்தை ENT"],
    opd: "Monday – Saturday, 9:30 AM – 5:00 PM",
    image: IMAGES.consult,
  },
  {
    id: "urology",
    slug: "urology",
    name: "Urology",
    nameTa: "சிறுநீரகவியல்",
    short: "Kidney, bladder and urinary tract care.",
    shortTa: "சிறுநீரகம், சிறுநீர்ப்பை மற்றும் சிறுநீர் பாதை சிகிச்சை.",
    description:
      "Urology manages kidney stones, prostate conditions, urinary infections and male urological health, coordinated with nephrology and imaging services.",
    descriptionTa:
      "சிறுநீரக கற்கள், புரோஸ்டேட் நிலைகள் மற்றும் சிறுநீர் தொற்றுகளுக்கு சிறுநீரகவியல் துறை சிகிச்சை அளிக்கிறது.",
    services: ["Stone clinic", "Prostate clinic", "UTI management", "Uro-diagnostics"],
    servicesTa: ["கல் மருத்துவமனை", "புரோஸ்டேட் மருத்துவமனை", "சிறுநீர் தொற்று மேலாண்மை", "சிறுநீர் பரிசோதனைகள்"],
    opd: "Monday – Saturday, 9:00 AM – 4:30 PM",
    image: IMAGES.lab,
  },
  {
    id: "gastro",
    slug: "gastroenterology",
    name: "Gastroenterology",
    nameTa: "இரைப்பை குடல் மருத்துவம்",
    short: "Digestive system and liver disorders.",
    shortTa: "செரிமான மண்டலம் மற்றும் கல்லீரல் கோளாறுகள்.",
    description:
      "Gastroenterology addresses acidity, IBS, liver disease, jaundice and inflammatory bowel conditions with endoscopy services available by appointment.",
    descriptionTa:
      "அமிலத்தன்மை, ஐபிஎஸ், கல்லீரல் நோய் மற்றும் மஞ்சள் காமாலை உள்ளிட்ட நிலைகளுக்கு இரைப்பை குடல் துறை சிகிச்சை அளிக்கிறது.",
    services: ["Acidity & reflux clinic", "Liver clinic", "Endoscopy (by appointment)", "IBD follow-up"],
    servicesTa: ["அமிலத்தன்மை மருத்துவமனை", "கல்லீரல் மருத்துவமனை", "எண்டோஸ்கோபி (முன்பதிவு)", "IBD பின்தொடர்தல்"],
    opd: "Monday – Saturday, 9:00 AM – 4:00 PM",
    image: IMAGES.lab,
  },
  {
    id: "pulmonology",
    slug: "pulmonology",
    name: "Pulmonology",
    nameTa: "நுரையீரல் மருத்துவம்",
    short: "Asthma, COPD, infections and sleep-related breathing issues.",
    shortTa: "ஆஸ்துமா, சிஓபிடி மற்றும் சுவாசக் கோளாறுகள்.",
    description:
      "Pulmonology provides care for asthma, COPD, pneumonia, tuberculosis follow-up and chronic cough, supported by pulmonary function testing.",
    descriptionTa:
      "ஆஸ்துமா, சிஓபிடி, நிமோனியா மற்றும் நாள்பட்ட இருமலுக்கு நுரையீரல் துறை சிகிச்சை அளிக்கிறது.",
    services: ["Asthma & COPD clinic", "PFT", "TB follow-up", "Chronic cough clinic"],
    servicesTa: ["ஆஸ்துமா மற்றும் சிஓபிடி", "நுரையீரல் செயல்பாட்டு சோதனை", "காசநோய் பின்தொடர்தல்", "நாள்பட்ட இருமல் மருத்துவமனை"],
    opd: "Monday – Saturday, 9:30 AM – 5:00 PM",
    image: IMAGES.icu,
  },
  {
    id: "nephrology",
    slug: "nephrology",
    name: "Nephrology",
    nameTa: "சிறுநீரக மருத்துவம்",
    short: "Kidney disease, hypertension and dialysis support.",
    shortTa: "சிறுநீரக நோய், உயர் அழுத்தம் மற்றும் டயலிசிஸ் ஆதரவு.",
    description:
      "Nephrology manages chronic kidney disease, electrolyte imbalance, hypertensive kidney disease and dialysis counselling, in close coordination with urology and critical care.",
    descriptionTa:
      "நாள்பட்ட சிறுநீரக நோய், உயர் இரத்த அழுத்தம் தொடர்பான சிறுநீரக பாதிப்பு மற்றும் டயலிசிஸ் ஆலோசனை இத்துறையில் வழங்கப்படுகின்றன.",
    services: ["CKD clinic", "Hypertension clinic", "Dialysis counselling", "Electrolyte review"],
    servicesTa: ["சிகேடி மருத்துவமனை", "உயர் அழுத்த மருத்துவமனை", "டயலிசிஸ் ஆலோசனை", "எலக்ட்ரோலைட் மதிப்பீடு"],
    opd: "Monday – Friday, 9:00 AM – 3:30 PM",
    image: IMAGES.icu,
  },
  {
    id: "surgery",
    slug: "general-surgery",
    name: "General Surgery",
    nameTa: "பொது அறுவை சிகிச்சை",
    short: "Elective and emergency surgical care.",
    shortTa: "திட்டமிட்ட மற்றும் அவசர அறுவை சிகிச்சை.",
    description:
      "General Surgery offers evaluation for hernia, gall bladder disease, appendicitis, wounds and other common surgical conditions, with theatre support and post-operative ward care.",
    descriptionTa:
      "ஹெர்னியா, பித்தப்பை நோய், அப்பென்டிசைடிஸ் மற்றும் காய சிகிச்சை உள்ளிட்ட பொது அறுவை நிலைகளுக்கு இத்துறை சிகிச்சை அளிக்கிறது.",
    services: ["Hernia clinic", "Gall bladder clinic", "Wound care", "Day-care procedures"],
    servicesTa: ["ஹெர்னியா மருத்துவமனை", "பித்தப்பை மருத்துவமனை", "காய பராமரிப்பு", "ஒரு நாள் நடைமுறைகள்"],
    opd: "Monday – Saturday, 9:00 AM – 4:00 PM",
    image: IMAGES.ot,
  },
  {
    id: "emergency",
    slug: "emergency-medicine",
    name: "Emergency Medicine",
    nameTa: "அவசர மருத்துவம்",
    short: "24×7 emergency and trauma response.",
    shortTa: "24×7 அவசர மற்றும் காய சிகிச்சை.",
    description:
      "The Emergency Department is staffed around the clock for medical, surgical and trauma emergencies, with triage, resuscitation bays and rapid access to imaging, laboratory and ICU.",
    descriptionTa:
      "மருத்துவ, அறுவை மற்றும் காய அவசர நிலைகளுக்கு அவசர சிகிச்சைப் பிரிவு நாள் முழுவதும் செயல்படுகிறது.",
    services: ["24×7 triage", "Trauma care", "Cardiac emergencies", "Stabilisation & transfer"],
    servicesTa: ["24×7 முன்னுரிமை வகைப்படுத்தல்", "காய சிகிச்சை", "இதய அவசரங்கள்", "நிலைப்படுத்தல் மற்றும் பரிந்துரை"],
    opd: "Open 24 hours",
    image: IMAGES.emergency,
  },
  {
    id: "radiology",
    slug: "radiology",
    name: "Radiology",
    nameTa: "கதிரியக்கவியல்",
    short: "Digital imaging to support accurate diagnosis.",
    shortTa: "துல்லியமான நோயறிதலுக்கான டிஜிட்டல் படமெடுத்தல்.",
    description:
      "Radiology provides digital X-ray, ultrasound and CT imaging with timely reporting for OPD, inpatient and emergency patients.",
    descriptionTa:
      "டிஜிட்டல் எக்ஸ்ரே, அல்ட்ராசவுண்ட் மற்றும் சிடி ஸ்கேன் சேவைகள் கதிரியக்கவியல் துறையில் வழங்கப்படுகின்றன.",
    services: ["Digital X-ray", "Ultrasound", "CT imaging", "Emergency radiology"],
    servicesTa: ["டிஜிட்டல் எக்ஸ்ரே", "அல்ட்ராசவுண்ட்", "சிடி இமேஜிங்", "அவசர கதிரியக்கவியல்"],
    opd: "Monday – Saturday, 8:00 AM – 8:00 PM; Emergency 24×7",
    image: IMAGES.technology,
  },
  {
    id: "pathology",
    slug: "pathology",
    name: "Pathology",
    nameTa: "நோயியல்",
    short: "Clinical laboratory and diagnostic pathology.",
    shortTa: "மருத்துவ ஆய்வகம் மற்றும் நோயறிதல்.",
    description:
      "Pathology and laboratory medicine support routine biochemistry, haematology, immunology and sample collection, including home collection by appointment.",
    descriptionTa:
      "இரத்த பரிசோதனை, உயிர்வேதியியல் மற்றும் நோயெதிர்ப்பு சோதனைகள் உள்ளிட்ட ஆய்வக சேவைகள் நோயியல் துறையில் வழங்கப்படுகின்றன.",
    services: ["Haematology", "Biochemistry", "Immunology", "Home sample collection"],
    servicesTa: ["இரத்தவியல்", "உயிர்வேதியியல்", "நோயெதிர்ப்பு சோதனை", "வீட்டு மாதிரி சேகரிப்பு"],
    opd: "Monday – Saturday, 7:00 AM – 7:00 PM",
    image: IMAGES.lab,
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: "r-sharma",
    slug: "dr-r-sharma",
    name: "Dr. R. Sharma",
    nameTa: "டாக்டர் ஆர். சர்மா",
    qualifications: "MBBS, MD (General Medicine)",
    departmentId: "general-medicine",
    speciality: "General Medicine",
    specialityTa: "பொது மருத்துவம்",
    experience: 18,
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
    expertise: ["Diabetes and hypertension", "Infectious diseases", "Preventive health", "Inpatient medicine"],
    expertiseTa: ["நீரிழிவு மற்றும் உயர் அழுத்தம்", "தொற்று நோய்கள்", "தடுப்பு நலன்", "உள்நோயாளி மருத்துவம்"],
    bio: "Dr. R. Sharma is Senior Consultant in General Medicine with nearly two decades of experience in adult internal medicine. He is known for methodical evaluation, clear communication with families, and long-term management of chronic disease.",
    bioTa: "டாக்டர் ஆர். சர்மா பொது மருத்துவத்தில் மூத்த ஆலோசகர். வயதுவந்தோர் உள் மருத்துவத்தில் சுமார் இருபது ஆண்டுகள் அனுபவம் கொண்டவர்.",
    days: [1, 2, 3, 4, 5, 6],
    start: "09:00",
    end: "17:30",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "anitha-verma",
    slug: "dr-anitha-verma",
    name: "Dr. Anitha Verma",
    nameTa: "டாக்டர் அனிதா வர்மா",
    qualifications: "MBBS, MS (Obstetrics & Gynaecology)",
    departmentId: "obg",
    speciality: "Obstetrics & Gynaecology",
    specialityTa: "மகப்பேறு மற்றும் மகளிர் நோய்",
    experience: 15,
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    expertise: ["Antenatal care", "High-risk pregnancy", "Gynaecological disorders", "Women’s wellness"],
    expertiseTa: ["கர்ப்பகால பராமரிப்பு", "அதிக ஆபத்துள்ள கர்ப்பம்", "மகளிர் நோய்கள்", "பெண்கள் நலன்"],
    bio: "Dr. Anitha Verma provides obstetric and gynaecological care with a focus on safe pregnancy, respectful maternity care and evidence-based treatment of common gynaecological conditions.",
    bioTa: "டாக்டர் அனிதா வர்மா பாதுகாப்பான கர்ப்பம் மற்றும் மரியாதையான மகப்பேறு பராமரிப்பில் கவனம் செலுத்தி மகளிர் நல சிகிச்சை அளிக்கிறார்.",
    days: [1, 2, 3, 4, 5, 6],
    start: "09:00",
    end: "16:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "s-patel",
    slug: "dr-s-patel",
    name: "Dr. S. Patel",
    nameTa: "டாக்டர் எஸ். படேல்",
    qualifications: "MBBS, MS (Orthopaedics)",
    departmentId: "orthopaedics",
    speciality: "Orthopaedics",
    specialityTa: "எலும்பியல்",
    experience: 14,
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    expertise: ["Fracture management", "Arthritis care", "Sports injuries", "Joint preservation"],
    expertiseTa: ["எலும்பு முறிவு சிகிச்சை", "கீல்வாத பராமரிப்பு", "விளையாட்டு காயங்கள்", "மூட்டு பாதுகாப்பு"],
    bio: "Dr. S. Patel is Consultant Orthopaedic Surgeon with experience in trauma, degenerative joint disease and sports-related injuries. He emphasises early mobilisation and structured physiotherapy.",
    bioTa: "டாக்டர் எஸ். படேல் எலும்பியல் அறுவை சிகிச்சை ஆலோசகர். காயம், மூட்டு நோய் மற்றும் விளையாட்டு காயங்களில் அனுபவம் கொண்டவர்.",
    days: [1, 2, 3, 4, 5, 6],
    start: "09:00",
    end: "17:30",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "meera-iyer",
    slug: "dr-meera-iyer",
    name: "Dr. Meera Iyer",
    nameTa: "டாக்டர் மீரா அய்யர்",
    qualifications: "MBBS, MD (Paediatrics)",
    departmentId: "paediatrics",
    speciality: "Paediatrics",
    specialityTa: "குழந்தை மருத்துவம்",
    experience: 12,
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80",
    expertise: ["Childhood infections", "Growth and development", "Immunisation guidance", "Adolescent health"],
    expertiseTa: ["குழந்தை தொற்றுகள்", "வளர்ச்சி மற்றும் வளர்ச்சி", "நோய்த்தடுப்பு வழிகாட்டுதல்", "இளம் பருவ நலன்"],
    bio: "Dr. Meera Iyer is Consultant Paediatrician known for calm, family-centred consultations. She manages common childhood illnesses and follows children through growth, nutrition and school-age health.",
    bioTa: "டாக்டர் மீரா அய்யர் குழந்தை மருத்துவ ஆலோசகர். குடும்பத்தை மையமாகக் கொண்ட அணுகுமுறையுடன் குழந்தை நல சிகிச்சை அளிக்கிறார்.",
    days: [1, 2, 3, 4, 5, 6],
    start: "09:00",
    end: "18:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "k-raman",
    slug: "dr-k-raman",
    name: "Dr. K. Raman",
    nameTa: "டாக்டர் கே. ராமன்",
    qualifications: "MBBS, DM (Cardiology)",
    departmentId: "cardiology",
    speciality: "Cardiology",
    specialityTa: "இதயவியல்",
    experience: 16,
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
    expertise: ["Coronary artery disease", "Heart failure", "Hypertension", "Preventive cardiology"],
    expertiseTa: ["கரோனரி தமனி நோய்", "இதய செயலிழப்பு", "உயர் அழுத்தம்", "தடுப்பு இதயவியல்"],
    bio: "Dr. K. Raman is Senior Consultant Cardiologist. He focuses on early risk identification, medical management of ischaemic heart disease and coordinated emergency cardiac care.",
    bioTa: "டாக்டர் கே. ராமன் மூத்த இதயவியல் ஆலோசகர். இதய நோய் ஆபத்தை முன்கூட்டியே கண்டறிவதில் கவனம் செலுத்துகிறார்.",
    days: [1, 2, 3, 4, 5],
    start: "09:00",
    end: "17:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "priya-nair",
    slug: "dr-priya-nair",
    name: "Dr. Priya Nair",
    nameTa: "டாக்டர் பிரியா நாயர்",
    qualifications: "MBBS, DM (Neurology)",
    departmentId: "neurology",
    speciality: "Neurology",
    specialityTa: "நரம்பியல்",
    experience: 11,
    photo: "https://images.unsplash.com/photo-1651009757985-6cb69c509ea0?auto=format&fit=crop&w=800&q=80",
    expertise: ["Stroke", "Epilepsy", "Headache disorders", "Neuropathy"],
    expertiseTa: ["பக்கவாதம்", "வலிப்பு", "தலைவலி கோளாறுகள்", "நரம்பு பாதிப்பு"],
    bio: "Dr. Priya Nair is Consultant Neurologist with experience in acute stroke pathways, chronic headache and epilepsy follow-up. She works closely with radiology and rehabilitation services.",
    bioTa: "டாக்டர் பிரியா நாயர் நரம்பியல் ஆலோசகர். பக்கவாதம், தலைவலி மற்றும் வலிப்பு சிகிச்சையில் அனுபவம் கொண்டவர்.",
    days: [1, 2, 3, 4, 5],
    start: "10:00",
    end: "16:30",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "arjun-menon",
    slug: "dr-arjun-menon",
    name: "Dr. Arjun Menon",
    nameTa: "டாக்டர் அர்ஜுன் மேனன்",
    qualifications: "MBBS, MD (Dermatology)",
    departmentId: "dermatology",
    speciality: "Dermatology",
    specialityTa: "தோல் மருத்துவம்",
    experience: 9,
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
    expertise: ["Acne", "Eczema", "Pigmentation", "Hair disorders"],
    expertiseTa: ["முகப்பரு", "அரிக்கும் தோல்", "நிறமாற்றம்", "முடி கோளாறுகள்"],
    bio: "Dr. Arjun Menon provides medical dermatology for adults and adolescents, with a practical, stepwise approach to chronic skin disease and patient education.",
    bioTa: "டாக்டர் அர்ஜுன் மேனன் வயதுவந்தோர் மற்றும் இளம் பருவத்தினருக்கான தோல் மருத்துவ சிகிச்சை அளிக்கிறார்.",
    days: [1, 2, 3, 4, 5, 6],
    start: "10:00",
    end: "16:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "lakshmi-krishnan",
    slug: "dr-lakshmi-krishnan",
    name: "Dr. Lakshmi Krishnan",
    nameTa: "டாக்டர் லட்சுமி கிருஷ்ணன்",
    qualifications: "MBBS, MS (ENT)",
    departmentId: "ent",
    speciality: "ENT",
    specialityTa: "காது, மூக்கு, தொண்டை",
    experience: 13,
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    expertise: ["Sinus disease", "Hearing loss", "Paediatric ENT", "Throat infections"],
    expertiseTa: ["சைனஸ் நோய்", "கேட்கும் திறன் குறைவு", "குழந்தை ENT", "தொண்டை தொற்று"],
    bio: "Dr. Lakshmi Krishnan is Consultant ENT Surgeon. She treats sinus, ear and throat conditions and is attentive to paediatric ENT presentations that worry parents.",
    bioTa: "டாக்டர் லட்சுமி கிருஷ்ணன் ENT அறுவை சிகிச்சை ஆலோசகர். சைனஸ், காது மற்றும் தொண்டை நிலைகளுக்கு சிகிச்சை அளிக்கிறார்.",
    days: [1, 2, 3, 4, 5, 6],
    start: "09:30",
    end: "17:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "n-venkatesh",
    slug: "dr-n-venkatesh",
    name: "Dr. N. Venkatesh",
    nameTa: "டாக்டர் என். வெங்கடேஷ்",
    qualifications: "MBBS, MCh (Urology)",
    departmentId: "urology",
    speciality: "Urology",
    specialityTa: "சிறுநீரகவியல்",
    experience: 17,
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    expertise: ["Kidney stones", "Prostate health", "Urinary tract infection", "Male urology"],
    expertiseTa: ["சிறுநீரக கற்கள்", "புரோஸ்டேட் நலன்", "சிறுநீர் பாதை தொற்று", "ஆண் சிறுநீரகவியல்"],
    bio: "Dr. N. Venkatesh is Senior Consultant Urologist with extensive experience in stone disease and prostate care, supported by imaging and laboratory diagnostics.",
    bioTa: "டாக்டர் என். வெங்கடேஷ் மூத்த சிறுநீரகவியல் ஆலோசகர். கல் நோய் மற்றும் புரோஸ்டேட் பராமரிப்பில் அனுபவம் கொண்டவர்.",
    days: [1, 2, 3, 4, 5, 6],
    start: "09:00",
    end: "16:30",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "divya-reddy",
    slug: "dr-divya-reddy",
    name: "Dr. Divya Reddy",
    nameTa: "டாக்டர் திவ்யா ரெட்டி",
    qualifications: "MBBS, DM (Gastroenterology)",
    departmentId: "gastro",
    speciality: "Gastroenterology",
    specialityTa: "இரைப்பை குடல் மருத்துவம்",
    experience: 10,
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80",
    expertise: ["Acidity and reflux", "Liver disease", "IBS", "Endoscopy"],
    expertiseTa: ["அமிலத்தன்மை", "கல்லீரல் நோய்", "ஐபிஎஸ்", "எண்டோஸ்கோபி"],
    bio: "Dr. Divya Reddy is Consultant Gastroenterologist. She manages digestive and liver disorders and advises on diet, investigation and follow-up with clarity.",
    bioTa: "டாக்டர் திவ்யா ரெட்டி இரைப்பை குடல் மருத்துவ ஆலோசகர். செரிமான மற்றும் கல்லீரல் கோளாறுகளுக்கு சிகிச்சை அளிக்கிறார்.",
    days: [1, 2, 3, 4, 5],
    start: "09:00",
    end: "16:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "suresh-babu",
    slug: "dr-suresh-babu",
    name: "Dr. Suresh Babu",
    nameTa: "டாக்டர் சுரேஷ் பாபு",
    qualifications: "MBBS, MD, DM (Pulmonology)",
    departmentId: "pulmonology",
    speciality: "Pulmonology",
    specialityTa: "நுரையீரல் மருத்துவம்",
    experience: 14,
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
    expertise: ["Asthma", "COPD", "Pneumonia", "Chronic cough"],
    expertiseTa: ["ஆஸ்துமா", "சிஓபிடி", "நிமோனியா", "நாள்பட்ட இருமல்"],
    bio: "Dr. Suresh Babu is Consultant Pulmonologist with experience in airway disease and respiratory infections. Pulmonary function testing is used to guide long-term treatment.",
    bioTa: "டாக்டர் சுரேஷ் பாபு நுரையீரல் மருத்துவ ஆலோசகர். சுவாச நோய் மற்றும் தொற்றுகளில் அனுபவம் கொண்டவர்.",
    days: [1, 2, 3, 4, 5, 6],
    start: "09:30",
    end: "17:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "fatima-khan",
    slug: "dr-fatima-khan",
    name: "Dr. Fatima Khan",
    nameTa: "டாக்டர் பாத்திமா கான்",
    qualifications: "MBBS, DM (Nephrology)",
    departmentId: "nephrology",
    speciality: "Nephrology",
    specialityTa: "சிறுநீரக மருத்துவம்",
    experience: 12,
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    expertise: ["Chronic kidney disease", "Hypertension", "Dialysis counselling", "Electrolyte disorders"],
    expertiseTa: ["நாள்பட்ட சிறுநீரக நோய்", "உயர் அழுத்தம்", "டயலிசிஸ் ஆலோசனை", "எலக்ட்ரோலைட் கோளாறுகள்"],
    bio: "Dr. Fatima Khan is Consultant Nephrologist. She focuses on slowing CKD progression, blood pressure control and preparing patients for dialysis when clinically required.",
    bioTa: "டாக்டர் பாத்திமா கான் சிறுநீரக மருத்துவ ஆலோசகர். நாள்பட்ட சிறுநீரக நோய் முன்னேற்றத்தை குறைப்பதில் கவனம் செலுத்துகிறார்.",
    days: [1, 2, 3, 4, 5],
    start: "09:00",
    end: "15:30",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "vijay-kumar",
    slug: "dr-vijay-kumar",
    name: "Dr. Vijay Kumar",
    nameTa: "டாக்டர் விஜய் குமார்",
    qualifications: "MBBS, MS (General Surgery)",
    departmentId: "surgery",
    speciality: "General Surgery",
    specialityTa: "பொது அறுவை சிகிச்சை",
    experience: 19,
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
    expertise: ["Hernia", "Gall bladder disease", "Emergency surgery", "Wound management"],
    expertiseTa: ["ஹெர்னியா", "பித்தப்பை நோய்", "அவசர அறுவை சிகிச்சை", "காய மேலாண்மை"],
    bio: "Dr. Vijay Kumar is Senior Consultant Surgeon with experience in elective and emergency general surgery. He prioritises clear consent, safe peri-operative care and timely discharge planning.",
    bioTa: "டாக்டர் விஜய் குமார் மூத்த அறுவை சிகிச்சை ஆலோசகர். திட்டமிட்ட மற்றும் அவசர பொது அறுவை சிகிச்சையில் அனுபவம் கொண்டவர்.",
    days: [1, 2, 3, 4, 5, 6],
    start: "09:00",
    end: "16:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
  {
    id: "aisha-rahman",
    slug: "dr-aisha-rahman",
    name: "Dr. Aisha Rahman",
    nameTa: "டாக்டர் ஆயிஷா ரஹ்மான்",
    qualifications: "MBBS, MD (Emergency Medicine)",
    departmentId: "emergency",
    speciality: "Emergency Medicine",
    specialityTa: "அவசர மருத்துவம்",
    experience: 8,
    photo: "https://images.unsplash.com/photo-1651009757985-6cb69c509ea0?auto=format&fit=crop&w=800&q=80",
    expertise: ["Trauma triage", "Medical emergencies", "Resuscitation", "Acute care"],
    expertiseTa: ["காய முன்னுரிமை", "மருத்துவ அவசரங்கள்", "மீட்பு சிகிச்சை", "கடுமையான பராமரிப்பு"],
    bio: "Dr. Aisha Rahman leads emergency shifts with structured triage and rapid decision-making. She coordinates with ICU, radiology and on-call specialists for time-critical care.",
    bioTa: "டாக்டர் ஆயிஷா ரஹ்மான் அவசர சிகிச்சை பிரிவில் முன்னுரிமை வகைப்படுத்தல் மற்றும் விரைவான முடிவுகளுடன் பணியாற்றுகிறார்.",
    days: [0, 1, 2, 3, 4, 5, 6],
    start: "09:00",
    end: "17:30",
    lunchStart: "13:00",
    lunchEnd: "14:00",
  },
];

export const PACKAGES: HealthPackage[] = [
  {
    id: "basic",
    slug: "basic-health-checkup",
    name: "Basic Health Checkup",
    nameTa: "அடிப்படை உடல்நல பரிசோதனை",
    suitable: "Adults 18–40 years seeking a yearly baseline review",
    suitableTa: "ஆண்டு அடிப்படை பரிசோதனை தேவைப்படும் 18–40 வயதினர்",
    tests: ["CBC", "Blood sugar (fasting)", "Lipid profile", "Urine routine", "Chest X-ray", "Physician consultation"],
    testsTa: ["சிபிசி", "இரத்த சர்க்கரை (உண்ணாவிரதம்)", "லிப்பிட் புரோஃபைல்", "சிறுநீர் பரிசோதனை", "மார்பு எக்ஸ்ரே", "மருத்துவர் ஆலோசனை"],
    price: 2499,
  },
  {
    id: "advanced",
    slug: "advanced-health-checkup",
    name: "Advanced Health Checkup",
    nameTa: "மேம்பட்ட உடல்நல பரிசோதனை",
    suitable: "Adults with family history of lifestyle disease",
    suitableTa: "வாழ்க்கை முறை நோய் குடும்ப வரலாறு உள்ளவர்கள்",
    tests: ["CBC", "HbA1c", "Lipid profile", "LFT", "KFT", "Thyroid profile", "ECG", "Ultrasound abdomen", "Physician consultation"],
    testsTa: ["சிபிசி", "HbA1c", "லிப்பிட்", "கல்லீரல் பரிசோதனை", "சிறுநீரக பரிசோதனை", "தைராய்டு", "ஈசிஜி", "வயிற்று அல்ட்ராசவுண்ட்", "மருத்துவர் ஆலோசனை"],
    price: 5499,
  },
  {
    id: "executive",
    slug: "executive-health-checkup",
    name: "Executive Health Checkup",
    nameTa: "நிர்வாக உடல்நல பரிசோதனை",
    suitable: "Working professionals 35 years and above",
    suitableTa: "35 வயதுக்கு மேற்பட்ட பணிபுரியும் தொழில்முனைவோர்",
    tests: ["Advanced blood panel", "HbA1c", "Vitamin D & B12", "ECG", "Treadmill test", "2D Echo", "Chest X-ray", "Ultrasound", "Diet counselling", "Physician & specialist review"],
    testsTa: ["மேம்பட்ட இரத்த பரிசோதனை", "HbA1c", "வைட்டமின் டி மற்றும் பி12", "ஈசிஜி", "டிரெட்மில்", "2டி எக்கோ", "மார்பு எக்ஸ்ரே", "அல்ட்ராசவுண்ட்", "உணவு ஆலோசனை", "நிபுணர் மதிப்பீடு"],
    price: 9999,
  },
  {
    id: "women",
    slug: "womens-health-checkup",
    name: "Women's Health Checkup",
    nameTa: "பெண்கள் உடல்நல பரிசோதனை",
    suitable: "Women 21 years and above",
    suitableTa: "21 வயதுக்கு மேற்பட்ட பெண்கள்",
    tests: ["CBC", "Thyroid profile", "Blood sugar", "Vitamin D", "Pap smear (as indicated)", "Ultrasound pelvis", "Gynaecologist consultation"],
    testsTa: ["சிபிசி", "தைராய்டு", "இரத்த சர்க்கரை", "வைட்டமின் டி", "பாப் ஸ்மியர்", "இடுப்பு அல்ட்ராசவுண்ட்", "மகளிர் மருத்துவர் ஆலோசனை"],
    price: 4499,
  },
  {
    id: "senior",
    slug: "senior-citizen-health-checkup",
    name: "Senior Citizen Health Checkup",
    nameTa: "மூத்த குடிமக்கள் உடல்நல பரிசோதனை",
    suitable: "Adults 60 years and above",
    suitableTa: "60 வயதுக்கு மேற்பட்டவர்கள்",
    tests: ["CBC", "HbA1c", "KFT", "LFT", "Lipid profile", "ECG", "Chest X-ray", "Bone profile", "Physician consultation", "Ophthalmology screening"],
    testsTa: ["சிபிசி", "HbA1c", "சிறுநீரக பரிசோதனை", "கல்லீரல்", "லிப்பிட்", "ஈசிஜி", "மார்பு எக்ஸ்ரே", "எலும்பு பரிசோதனை", "மருத்துவர் ஆலோசனை", "கண் பரிசோதனை"],
    price: 6499,
  },
  {
    id: "cardiac",
    slug: "cardiac-health-checkup",
    name: "Cardiac Health Checkup",
    nameTa: "இதய உடல்நல பரிசோதனை",
    suitable: "Adults with cardiac risk factors or family history",
    suitableTa: "இதய ஆபத்து காரணிகள் அல்லது குடும்ப வரலாறு உள்ளவர்கள்",
    tests: ["Lipid profile", "HbA1c", "ECG", "2D Echo", "Treadmill test", "Cardiologist consultation"],
    testsTa: ["லிப்பிட் புரோஃபைல்", "HbA1c", "ஈசிஜி", "2டி எக்கோ", "டிரெட்மில்", "இதய மருத்துவர் ஆலோசனை"],
    price: 7499,
  },
  {
    id: "diabetes",
    slug: "diabetes-screening",
    name: "Diabetes Screening",
    nameTa: "நீரிழிவு பரிசோதனை",
    suitable: "Adults with thirst, fatigue, family history or overweight",
    suitableTa: "தாகம், சோர்வு, குடும்ப வரலாறு அல்லது அதிக எடை உள்ளவர்கள்",
    tests: ["Fasting glucose", "Post-prandial glucose", "HbA1c", "KFT", "Urine microalbumin", "Physician consultation"],
    testsTa: ["உண்ணாவிரத சர்க்கரை", "உணவுக்குப் பின் சர்க்கரை", "HbA1c", "சிறுநீரக பரிசோதனை", "சிறுநீர் மைக்ரோஅல்புமின்", "மருத்துவர் ஆலோசனை"],
    price: 1999,
  },
];

export const SERVICES: HospitalService[] = [
  { id: "diagnostics", name: "Diagnostics", nameTa: "நோயறிதல்", description: "Digital X-ray, ultrasound and CT imaging with timely reporting for OPD, inpatient and emergency care.", descriptionTa: "டிஜிட்டல் எக்ஸ்ரே, அல்ட்ராசவுண்ட் மற்றும் சிடி இமேஜிங் சேவைகள்." },
  { id: "laboratory", name: "Laboratory Services", nameTa: "ஆய்வக சேவைகள்", description: "Haematology, biochemistry and immunology with home sample collection by appointment.", descriptionTa: "இரத்தவியல், உயிர்வேதியியல் மற்றும் வீட்டு மாதிரி சேகரிப்பு." },
  { id: "pharmacy", name: "Pharmacy", nameTa: "மருந்தகம்", description: "A 24-hour in-house pharmacy for inpatients and discharged patients.", descriptionTa: "உள்நோயாளிகள் மற்றும் வெளியேறும் நோயாளிகளுக்கான 24 மணி நேர மருந்தகம்." },
  { id: "ambulance", name: "Ambulance", nameTa: "ஆம்புலன்ஸ்", description: "Advanced life-support ambulance for transfers and emergency pickup within city limits.", descriptionTa: "நகருக்குள் அவசர பிக்அப் மற்றும் பரிமாற்றத்திற்கான ஆம்புலன்ஸ்." },
  { id: "emergency-care", name: "Emergency Care", nameTa: "அவசர சிகிச்சை", description: "24×7 triage, resuscitation and rapid access to imaging, laboratory and ICU.", descriptionTa: "24×7 முன்னுரிமை வகைப்படுத்தல் மற்றும் தீவிர சிகிச்சை அணுகல்." },
  { id: "icu", name: "ICU / Critical Care", nameTa: "ஐசியூ / தீவிர சிகிச்சை", description: "Monitored beds for medical, surgical and post-operative critical illness.", descriptionTa: "மருத்துவ மற்றும் அறுவை தீவிர நோய்களுக்கான கண்காணிப்பு படுக்கைகள்." },
  { id: "physiotherapy", name: "Physiotherapy", nameTa: "உடலியக்க சிகிச்சை", description: "Rehabilitation after orthopaedic injury, stroke and post-surgical recovery.", descriptionTa: "எலும்பு காயம், பக்கவாதம் மற்றும் அறுவை சிகிச்சைக்குப் பின் மறுவாழ்வு." },
  { id: "checkups", name: "Health Checkups", nameTa: "உடல்நல பரிசோதனைகள்", description: "Structured packages from basic screening to executive and cardiac evaluation.", descriptionTa: "அடிப்படை முதல் நிர்வாக மற்றும் இதய மதிப்பீடு வரை கட்டமைக்கப்பட்ட தொகுப்புகள்." },
  { id: "preventive", name: "Preventive Healthcare", nameTa: "தடுப்பு சுகாதாரம்", description: "Lifestyle counselling, immunisation advice and chronic-disease screening.", descriptionTa: "வாழ்க்கை முறை ஆலோசனை மற்றும் நாள்பட்ட நோய் பரிசோதனை." },
  { id: "home-sample", name: "Home Sample Collection", nameTa: "வீட்டு மாதிரி சேகரிப்பு", description: "Phlebotomy at home for registered patients within the hospital catchment.", descriptionTa: "பதிவு செய்யப்பட்ட நோயாளிகளுக்கு வீட்டில் இரத்த மாதிரி சேகரிப்பு." },
  { id: "home-care", name: "Home Healthcare", nameTa: "வீட்டு சுகாதார சேவை", description: "Post-discharge nursing support and physician review by arrangement.", descriptionTa: "வெளியேற்றத்திற்குப் பின் செவிலியர் ஆதரவு மற்றும் மருத்துவர் மதிப்பீடு." },
  { id: "online", name: "Online Consultation", nameTa: "ஆன்லைன் ஆலோசனை", description: "Follow-up video consults for selected specialities after an in-person first visit.", descriptionTa: "தேர்ந்தெடுக்கப்பட்ட துறைகளில் பின்தொடர்தல் வீடியோ ஆலோசனை." },
  { id: "insurance", name: "Insurance / TPA Assistance", nameTa: "காப்பீடு / TPA உதவி", description: "Helpdesk support for cashless authorisation, pre-auth and claim documentation.", descriptionTa: "கேஷ்லெஸ் அனுமதி மற்றும் கோரிக்கை ஆவணங்களுக்கான உதவி." },
  { id: "international", name: "International Patient Services", nameTa: "சர்வதேச நோயாளி சேவைகள்", description: "Appointment coordination, interpreter support and medical reports for overseas patients.", descriptionTa: "வெளிநாட்டு நோயாளிகளுக்கான அப்பாயின்மென்ட் ஒருங்கிணைப்பு மற்றும் மொழிபெயர்ப்பு உதவி." },
];

export function deptById(id: string) {
  return DEPARTMENTS.find((d) => d.id === id);
}

export function doctorBySlug(slug: string) {
  return DOCTORS.find((d) => d.slug === slug);
}

export function doctorsByDept(departmentId: string) {
  return DOCTORS.filter((d) => d.departmentId === departmentId);
}

export function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
