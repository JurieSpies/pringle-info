I want to build a lightweight, mobile-first Progressive Web App (PWA) so residents in the Overstrand area (Kleinmond, Betty's Bay, Pringle Bay, Hermanus) can access emergency contacts and safety checklists instantly.

Please process the dataset below and generate a single-file application (`index.html`) using HTML, Tailwind CSS, and plain JavaScript, along with a basic `manifest.json` file for PWA support.

Requirements:
1. Data Organization: Group all data into clear, collapsible (accordion) sections:
   - 🚨 Immediate Emergency (Fire, Police/SAPS, NSRI, Ambulances, Snake Catchers)
   - 🔥 Fire Readiness Checklist & Action Plans (Structured checklist format)
   - 🩺 Medical & Healthcare Directory (Doctors, Pharmacies, Dentists, Allied Health, Specialists)
   - 🐾 Animals & Wildlife (Vets, Baboons, Marine & Wildlife, Bees, Welfare, Boarding)
   - 🏛️ Municipal & Law Enforcement (Utilities, Anti-poaching, SAPS branches, Overstrand contacts)
2. UI/UX Features:
   - Top search bar to filter contacts by name, service, or location (e.g., 'Kleinmond', 'Snake', 'Dentist').
   - Actionable Buttons: Convert EVERY phone number into direct clickable phone links (`<a href="tel:...">Call</a>`) and URLs into clickable links.
   - Clean, high-contrast, mobile-first layout suitable for high-stress emergency situations.
3. PWA Capabilities: Include inline Service Worker registration code so the app can be installed on phones and work offline once loaded.

Here is the structured dataset to build into the app:

--- DATASET START ---

EMERGENCY & MUNICIPAL SERVICES (OVERSTRAND)
- Fire & Emergency (24/7): 0283122400
- Infrastructure/Municipal Emergencies (24/7): 0283138111
- Overstrand Law Enforcement: 0283138996
- Volunteer Support: 0726168418 | 0741417600
- Community WhatsApp Join Line: 0748238501
- Hermanus Public Protection (HPP): 0875505295
- Onrus/Vermont SRA Emergency: 0794698606
- DFFE Anti-Poaching / Green Scorpions: 0283132703

POLICE (SAPS)
- Kleinmond SAPS: 0282718200 | 0282718202 | 0824436069
- Hermanus Police: 0283135300
- Gansbaai Police: 0283840201
- Stanford Police: 0283410601

SEA RESCUE (NSRI)
- NSRI Station 42 Kleinmond: 0636992765
- NSRI Hermanus: 0829905967

AMBULANCE & LOCAL MEDICS
- BEST (Betty's Bay Emergency Support Team): 0661656061
- PBM (Pringle Bay Medics): 0822328048
- Provincial Ambulance: 10177
- ER24 (Somerset West): 084124
- CMC Critical Medical Care (Kleinmond & Hermanus): 0280010544

DOCTORS & CLINICS
- OneHealth Medical & Wellness Centre (24/7): 0217700053 | 4 Harbour Rd, Kleinmond | www.oec24.com (Drs Siecker, Nunn, Brown)
- Kogelberg Medical Practice: 0639335463 | 2666 Porter Drive, Betty's Bay (Drs Jordaan, Prinsloo) | https://kogelbergmedprac.com/
- Dr Greeff (Betty’s Bay): 0282729999 | A/H: 0826599437
- Dr Audrey Zietsman (Pringle Bay): 0716873825
- Dr Gary Hudson (Kleinmond - WhatsApp only): 0738166763
- Drs Du Plessis, Van Niekerk & Morkel (Kleinmond): 0282714227
- Kleinmond Clinic: 0288143830
- Paediatrician: Dr Japie Roos @ OneHealth Kleinmond: 0280010548

DENTISTS
- Dr Duvenhage: 0282713467 | 0828610616
- Dr Engelbrecht: 0282713662 | 0282713667
- Dr Jolani Klopper: 0282713266 | Online: https://www.mygc.co.za

PHARMACIES
- Pharmacy Betty's Bay: 0280010550 | 0828684267
- Pringle Bay Pharmacy: 0213001716 | Emergency: 0636374430
- Albertyn Pharmacy (Kleinmond): 0282714666 | 0828684267
- The Local Choice Pharmacy (Kleinmond): 0282713320 | 0826524309

ALLIED HEALTHCARE & SPECIALISTS
- Physiotherapy: Marinet (0845492981), Hardus Smith (0660027973), Anita Schröder (Pringle Bay: 0828068192)
- MLD & Massage: Catherine’s Care (Kleinmond: 0784191232)
- Reflexology: Tamora (Betty's Bay: 0824650558)
- Optometry: Philip Obermeyer (Kleinmond: 0282713119 | 0648240702 | oberkleinmond@gmail.com)
- Biokinetics: Elsie Scott (0721389146)
- Dieticians: Licille Slabbert (0817713220), Hilda Woudstra (0836317550)
- Mental Health: Dr. Samuel Gild (Pringle Bay: 0766817135), Hestie Endrödy (Kleinmond: 0828537936), Dr. Zendré Swanepoel (0832274971), Sulene Swanepoel (Play Therapy: 0834437616)
- Breastfeeding: Oystercatcher's Nest / Marie-Louise (0791165630)
- Advanced Wound Care: Karen Wood (0737970381 | kwood56@hotmail.com)
- End-of-Life & Grief: Sitara Doula / Marie-Louise (0791165630)

ANIMALS, SNAKES & WILDLIFE
- Vets: Dr. Floris Kruger (0288800094 | A/H: 0645277346), Dr. Peter Dave (0282714183 | A/H: 0725649903)
- Snake Removal: Michelle Watson (0733140674), Edward Olivier (Kleinmond: 0686007903), Johan Westland (Kleinmond: 0664995087), Marcus Butler (Pringle Bay: 0646113893), Jonathan Powers (Hermanus: 0823526000), Corné Uys (0760758004), Hugo Uys (0624825410). Snakebite Assistance: Arno Naude (0837399303)
- Bee & Wasp Removal: Gys Boonzaaier (0832255695), Deon Pretorius (0726563981), Sunra Mosterd (0833847820), Inge de Villiers (0768271245), Cape Honey Bee Conservancy (Lourens/Dylan: 0765648119)
- Wildlife/Marine Rescue: Kogelberg Wildlife Rescue (Michelle Watson: 0733140674), Cape Nature Duty Phone (0827838585), Cape Nature Office (0870879262), Cape Nature Stony Point (0823191646), Sick Seabirds (Gavin: 0736820697), Stranded Sea Turtles (0833001663), Bird Flu Reporting SANCCOB (0786383731)
- Animal Welfare & Law: KAWS (0282715004 | Emergency: 0797394354), Loose Dogs (0283138996)
- Baboon Hotlines: Main Hotline (0691515962), Renee Bish (0606567341), Elsa Jacobs (0832837362)
- Pet Boarding & Services: Rivendell Kennels (0282849801), Honingklip Cattery (0711365307), Heart2Soul Communication (0636363216), Pet Loss Counselor (0791165630)

FIRE READINESS CHECKLIST (DISPLAY AS ACCORDION OR TAB):
- Before Emergency: Verify property insurance & photos; microchip pets; plan for power outages.
- Property Defense: Keep fire-wise garden & defendable space; maintain clear gutters; move wood/flammables away; attach hoses to taps; clear fire truck access; clear nearest fire hydrant.
- Gear & Protection: Fire extinguishers, blankets, beaters; protective gear (leather boots, gloves, broad hats, filter masks, goggles, eye drops); torches/headlamps with extra batteries.
- Supplies: First aid kit + burn dressings + meds; candles/matches; 3-day non-perishable food; 5L bottled water per person/day.
- Evacuation & Defense Action: Watch Overstrand/WhatsApp notifications; assign family tasks; inform zone manager; prep property even if evacuating (wet decks/frames, turn off gas, close windows, wet towels under doors, leave gates open).
- Vehicle Prep: Full fuel tank; pack water, first aid, wool blanket, area map.

--- DATASET END ---
