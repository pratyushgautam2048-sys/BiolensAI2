import {
  UserProfile,
  Allergy,
  MedicalCondition,
  Medication,
  ReportAnalysis,
  EquipmentScan,
  Appointment,
  TimelineItem,
  AppNotification
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_eleanor_vance',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@example.com',
  dateOfBirth: '1984-06-14',
  gender: 'Female',
  bloodGroup: 'A+',
  height: '168 cm',
  weight: '64 kg',
  emergencyContact: {
    name: 'Marcus Vance',
    relationship: 'Spouse',
    phone: '+1 (555) 349-8201'
  },
  createdAt: '2025-01-10T08:00:00Z',
  updatedAt: '2026-09-18T14:30:00Z'
};

export const INITIAL_ALLERGIES: Allergy[] = [
  {
    id: 'alg_1',
    allergy: 'Penicillin',
    reaction: 'Urticaria (hives) & mild facial swelling',
    severity: 'Severe',
    diagnosedDate: '2018-04-12'
  },
  {
    id: 'alg_2',
    allergy: 'Latex',
    reaction: 'Contact dermatitis & itching',
    severity: 'Moderate',
    diagnosedDate: '2021-09-05'
  },
  {
    id: 'alg_3',
    allergy: 'Shellfish',
    reaction: 'Mild gastric upset & tingling',
    severity: 'Mild',
    diagnosedDate: '2016-11-20'
  }
];

export const INITIAL_CONDITIONS: MedicalCondition[] = [
  {
    id: 'cond_1',
    name: 'Primary Mild Hypertension',
    dateDiagnosed: '2022-03-15',
    status: 'Managed',
    notes: 'Monitored daily via home BP cuff. Dietary sodium restriction and regular aerobic walking maintained.',
    type: 'current'
  },
  {
    id: 'cond_2',
    name: 'Mild Seasonal Allergic Rhinitis',
    dateDiagnosed: '2019-05-10',
    status: 'Active',
    notes: 'Flare-ups primarily during springtime pollen spikes. Uses saline rinse.',
    type: 'current'
  },
  {
    id: 'cond_3',
    name: 'Acute Streptococcal Pharyngitis',
    dateDiagnosed: '2023-01-08',
    status: 'Resolved',
    notes: 'Completed full course of non-penicillin antimicrobial therapy. Fully recovered without sequelae.',
    type: 'past'
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med_1',
    name: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Once daily in the morning',
    startDate: '2022-04-01',
    prescribingDoctor: 'Dr. Sarah Jenkins, MD',
    notes: 'For blood pressure control. Patient tolerates well without chronic dry cough.',
    type: 'current'
  },
  {
    id: 'med_2',
    name: 'Cholecalciferol (Vitamin D3)',
    dosage: '2,000 IU',
    frequency: 'Once daily with food',
    startDate: '2024-11-15',
    prescribingDoctor: 'Dr. Sarah Jenkins, MD',
    notes: 'For winter season baseline maintenance.',
    type: 'current'
  },
  {
    id: 'med_3',
    name: 'Azithromycin',
    dosage: '250 mg',
    frequency: 'As prescribed 5-day regimen',
    startDate: '2023-01-08',
    endDate: '2023-01-13',
    prescribingDoctor: 'Dr. Robert Chen, MD',
    notes: 'Resolved strep pharyngitis. Noted penicillin alternative.',
    type: 'past'
  }
];

