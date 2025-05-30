import mongoose from "mongoose";
import Cars,{ICars} from "../models/Cars.model";


// This script adds car data to a MongoDB database with Arabic brand names and English models.
// Complete car data with Arabic brand names and English models
const carData = [
  // Japanese Brands
  {
    brand: "تويوتا",
    brandEnglish: "Toyota",
    country: "Japan",
    models: [
      "Camry", "Corolla", "RAV4", "Highlander", "Prius", "Land Cruiser", "4Runner", 
      "Tacoma", "Tundra", "Sienna", "Venza", "Avalon", "Yaris", "C-HR", "Sequoia",
      "Prius Prime", "Mirai", "GR Supra", "GR86", "Crown", "bZ4X"
    ]
  },
  {
    brand: "هوندا",
    brandEnglish: "Honda",
    country: "Japan",
    models: [
      "Civic", "Accord", "CR-V", "Pilot", "HR-V", "Passport", "Ridgeline", 
      "Odyssey", "Insight", "Fit", "CR-V Hybrid", "Accord Hybrid", "Pilot Elite"
    ]
  },
  {
    brand: "نيسان",
    brandEnglish: "Nissan",
    country: "Japan",
    models: [
      "Altima", "Sentra", "Versa", "Maxima", "Rogue", "Murano", "Pathfinder", 
      "Armada", "Frontier", "Titan", "Kicks", "Leaf", "Ariya", "370Z", "GT-R"
    ]
  },
  {
    brand: "مازدا",
    brandEnglish: "Mazda",
    country: "Japan",
    models: [
      "Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30", "CX-50", "MX-5 Miata", 
      "MX-30", "CX-90"
    ]
  },
  {
    brand: "سوبارو",
    brandEnglish: "Subaru",
    country: "Japan",
    models: [
      "Outback", "Forester", "Crosstrek", "Impreza", "Legacy", "Ascent", 
      "WRX", "BRZ", "Solterra"
    ]
  },
  {
    brand: "إنفينيتي",
    brandEnglish: "Infiniti",
    country: "Japan",
    models: [
      "Q50", "Q60", "QX50", "QX60", "QX80", "Q70"
    ]
  },
  {
    brand: "أكورا",
    brandEnglish: "Acura",
    country: "Japan",
    models: [
      "TLX", "ILX", "RDX", "MDX", "NSX", "Integra", "ZDX"
    ]
  },
  {
    brand: "لكزس",
    brandEnglish: "Lexus",
    country: "Japan",
    models: [
      "IS", "ES", "LS", "GS", "RC", "LC", "UX", "NX", "RX", "GX", "LX", 
      "RZ", "TX"
    ]
  },
  {
    brand: "ميتسوبيشي",
    brandEnglish: "Mitsubishi",
    country: "Japan",
    models: [
      "Mirage", "Outlander", "Eclipse Cross", "Outlander Sport", "Outlander PHEV"
    ]
  },

  // German Brands
  {
    brand: "بي إم دبليو",
    brandEnglish: "BMW",
    country: "Germany",
    models: [
      "1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", 
      "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", 
      "Z4", "i3", "i4", "iX", "i7"
    ]
  },
  {
    brand: "مرسيدس-بنز",
    brandEnglish: "Mercedes-Benz",
    country: "Germany",
    models: [
      "A-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "G-Class", 
      "GLA", "GLB", "GLC", "GLE", "GLS", "AMG GT", "EQS", "EQE", "EQA", 
      "EQB", "EQC"
    ]
  },
  {
    brand: "أودي",
    brandEnglish: "Audi",
    country: "Germany",
    models: [
      "A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q4", "Q5", "Q7", "Q8", 
      "TT", "R8", "e-tron GT", "Q4 e-tron"
    ]
  },
  {
    brand: "فولكس واجن",
    brandEnglish: "Volkswagen",
    country: "Germany",
    models: [
      "Jetta", "Passat", "Arteon", "Golf", "Golf GTI", "Golf R", "Tiguan", 
      "Atlas", "Atlas Cross Sport", "ID.4", "Taos"
    ]
  },
  {
    brand: "بورشه",
    brandEnglish: "Porsche",
    country: "Germany",
    models: [
      "911", "718 Boxster", "718 Cayman", "Cayenne", "Macan", "Panamera", 
      "Taycan"
    ]
  },
  {
    brand: "مايباخ",
    brandEnglish: "Maybach",
    country: "Germany",
    models: [
      "S-Class", "GLS"
    ]
  },

  // American Brands
  {
    brand: "فورد",
    brandEnglish: "Ford",
    country: "USA",
    models: [
      "F-150", "Ranger", "Maverick", "Mustang", "Mustang Mach-E", "Escape", 
      "Explorer", "Expedition", "Bronco", "Bronco Sport", "Edge", "EcoSport"
    ]
  },
  {
    brand: "شيفروليه",
    brandEnglish: "Chevrolet",
    country: "USA",
    models: [
      "Spark", "Sonic", "Cruze", "Malibu", "Impala", "Camaro", "Corvette", 
      "Equinox", "Blazer", "Traverse", "Tahoe", "Suburban", "Colorado", 
      "Silverado", "Bolt EV", "Bolt EUV"
    ]
  },
  {
    brand: "كاديلاك",
    brandEnglish: "Cadillac",
    country: "USA",
    models: [
      "CT4", "CT5", "XT4", "XT5", "XT6", "Escalade", "Lyriq", "Celestiq"
    ]
  },
  {
    brand: "جي إم سي",
    brandEnglish: "GMC",
    country: "USA",
    models: [
      "Terrain", "Acadia", "Yukon", "Yukon XL", "Canyon", "Sierra 1500", 
      "Sierra 2500HD", "Sierra 3500HD", "Hummer EV"
    ]
  },
  {
    brand: "بويك",
    brandEnglish: "Buick",
    country: "USA",
    models: [
      "Encore", "Encore GX", "Envision", "Enclave"
    ]
  },
  {
    brand: "كرايسلر",
    brandEnglish: "Chrysler",
    country: "USA",
    models: [
      "300", "Pacifica", "Voyager"
    ]
  },
  {
    brand: "دودج",
    brandEnglish: "Dodge",
    country: "USA",
    models: [
      "Charger", "Challenger", "Durango", "Journey", "Grand Caravan", "Hornet"
    ]
  },
  {
    brand: "جيب",
    brandEnglish: "Jeep",
    country: "USA",
    models: [
      "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", 
      "Renegade", "Grand Wagoneer", "Wagoneer", "Avenger"
    ]
  },
  {
    brand: "رام",
    brandEnglish: "Ram",
    country: "USA",
    models: [
      "1500", "2500", "3500", "ProMaster", "ProMaster City"
    ]
  },
  {
    brand: "تيسلا",
    brandEnglish: "Tesla",
    country: "USA",
    models: [
      "Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster"
    ]
  },
  {
    brand: "لينكولن",
    brandEnglish: "Lincoln",
    country: "USA",
    models: [
      "Corsair", "Nautilus", "Aviator", "Navigator", "MKZ", "Continental"
    ]
  },

  // South Korean Brands
  {
    brand: "هيونداي",
    brandEnglish: "Hyundai",
    country: "South Korea",
    models: [
      "Accent", "Elantra", "Sonata", "Azera", "Veloster", "Kona", "Tucson", 
      "Santa Fe", "Palisade", "Nexo", "Ioniq 5", "Ioniq 6", "Santa Cruz"
    ]
  },
  {
    brand: "كيا",
    brandEnglish: "Kia",
    country: "South Korea",
    models: [
      "Rio", "Forte", "K5", "Stinger", "Soul", "Seltos", "Sportage", 
      "Sorento", "Telluride", "Niro", "EV6", "Carnival"
    ]
  },
  {
    brand: "جينيسيس",
    brandEnglish: "Genesis",
    country: "South Korea",
    models: [
      "G70", "G80", "G90", "GV60", "GV70", "GV80", "Electrified G80", 
      "Electrified GV70"
    ]
  },

  // Italian Brands
  {
    brand: "فيات",
    brandEnglish: "Fiat",
    country: "Italy",
    models: [
      "500", "500X", "500L", "Panda", "Tipo", "Punto", "124 Spider"
    ]
  },
  {
    brand: "ألفا روميو",
    brandEnglish: "Alfa Romeo",
    country: "Italy",
    models: [
      "Giulia", "Stelvio", "Tonale", "4C"
    ]
  },
  {
    brand: "مازيراتي",
    brandEnglish: "Maserati",
    country: "Italy",
    models: [
      "Ghibli", "Quattroporte", "Levante", "MC20", "GranTurismo", 
      "GranCabrio", "Grecale"
    ]
  },
  {
    brand: "لامبورغيني",
    brandEnglish: "Lamborghini",
    country: "Italy",
    models: [
      "Huracan", "Aventador", "Urus", "Revuelto"
    ]
  },
  {
    brand: "فيراري",
    brandEnglish: "Ferrari",
    country: "Italy",
    models: [
      "488", "F8 Tributo", "SF90 Stradale", "Roma", "Portofino", "812 Superfast", 
      "LaFerrari", "Purosangue"
    ]
  },

  // British Brands
  {
    brand: "جاغوار",
    brandEnglish: "Jaguar",
    country: "United Kingdom",
    models: [
      "XE", "XF", "XJ", "F-Type", "E-Pace", "F-Pace", "I-Pace"
    ]
  },
  {
    brand: "لاند روفر",
    brandEnglish: "Land Rover",
    country: "United Kingdom",
    models: [
      "Discovery Sport", "Discovery", "Range Rover Evoque", "Range Rover Velar", 
      "Range Rover Sport", "Range Rover", "Defender"
    ]
  },
  {
    brand: "بنتلي",
    brandEnglish: "Bentley",
    country: "United Kingdom",
    models: [
      "Continental GT", "Continental Flying Spur", "Bentayga", "Mulsanne"
    ]
  },
  {
    brand: "رولز رويس",
    brandEnglish: "Rolls-Royce",
    country: "United Kingdom",
    models: [
      "Ghost", "Phantom", "Wraith", "Dawn", "Cullinan", "Spectre"
    ]
  },
  {
    brand: "أستون مارتن",
    brandEnglish: "Aston Martin",
    country: "United Kingdom",
    models: [
      "Vantage", "DB11", "DBS Superleggera", "DBX", "Valkyrie"
    ]
  },
  {
    brand: "مكلارين",
    brandEnglish: "McLaren",
    country: "United Kingdom",
    models: [
      "570S", "600LT", "720S", "750S", "Artura", "P1"
    ]
  },
  {
    brand: "ميني",
    brandEnglish: "Mini",
    country: "United Kingdom",
    models: [
      "Cooper", "Cooper S", "Cooper SE", "Countryman", "Clubman", "Paceman"
    ]
  },

  // French Brands
  {
    brand: "رينو",
    brandEnglish: "Renault",
    country: "France",
    models: [
      "Clio", "Megane", "Scenic", "Captur", "Kadjar", "Koleos", "Talisman", 
      "Zoe", "Twizy"
    ]
  },
  {
    brand: "بيجو",
    brandEnglish: "Peugeot",
    country: "France",
    models: [
      "208", "308", "508", "2008", "3008", "5008", "e-208", "e-2008"
    ]
  },
  {
    brand: "سيتروين",
    brandEnglish: "Citroen",
    country: "France",
    models: [
      "C3", "C4", "C5 Aircross", "Berlingo", "SpaceTourer", "C3 Aircross"
    ]
  },
  {
    brand: "بوغاتي",
    brandEnglish: "Bugatti",
    country: "France",
    models: [
      "Chiron", "Veyron", "Divo", "Centodieci", "La Voiture Noire"
    ]
  },

  // Chinese Brands
  {
    brand: "بي واي دي",
    brandEnglish: "BYD",
    country: "China",
    models: [
      "Atto 3", "Dolphin", "Seal", "Tang", "Han", "Song", "Qin", "Yuan"
    ]
  },
  {
    brand: "جيلي",
    brandEnglish: "Geely",
    country: "China",
    models: [
      "Coolray", "Azkarra", "Tugella", "Okavango", "Emgrand", "Vision"
    ]
  },
  {
    brand: "جريت وول",
    brandEnglish: "Great Wall",
    country: "China",
    models: [
      "Wingle", "Haval H6", "Haval H9", "Ora R1", "WEY VV7"
    ]
  },
  {
    brand: "شيري",
    brandEnglish: "Chery",
    country: "China",
    models: [
      "Tiggo 8", "Tiggo 7", "Tiggo 4", "Arrizo 6", "QQ"
    ]
  },
  {
    brand: "نيو",
    brandEnglish: "NIO",
    country: "China",
    models: [
      "ES8", "ES6", "EC6", "ET7", "ET5", "EL7"
    ]
  },
  {
    brand: "شاومي",
    brandEnglish: "Xiaomi",
    country: "China",
    models: [
      "SU7"
    ]
  },

  // Swedish Brands
  {
    brand: "فولفو",
    brandEnglish: "Volvo",
    country: "Sweden",
    models: [
      "S60", "S90", "V60", "V90", "XC40", "XC60", "XC90", "C40", "EX30", 
      "EX90"
    ]
  },
  {
    brand: "ساب",
    brandEnglish: "Saab",
    country: "Sweden",
    models: [
      "9-3", "9-5", "9-4X"
    ]
  },
  {
    brand: "بولستار",
    brandEnglish: "Polestar",
    country: "Sweden",
    models: [
      "Polestar 1", "Polestar 2", "Polestar 3", "Polestar 4"
    ]
  },

  // Czech Republic
  {
    brand: "شكودا",
    brandEnglish: "Skoda",
    country: "Czech Republic",
    models: [
      "Fabia", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"
    ]
  },

  // Romanian
  {
    brand: "داسيا",
    brandEnglish: "Dacia",
    country: "Romania",
    models: [
      "Sandero", "Logan", "Duster", "Lodgy", "Dokker", "Spring"
    ]
  },

  // Spanish
  {
    brand: "سيات",
    brandEnglish: "Seat",
    country: "Spain",
    models: [
      "Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Mii"
    ]
  },

  // Indian Brands
  {
    brand: "تاتا",
    brandEnglish: "Tata",
    country: "India",
    models: [
      "Nano", "Indica", "Indigo", "Safari", "Sumo", "Nexon", "Harrier", 
      "Altroz", "Tigor"
    ]
  },
  {
    brand: "ماهيندرا",
    brandEnglish: "Mahindra",
    country: "India",
    models: [
      "Scorpio", "XUV500", "Bolero", "Thar", "KUV100", "Marazzo", "XUV300"
    ]
  }
];

// Insert all car data
Cars.insertMany(carData);

console.log(`Inserted ${carData.length} car brands`);
console.log("Database setup complete!");