export const INITIAL_REPORTS: ReportAnalysis[] = [
  {
    id: 'rep_cbc_sample',
    reportTitle: 'Complete Blood Count (CBC) with Differential',
    reportDate: '2026-08-14',
    reportType: 'Hematology Panel',
    fileName: 'CBC_Lab_Report_EleanorVance_2026.pdf',
    fileSize: '1.4 MB',
    isDemo: false,
    summary: 'This routine complete blood count measures your red blood cells, white blood cells, and platelets. The vast majority of markers are well within standard physiological limits, reflecting solid general cellular health, with a slightly elevated platelet count that warrants a quick follow-up conversation.',
    keyFindings: [
      'Hemoglobin (14.1 g/dL) and Hematocrit (41.2%) are healthy and stable.',
      'White blood cell count (6.8 ×10³/µL) is normal, showing no active signs of acute infection.',
      'Platelet count (425 ×10³/µL) is slightly higher than the standard lab ceiling (400 ×10³/µL).',
      'Mean Corpuscular Volume (MCV) is optimal, indicating well-sized red cells.'
    ],
    testResults: [
      {
        testName: 'White Blood Cell Count (WBC)',
        patientValue: 6.8,
        unit: '×10³/µL',
        referenceRange: '4.0 - 11.0',
        status: 'Within range',
        interpretation: 'Within normal baseline; immune cell proliferation is stable.'
      },
      {
        testName: 'Red Blood Cell Count (RBC)',
        patientValue: 4.65,
        unit: '×10⁶/µL',
        referenceRange: '3.90 - 5.20',
        status: 'Within range',
        interpretation: 'Standard oxygen delivery capacity.'
      },
      {
        testName: 'Hemoglobin (Hgb)',
        patientValue: 14.1,
        unit: 'g/dL',
        referenceRange: '12.0 - 15.5',
        status: 'Within range',
        interpretation: 'Healthy iron-carrying protein levels.'
      },
      {
        testName: 'Hematocrit (Hct)',
        patientValue: 41.2,
        unit: '%',
        referenceRange: '36.0 - 46.0',
        status: 'Within range',
        interpretation: 'Normal volume percentage of red cells.'
      },
      {
        testName: 'Platelets (PLT)',
        patientValue: 425,
        unit: '×10³/µL',
        referenceRange: '150 - 400',
        status: 'Above range',
        interpretation: 'Mild reactive thrombocytosis; may stem from recent mild inflammation or minor dehydration.'
      },
      {
        testName: 'Neutrophils',
        patientValue: 58.4,
        unit: '%',
        referenceRange: '45.0 - 75.0',
        status: 'Within range',
        interpretation: 'Standard differential balance.'
      },
      {
        testName: 'Lymphocytes',
        patientValue: 31.2,
        unit: '%',
        referenceRange: '20.0 - 40.0',
        status: 'Within range',
        interpretation: 'Healthy cellular adaptive defense balance.'
      }
    ],
    whatThisMayMean: 'This panel shows overall reassuring blood indices. The single minor elevation in platelet count (425 ×10³/µL vs standard 400 ceiling) can often be associated with mild dehydration, strenuous exercise before testing, or a normal recovery reaction after a minor viral cough. It is typically not an immediate cause for concern, but is a great item to check at your next scheduled visit.',
    questionsForDoctor: [
      'Should we recheck the platelet count during my next routine laboratory panel?',
      'Could recent hydration levels or minor seasonal allergies influence this slight platelet elevation?',
      'Are any lifestyle or dietary adjustments recommended given these overall results?'
    ],
    generalNextSteps: [
      'Maintain steady daily hydration (approx 2 to 2.5 liters of water daily as advised by your physician).',
      'Save this record to your digital file so your primary care physician can compare it against future trends.',
      'Continue taking all prescribed medications exactly as directed by your physician.'
    ],
    urgency: {
      level: 'routine',
      headline: 'Routine follow-up suitable',
      details: 'All critical parameters are stable. No immediate intervention suggested based on this data.'
    },
    analyzedAt: '2026-08-14T10:15:00Z'
  },
  {
    id: 'rep_lipid_sample',
    reportTitle: 'Fasting Lipid & Cardiovascular Risk Panel',
    reportDate: '2026-05-20',
    reportType: 'Metabolic / Lipidology',
    fileName: 'Lipid_Panel_Report_May2026.pdf',
    fileSize: '950 KB',
    isDemo: false,
    summary: 'A standard evaluation of circulating blood lipids after a 10-hour fast. HDL (beneficial cholesterol) is strong, while LDL is borderline elevated, suggesting that dietary fiber additions and heart-healthy unsaturated fats could offer meaningful protection.',
    keyFindings: [
      'Total Cholesterol (208 mg/dL) is slightly above the desirable threshold (<200).',
      'HDL "Protective" Cholesterol (62 mg/dL) is in an excellent, protective range (>50).',
      'LDL "Direct" Cholesterol (126 mg/dL) is in the borderline high bracket (100 - 129).',
      'Triglycerides (102 mg/dL) remain well within the optimal bracket (<150).'
    ],
    testResults: [
      {
        testName: 'Total Cholesterol',
        patientValue: 208,
        unit: 'mg/dL',
        referenceRange: '< 200',
        status: 'Above range',
        interpretation: 'Mildly elevated total circulating cholesterol.'
      },
      {
        testName: 'HDL Cholesterol',
        patientValue: 62,
        unit: 'mg/dL',
        referenceRange: '> 50',
        status: 'Within range',
        interpretation: 'Protective high-density lipoprotein level.'
      },
      {
        testName: 'LDL Cholesterol (Calculated)',
        patientValue: 126,
        unit: 'mg/dL',
        referenceRange: '< 100',
        status: 'Above range',
        interpretation: 'Borderline elevated low-density lipoprotein.'
      },
      {
        testName: 'Triglycerides',
        patientValue: 102,
        unit: 'mg/dL',
        referenceRange: '< 150',
        status: 'Within range',
        interpretation: 'Normal fasting blood triglyceride concentration.'
      }
    ],
    whatThisMayMean: 'This lipid profile reflects strong HDL cholesterol which provides natural vascular protection. The borderline LDL may be influenced by nutritional habits, genetic factors, or physical activity levels. Discussing gentle lifestyle adjustments with your clinician is recommended.',
    questionsForDoctor: [
      'Would dietary modifications such as increasing soluble fiber (oats, legumes, flax) be sufficient before considering therapy?',
      'Does my overall cardiovascular risk score suggest any additional testing, like a coronary calcium score?'
    ],
    generalNextSteps: [
      'Prioritize Mediterranean-style dietary choices with olive oil, fatty fish, and plenty of legumes.',
      'Aim for at least 150 minutes of moderate aerobic activity weekly.',
      'Schedule a retest in 6 to 12 months as recommended by your doctor.'
    ],
    urgency: {
      level: 'routine',
      headline: 'Routine follow-up suitable',
      details: 'Favorable HDL and triglyceride levels provide positive balance.'
    },
    analyzedAt: '2026-05-20T11:40:00Z'
  }
];

export const INITIAL_EQUIPMENT: EquipmentScan[] = [
  {
    id: 'eq_oximeter_sample',
    deviceName: 'Fingertip Pulse Oximeter',
    category: 'Non-Invasive Diagnostic Monitor',
    confidence: 'High',
    confidenceScore: 98,
    whatIsThis: 'A compact, battery-powered medical device that slips onto a fingertip to measure blood oxygen saturation and pulse rate without needles or blood draws.',
    whatIsItUsedFor: 'Commonly used to monitor peripheral blood oxygen levels (SpO2) and heart rate at home or in clinical settings for individuals with respiratory conditions, asthma, or recovering from illnesses.',
    howItWorks: 'It passes two wavelengths of light (red and infrared) through the capillaries of the finger. Oxygenated and deoxygenated blood absorb light at different rates, allowing the photodetector to calculate the saturation percentage and count pulse waves.',
    howToUse: [
      'Sit comfortably and rest your hand on a flat, stable surface for 5 minutes prior to testing.',
      'Ensure the finger is warm, clean, and free of dark nail polish or artificial nails.',
      'Open the clamp and insert your index or middle finger fully until it touches the built-in stopper.',
      'Press the power button and keep your hand completely still for 10–15 seconds.',
      'Read the display once the pulse waveform stabilizes.'
    ],
    requiresProfessionalTraining: false,
    safetyInformation: [
      'Cold fingers, poor peripheral circulation, severe tremors, or artificial nail acrylics can cause inaccurate readings.',
      'A normal resting reading is typically 95% to 100% at sea level for healthy individuals.',
      'If your SpO2 reading falls below 90% or if you experience shortness of breath, confusion, or bluish lips/fingers, seek emergency medical care immediately.',
      'Do not rely solely on the device if you feel unwell.'
    ],
    manufacturerInfo: {
      identifiedManufacturer: 'Wellue / Contec style architecture',
      identifiedModel: 'OLED Dual-Wave Fingertip Monitor',
      notes: 'Standard consumer digital pulse oximeter compliant with CE/FDA clearance standards.',
      checkUserManualNote: 'Please consult the specific manufacturer documentation in your product packaging for battery replacement and sensor calibration instructions.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    scannedAt: '2026-07-12T16:20:00Z'
  },
  {
    id: 'eq_glucometer_sample',
    deviceName: 'Digital Blood Glucose Monitoring System',
    category: 'In Vitro Diagnostic Biosensor',
    confidence: 'High',
    confidenceScore: 95,
    whatIsThis: 'An electronic handheld biosensor system consisting of a meter, single-use test strips, and a spring-loaded lancing device to quantify capillary blood sugar levels.',
    whatIsItUsedFor: 'Assisting individuals diagnosed with diabetes or metabolic conditions in tracking blood glucose response to meals, exercise, and medication regimens.',
    howItWorks: 'A micro-volume of capillary blood touches an enzymatic test strip containing glucose oxidase or dehydrogenase. An electrochemical reaction produces a tiny current proportional to the glucose concentration, which the digital meter measures and translates into mg/dL or mmol/L.',
    howToUse: [
      'Wash your hands thoroughly with warm soap and water, then dry them completely. Avoid alcohol wipes right before testing as they can alter readings.',
      'Insert a fresh test strip into the meter slot until the device automatically powers on.',
      'Use the adjustable lancing device on the side of a fingertip (less sensitive than the center pad).',
      'Gently touch the capillary edge of the test strip to the blood drop until the sampling channel fills.',
      'Review your numerical reading after the 5-second countdown and discard the used strip and lancet safely in a sharps container.'
    ],
    requiresProfessionalTraining: false,
    safetyInformation: [
      'Always dispose of lancets and test strips immediately in a puncture-resistant biohazard sharps bin.',
      'Never reuse test strips or lancets; reusing lancets causes dulling, pain, and heightened infection risk.',
      'If your blood sugar is under 70 mg/dL accompanied by shakiness, diaphoresis, or dizziness, follow the rule of 15 (consume 15g fast-acting carbohydrate) and seek prompt medical attention if it remains low.',
      'Do not adjust prescribed insulin or oral hypoglycemic dosages without prior direction from your endocrinologist or primary care physician.'
    ],
    manufacturerInfo: {
      identifiedManufacturer: 'Contour / Accu-Chek style design',
      identifiedModel: 'Next-Gen Electrochemical Capillary Meter',
      notes: 'No-coding autocalibration model with LCD backlighting.',
      checkUserManualNote: 'Verify your test strip lot code against the meter control solution instructions in the manufacturer user guide.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80',
    scannedAt: '2026-06-04T09:45:00Z'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_1',
    doctor: 'Dr. Sarah Jenkins, MD',
    specialty: 'Internal Medicine & Primary Care',
    date: '2026-10-18',
    time: '10:30 AM',
    location: 'Emerald Health Pavilion, Suite 410',
    notes: 'Annual preventative wellness review. Review Lisinopril efficacy, recent blood pressure log, and repeat CBC lab check.',
    status: 'upcoming'
  },
  {
    id: 'apt_2',
    doctor: 'Dr. Carlos Mendez, MD',
    specialty: 'Cardiology',
    date: '2026-11-04',
    time: '02:15 PM',
    location: 'St. Luke Heart & Vascular Institute',
    notes: 'Periodic evaluation of blood pressure management and cardiovascular risk stratification.',
    status: 'upcoming'
  },
  {
    id: 'apt_3',
    doctor: 'Dr. Sarah Jenkins, MD',
    specialty: 'Internal Medicine & Primary Care',
    date: '2026-04-10',
    time: '11:00 AM',
    location: 'Emerald Health Pavilion, Suite 410',
    notes: 'Routine 6-month checkup. Blood pressure recorded at 124/82 mmHg.',
    status: 'past'
  }
];

export const INITIAL_TIMELINE: TimelineItem[] = [
  {
    id: 'tl_1',
    date: '2026-08-14',
    type: 'report',
    title: 'Complete Blood Count (CBC) Analyzed',
    description: 'All key hematology indices stable; slight platelet variance noted for doctor discussion.',
    badge: 'Lab Report',
    referenceId: 'rep_cbc_sample'
  },
  {
    id: 'tl_2',
    date: '2026-07-12',
    type: 'equipment',
    title: 'Fingertip Pulse Oximeter Scanned',
    description: 'Device recognized with High Confidence. Usage guidelines and safety threshold (SpO2 > 95%) reviewed.',
    badge: 'Equipment',
    referenceId: 'eq_oximeter_sample'
  },
  {
    id: 'tl_3',
    date: '2026-06-04',
    type: 'equipment',
    title: 'Blood Glucose Meter Scanned',
    description: 'Electrochemical capillary meter identified. Step-by-step hygienic testing protocol cataloged.',
    badge: 'Equipment',
    referenceId: 'eq_glucometer_sample'
  },
  {
    id: 'tl_4',
    date: '2026-05-20',
    type: 'report',
    title: 'Lipid & Metabolic Profile Analyzed',
    description: 'HDL optimal (62 mg/dL); borderline LDL (126 mg/dL) identified for dietary optimization.',
    badge: 'Lab Report',
    referenceId: 'rep_lipid_sample'
  },
  {
    id: 'tl_5',
    date: '2026-04-10',
    type: 'appointment',
    title: 'Primary Care Visit Completed',
    description: 'Dr. Sarah Jenkins verified blood pressure stability (124/82 mmHg) on 10mg Lisinopril.',
    badge: 'Clinical Visit'
  },
  {
    id: 'tl_6',
    date: '2025-01-10',
    type: 'profile',
    title: 'BioLens Health Profile Initialized',
    description: 'Personal baseline, known penicillin/latex sensitivities, and health records securely registered.',
    badge: 'Profile'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Upcoming Wellness Visit',
    message: 'Your check-in with Dr. Sarah Jenkins is scheduled for October 18 at 10:30 AM.',
    timestamp: '2 hours ago',
    read: false,
    type: 'appointment'
  },
  {
    id: 'notif_2',
    title: 'Doctor Discussion Guide Ready',
    message: 'Questions have been prepared based on your August CBC lab results.',
    timestamp: '1 day ago',
    read: false,
    type: 'report'
  },
  {
    id: 'notif_3',
    title: 'Medication Adherence Check',
    message: 'Daily Lisinopril (10 mg) reminder: maintain regular morning scheduling.',
    timestamp: '2 days ago',
    read: true,
    type: 'info'
  }
];

export const SAMPLE_REPORTS_FOR_DEMO = [
  {
    id: 'sample_cbc',
    title: 'Complete Blood Count (CBC) with Differential',
    subtitle: 'Standard hematology routine panel with 7 core indicators',
    description: 'Real-world laboratory data testing WBC, RBC, Hemoglobin, Hematocrit, and Platelets.'
  },
  {
    id: 'sample_cmp',
    title: 'Comprehensive Metabolic Panel (CMP)',
    subtitle: 'Electrolytes, Kidney & Liver function markers',
    description: 'Includes Glucose, Creatinine, BUN, Sodium, Potassium, ALT, and AST.'
  },
  {
    id: 'sample_lipid',
    title: 'Fasting Lipid & Cardiovascular Risk Panel',
    subtitle: 'Total Cholesterol, HDL, LDL, and Triglycerides',
    description: 'Evaluates cardiovascular lipid indicators and lifestyle risk balance.'
  }
];

export const SAMPLE_EQUIPMENT_FOR_DEMO = [
  {
    id: 'sample_eq_oximeter',
    title: 'Fingertip Pulse Oximeter',
    category: 'Oxygen & Pulse Monitor',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'Used for non-invasive SpO2 oxygenation and pulse rate monitoring at home.'
  },
  {
    id: 'sample_eq_glucometer',
    title: 'Digital Blood Glucose Meter',
    category: 'Capillary Blood Biosensor',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80',
    description: 'Home blood glucose tracking device with electrochemical test strips.'
  },
  {
    id: 'sample_eq_bp',
    title: 'Automatic Upper-Arm Blood Pressure Monitor',
    category: 'Oscillometric Sphygmomanometer',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    description: 'Oscillometric digital cuff for home blood pressure and pulse monitoring.'
  },
  {
    id: 'sample_eq_nebulizer',
    title: 'Portable Ultrasonic Mesh Nebulizer',
    category: 'Respiratory Inhalation Device',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    description: 'Converts liquid medication into a fine aerosol mist for inhalation into the airways.'
  }
];
