/* Pringle Info — Overstrand Emergency & Community Directory
   Structured contact data. Edit here to add or change entries.
   Fields the renderer displays (index.html):
     t    = title        m  = meta line (address/town summary)
     n    = dial rows     n[] = { d: number, l: label }
     note = extra info (emails & URLs here auto-linkify into clickable links)
     gps  = [lat, lng]    gloc = short label shown in the GPS box
   gps + gloc together build a "GPS · <gloc>" row with a Google-Maps
   navigate button on each card. town can also resolve from t/m.
   firstAid.groups[].guides[] — quick first-aid steps for medical emergencies:
     t = title   e = emoji label   signs[] = recognise it   do[] = short actions in order
     dont[] = common mistakes to avoid   call[] = { d, l } numbers to dial for that scenario
   helplines.entries[] — national SA toll-free numbers (same { t, n[] } shape as a category card).
   All first-aid content distilled from AHA, Red Cross, St John Ambulance, ERC & WHO guidance.
   Research note: verified details added from official sites (Overstrand
   municipality, SAPS, NSRI, practices, Medpages registry). Individual
   mobile/WhatsApp-only practitioners have no public web presence and are
   left with their original data only.
*/
const APP = {
    name: "Pringle Info by Jurie Spies",
    subtitle: "Overstrand · Coastal Directory",

    // Always-visible emergency strip (one tap to call)
    lifeline: [
        { l: "Fire & Rescue", d: "028 312 2400", s: "Fire & Rescue Services" },
        { l: "Ambulance", d: "10177", s: "Provincial · 24/7" },
        {
            l: "Police",
            d: "028 271 8200",
            s: "SAPS Kleinmond · crimes in progress",
        },
        { l: "Municipal", d: "028 313 8111", s: "Infrastructure · 24/7" },
    ],

    categories: [
        {
            id: "response",
            num: "01",
            t: "Fire & Emergency Response",
            intro: "Community teams respond in their immediate area. Call your local team first, then Fire or Ambulance.",
            entries: [
                {
                    id: "best",
                    t: "BEST",
                    m: "Betty's Bay Emergency Support Team",
                    n: [{ d: "066 165 6061", l: "Emergency" }],
                },
                {
                    id: "pbm",
                    t: "PBM — Pringle Bay Medics",
                    m: "Pringle Bay",
                    n: [{ d: "082 232 8048", l: "Emergency" }],
                    note: "Responds only to emergencies in their immediate area.",
                },
                {
                    id: "volunteers",
                    t: "Volunteer Assistance",
                    m: "Community volunteers",
                    n: [{ d: "072 616 8418" }, { d: "074 141 7600" }],
                },
                {
                    id: "whatsapp",
                    t: "Community WhatsApp Groups",
                    n: [{ d: "074 823 8501", l: "Join for notifications" }],
                    note: "Local emergency notifications for the area.",
                },
            ],
        },
        {
            id: "medical",
            num: "02",
            t: "Medical & Clinics",
            intro: "Ambulances: Provincial 10177 · ER24 084 124 · CMC 028 001 0544.",
            entries: [
                {
                    id: "er24",
                    t: "ER24 Ambulance",
                    m: "Somerset West",
                    n: [{ d: "084 124", l: "Emergency" }],
                    note: "er24.co.za",
                },
                {
                    id: "cmc",
                    t: "CMC Critical Medical Care",
                    m: "Kleinmond & Hermanus",
                    n: [{ d: "028 001 0544", l: "Emergency" }],
                },
                {
                    id: "onehealth",
                    t: "OneHealth Medical & Wellness Centre",
                    m: "24/7 · 4 Harbour Rd, Kleinmond",
                    n: [{ d: "021 770 0053", l: "Main" }],
                    note: "Drs Leon Siecker, Tim Nunn, Eileen Brown · 4 Harbour Rd, Kleinmond 7195 · oec24.com · onehealthreception@oec24.com · hours Mon–Fri 8–5, Sat 8–1, Sun & hols 10–12 (emergency always 24/7)",
                    // Real GPS (OSM): 4 Harbour Rd, Kleinmond
                    gps: [-34.341858, 19.013405],
                    gloc: "Kleinmond · Harbour Rd",
                },
                {
                    id: "roos",
                    t: "Dr Japie Roos",
                    m: "Paediatrician · @ OneHealth, Kleinmond",
                    n: [{ d: "028 001 0548", l: "Surgery" }],
                    note: "028 001 0548 is a OneHealth/OEC24 contact line.",
                },
                {
                    id: "clinic",
                    t: "Kleinmond Clinic",
                    m: "State clinic",
                    n: [{ d: "028 814 3830", l: "Tel" }],
                    note: "Cnr Protea & Main Rd, Kleinmond · also 028 271 5807 (Medpages)",
                    gloc: "Kleinmond",
                },
                {
                    id: "kogelberg",
                    t: "Kogelberg Medical Practice",
                    m: "2666 Porter Drive, Betty's Bay",
                    n: [{ d: "063 933 5463", l: "Reception" }],
                    note: "Drs Jordaan & Prinsloo · kogelbergmedprac.com · kogelbergmedicalpractice@gmail.com · Mon–Fri 8–5 · online bookings: kogelbergmedprac.com",
                    // Real GPS (OSM): Porter Dr, Betty's Bay
                    gps: [-34.365046, 18.888279],
                    gloc: "Betty's Bay · Porter Dr",
                },
                {
                    id: "greeff",
                    t: "Dr Greeff",
                    m: "Betty's Bay",
                    n: [
                        { d: "028 272 9999", l: "Surgery" },
                        { d: "082 659 9437", l: "After hours" },
                    ],
                },
                {
                    id: "zietsman",
                    t: "Dr Audrey Zietsman",
                    m: "Pringle Bay",
                    n: [{ d: "071 687 3825", l: "Tel" }],
                },
                {
                    id: "hudson",
                    t: "Dr Gary Hudson",
                    m: "Kleinmond",
                    n: [{ d: "073 816 6763", l: "WhatsApp only" }],
                },
                {
                    id: "duplessis",
                    t: "Drs Du Plessis, Van Niekerk & Morkel",
                    m: "Kleinmond",
                    n: [{ d: "028 271 4227", l: "Tel" }],
                },
            ],
        },
        {
            id: "dentists",
            num: "03",
            t: "Dentists",
            intro: "Online bookings: mygc.co.za",
            entries: [
                {
                    id: "duvenhage",
                    t: "Dr Duvenhage",
                    n: [
                        { d: "028 271 3467", l: "Tel" },
                        { d: "082 861 0616", l: "Mobile" },
                    ],
                },
                {
                    id: "engelbrecht",
                    t: "Dr Engelbrecht",
                    n: [
                        { d: "028 271 3662", l: "Tel" },
                        { d: "028 271 3667", l: "Alt" },
                    ],
                },
                {
                    id: "klopper",
                    t: "Dr Jolani Klopper",
                    n: [{ d: "028 271 3266", l: "Tel" }],
                },
            ],
        },
        {
            id: "pharmacies",
            num: "04",
            t: "Pharmacies",
            entries: [
                {
                    id: "pharmbb",
                    t: "Pharmacy Betty's Bay",
                    n: [
                        { d: "028 001 0550", l: "Tel" },
                        { d: "082 868 4267", l: "Mobile" },
                    ],
                },
                {
                    id: "pharmpb",
                    t: "Pringle Bay Pharmacy",
                    n: [
                        { d: "021 300 1716", l: "Tel" },
                        { d: "063 637 4430", l: "Emergency" },
                    ],
                },
                {
                    id: "albertyn",
                    t: "Albertyn Pharmacy",
                    m: "At Spar, Kleinmond",
                    n: [
                        { d: "028 271 4666", l: "Tel" },
                        { d: "082 868 4267", l: "Mobile" },
                    ],
                    note: "Shop 1A & 4 Spar Centre, Botriver Rd, Kleinmond 7195",
                    // Real GPS (OSM): Spar complex on Main Rd, Kleinmond
                    gps: [-34.33972, 19.032666],
                    gloc: "Kleinmond · Main Rd · Spar",
                },
                {
                    id: "localchoice",
                    t: "The Local Choice Pharmacy",
                    m: "Kleinmond",
                    n: [
                        { d: "028 271 3320", l: "Tel" },
                        { d: "082 652 4309", l: "Mobile" },
                    ],
                },
            ],
        },
        {
            id: "allied",
            num: "05",
            t: "Allied Health & Therapies",
            entries: [
                {
                    id: "marinet",
                    t: "Marinet — Dial a Physio",
                    m: "Physiotherapy · Kleinmond",
                    n: [{ d: "084 549 2981", l: "Tel" }],
                },
                {
                    id: "hardus",
                    t: "Hardus Smith",
                    m: "Physiotherapy · Kleinmond",
                    n: [{ d: "066 002 7973", l: "Tel" }],
                },
                {
                    id: "schroder",
                    t: "Anita Schröder",
                    m: "Schröder Physiotherapy Inc · Pringle Bay",
                    n: [{ d: "082 806 8192", l: "Tel" }],
                },
                {
                    id: "catherine",
                    t: "Catherine's Care — Catherine Rowe",
                    m: "MLD & therapeutic massage · Kleinmond Central",
                    n: [{ d: "078 419 1232", l: "Tel" }],
                    note: "Manual Lymphatic Drainage; remedial massage for neck, shoulder & back tension.",
                },
                {
                    id: "tamora",
                    t: "Tamora",
                    m: "Therapeutic foot massage / reflexology · Kogelberg Medical Centre, Betty's Bay",
                    n: [{ d: "082 465 0558", l: "WhatsApp for appointment" }],
                },
                {
                    id: "obermeyer",
                    t: "Philip Obermeyer",
                    m: "Optometrist · 17 Spar Centre, Kleinmond",
                    n: [
                        { d: "028 271 3119", l: "Tel" },
                        { d: "064 824 0702", l: "Mobile" },
                    ],
                    note: "oberkleinmond@gmail.com",
                    // Real GPS (OSM): Spar complex on Main Rd, Kleinmond
                    gps: [-34.33972, 19.032666],
                    gloc: "Kleinmond · Main Rd · Spar",
                },
                {
                    id: "elsie",
                    t: "Elsie Scott",
                    m: "Biokineticist",
                    n: [{ d: "072 138 9146", l: "Tel" }],
                },
                {
                    id: "licille",
                    t: "Licille Slabbert",
                    m: "Dietician",
                    n: [{ d: "081 771 3220", l: "Tel" }],
                },
                {
                    id: "hilda",
                    t: "Hilda Woudstra",
                    m: "Dietician",
                    n: [{ d: "083 631 7550", l: "Tel" }],
                },
                {
                    id: "gild",
                    t: "Dr Samuel Gild",
                    m: "Counsellor — person-centred, individuals & couples · William Avenue, Pringle Bay (or online)",
                    n: [{ d: "+27 76 681 7135", l: "Tel" }],
                    note: "samgild.com · sam.gild@gmail.com",
                    // Real GPS (OSM): William Ave, Pringle Bay
                    gps: [-34.34608, 18.834528],
                    gloc: "Pringle Bay · William Ave",
                },
                {
                    id: "endrody",
                    t: "Hestie Endrödy",
                    m: "Clinical psychologist · 41 Main Rd, Kleinmond",
                    n: [{ d: "082 853 7936", l: "Tel" }],
                    // Real GPS (OSM): Main Rd, Kleinmond
                    gps: [-34.340094, 19.030624],
                    gloc: "Kleinmond · Main Rd",
                },
                {
                    id: "swanepoel",
                    t: "Dr Zendré Swanepoel",
                    m: "Psychologist",
                    n: [{ d: "083 227 4971", l: "Tel" }],
                    note: "Depression & anxiety, couples therapy, child assessments.",
                },
                {
                    id: "sulene",
                    t: "Sulene Swanepoel",
                    m: "Play therapist",
                    n: [{ d: "083 443 7616", l: "Tel" }],
                    note: "Children 3–12: emotional, developmental & adjustment support.",
                },
                {
                    id: "oystercatcher",
                    t: "Oystercatcher's Nest",
                    m: "Breastfeeding support",
                    n: [{ d: "079 116 5630", l: "Tel" }],
                    note: "Marie-Louise · home visits, 1-on-1 antenatal classes, support groups.",
                },
                {
                    id: "karenwood",
                    t: "Karen Wood",
                    m: "Private nurse practitioner — advanced wound care",
                    n: [{ d: "073 797 0381", l: "Tel" }],
                    note: "kwood56@hotmail.com",
                },
                {
                    id: "sitara",
                    t: "Sitara — End-of-Life Doula & Grief Support",
                    n: [{ d: "079 116 5630", l: "Tel" }],
                    note: "Marie-Louise · legacy work, grief support, Death Cafes.",
                },
            ],
        },
        {
            id: "animals",
            num: "06",
            t: "Animals & Wildlife",
            entries: [
                {
                    id: "kruger",
                    t: "Dr Floris Kruger",
                    m: "Veterinarian — general & wildlife",
                    n: [
                        { d: "028 880 0094", l: "Tel" },
                        { d: "064 527 7346", l: "After hours" },
                    ],
                },
                {
                    id: "dave",
                    t: "Dr Peter Dave",
                    m: "Veterinarian",
                    n: [
                        { d: "028 271 4183", l: "Tel" },
                        { d: "072 564 9903", l: "After hours" },
                    ],
                },
                {
                    id: "wildlife",
                    t: "Kogelberg Wildlife Rescue Centre",
                    m: "Michelle Watson",
                    n: [{ d: "073 314 0674", l: "Rescue" }],
                },
                {
                    id: "capenature",
                    t: "Cape Nature",
                    n: [
                        { d: "082 783 8585", l: "Duty phone" },
                        { d: "087 087 9262", l: "Office hours" },
                        { d: "082 319 1646", l: "Stony Point" },
                    ],
                    note: "Overberg Landscape Office: 16 17th Ave, Voëlklip, Hermanus · 028 314 0062 · capenature.co.za · customercare@capenature.co.za · Mon–Fri 07:30–16:30, Sat 8–12",
                    gps: [-34.421, 19.241],
                    gloc: "Hermanus · Overberg office",
                },
                {
                    id: "seabirds",
                    t: "Sick Sea Birds",
                    m: "Gavin",
                    n: [{ d: "073 682 0697", l: "Tel" }],
                },
                {
                    id: "turtles",
                    t: "Stranded Sea Turtle Rescue",
                    n: [{ d: "083 300 1663", l: "Hotline" }],
                    note: "Do not put stranded turtles back into the water.",
                },
                {
                    id: "birdflu",
                    t: "Bird Flu Reporting — SANCCOB",
                    n: [{ d: "078 638 3731", l: "Report" }],
                    note: "Found a dead bird? Send a photo with a GPS pin to track bird flu. Also 021 557 6155 (daytime) · sanccob.co.za · 24/7 rescue",
                },
                {
                    id: "kaws",
                    t: "KAWS — Kleinmond Animal Welfare Society",
                    n: [
                        { d: "028 271 5004", l: "Office hours" },
                        { d: "079 739 4354", l: "After hours" },
                    ],
                },
                {
                    id: "doglaw",
                    t: "Law Enforcement",
                    m: "Report loose or mistreated dogs",
                    n: [{ d: "028 313 8996", l: "Report" }],
                    note: "Overstrand municipal Law Enforcement · municipal services 24/7 028 313 8111 · switchboard 028 313 8000 · enquiries@overstrand.gov.za",
                    gps: [-34.4176194, 19.2365405],
                    gloc: "Hermanus · Overstrand HQ",
                },
                {
                    id: "baboons",
                    t: "Baboon Hotline",
                    m: "Kleinmond · Betty's Bay · Pringle Bay",
                    n: [{ d: "069 151 5962", l: "Hotline" }],
                    note: "Overstrand Baboon Hotline — report via WhatsApp (messages/voice notes/photos/location pins, not calls). Include exact address, time & troop details. overstrand.gov.za",
                },
                {
                    id: "renee",
                    t: "Renee Bish",
                    m: "Betty's Bay",
                    n: [{ d: "060 656 7341", l: "Tel" }],
                },
                {
                    id: "elsaj",
                    t: "Elsa Jacobs",
                    n: [{ d: "083 283 7362", l: "Tel" }],
                },
                {
                    id: "rivendell",
                    t: "Rivendell Kennels",
                    m: "Boarding",
                    n: [{ d: "028 284 9801", l: "Tel" }],
                },
                {
                    id: "honingklip",
                    t: "Honingklip Cattery",
                    m: "Boarding",
                    n: [{ d: "071 136 5307", l: "Tel" }],
                },
                {
                    id: "heart2soul",
                    t: "Heart2Soul Connection — Gayle",
                    m: "Animal communication services",
                    n: [{ d: "063 636 3216", l: "Tel" }],
                    note: "heart2soulconnection.com · info@heart2soulconnection.com",
                },
                {
                    id: "petloss",
                    t: "Pet Loss Counsellor",
                    m: "Marie-Louise",
                    n: [{ d: "079 116 5630", l: "Tel" }],
                },
            ],
        },
        {
            id: "snakes",
            num: "07",
            t: "Snake Removal",
            alert: [
                "Rescuers charge a service fee.",
                "Keep 3–5 m between you and the snake — never corner it. Stay calm and keep your eyes on it from a safe distance until the catcher arrives.",
                "Deadly snakes in the Overstrand: Puff Adder · Cape Cobra · Rinkhals · Boomslang. In the unlikely event of a snakebite, seek emergency medical attention immediately.",
            ],
            entries: [
                {
                    id: "mwatson",
                    t: "Michelle Watson",
                    m: "Kogelberg Wildlife Rescue Centre",
                    n: [{ d: "073 314 0674", l: "Removal" }],
                },
                {
                    id: "olivier",
                    t: "Edward Olivier",
                    m: "Kleinmond",
                    n: [{ d: "068 600 7903", l: "Removal" }],
                },
                {
                    id: "westland",
                    t: "Johan Westland",
                    m: "Kleinmond",
                    n: [{ d: "066 499 5087", l: "Removal" }],
                },
                {
                    id: "butler",
                    t: "Marcus Butler",
                    m: "Pringle Bay",
                    n: [{ d: "064 611 3893", l: "Removal" }],
                },
                {
                    id: "powers",
                    t: "Jonathan Powers",
                    m: "Hermanus area",
                    n: [{ d: "082 352 6000", l: "Removal" }],
                },
                {
                    id: "cuy",
                    t: "Corné Uys",
                    m: "Hermanus area",
                    n: [{ d: "076 075 8004", l: "Removal" }],
                },
                {
                    id: "huy",
                    t: "Hugo Uys",
                    m: "Hermanus area",
                    n: [{ d: "062 482 5410", l: "Removal" }],
                },
                {
                    id: "naude",
                    t: "Arno Naude",
                    m: "Snakebite assistance",
                    n: [{ d: "083 739 9303", l: "Assistance" }],
                },
            ],
        },
        {
            id: "bees",
            num: "08",
            t: "Bee & Wasp Removal",
            alert: [
                "These services charge for their work.",
                "The Cape Honey Bee Conservancy focuses on saving local bees and removing German & European wasps, using an eco-friendly solution.",
            ],
            entries: [
                {
                    id: "boonzaaier",
                    t: "Gys Boonzaaier",
                    n: [{ d: "083 225 5695", l: "Removal" }],
                },
                {
                    id: "pretorius",
                    t: "Deon Pretorius",
                    n: [{ d: "072 656 3981", l: "Phone only" }],
                },
                {
                    id: "mosterd",
                    t: "Sunra Mosterd",
                    n: [{ d: "083 384 7820", l: "Removal" }],
                },
                {
                    id: "devilliers",
                    t: "Inge de Villiers",
                    n: [{ d: "076 827 1245", l: "Removal" }],
                },
                {
                    id: "conservancy",
                    t: "Cape Honey Bee Conservancy",
                    m: "Lourens / Dylan Kruger",
                    n: [{ d: "076 564 8119", l: "Bee & wasp removal" }],
                    note: "Eco-friendly solutions.",
                },
            ],
        },
        {
            id: "sea",
            num: "09",
            t: "Sea Rescue & Marine",
            intro: "The NSRI is South Africa's sea rescue institute — call for emergencies on or near the water.",
            entries: [
                {
                    id: "nsrik",
                    t: "NSRI Station 42",
                    m: "Kleinmond",
                    n: [{ d: "063 699 2765", l: "Sea rescue" }],
                    note: "nsri.org.za/rescue/base/kleinmond/ · info@searescue.org.za · 24/7 volunteer station",
                    gps: [-34.34366559, 19.01489944],
                    gloc: "Kleinmond",
                },
                {
                    id: "nsrih",
                    t: "NSRI",
                    m: "Hermanus",
                    n: [{ d: "082 990 5967", l: "Sea rescue" }],
                    note: "NSRI Hermanus is Station 17 (not 5) · nsri.org.za/rescue/base/hermanus/ · info@searescue.org.za · 24/7 volunteer station",
                    gps: [-34.433417, 19.22515],
                    gloc: "Hermanus",
                },
            ],
        },
        {
            id: "municipal",
            num: "10",
            t: "Municipal & Reporting",
            alert: [
                "When you report, include: exact location (beach name or GPS pin) · what you see (divers, bags of marine life, suspicious boats) · descriptions (number of people, clothing, vehicles, boat registration numbers).",
            ],
            entries: [
                {
                    id: "infra",
                    t: "Infrastructure Emergencies",
                    m: "Municipal · 24/7/365",
                    n: [{ d: "028 313 8111", l: "Emergency" }],
                    note: "Or report via the Overstrand Collab Citizen App · enquiries@overstrand.gov.za · overstrand.gov.za · HQ Magnolia St, Hermanus 7200",
                    gps: [-34.4176194, 19.2365405],
                    gloc: "Hermanus · Overstrand HQ",
                },
                {
                    id: "lawenforce",
                    t: "Overstrand Law Enforcement",
                    n: [{ d: "028 313 8996", l: "Tel" }],
                    note: "overstrand.gov.za · 24/7",
                    gps: [-34.4176194, 19.2365405],
                    gloc: "Hermanus · Overstrand HQ",
                },
                {
                    id: "dffe",
                    t: "DFFE — Poaching / Green Scorpions",
                    m: "Forestry, Fisheries & the Environment",
                    n: [{ d: "028 313 2703", l: "Report" }],
                    note: "Marine & Coastal Management · report poaching",
                },
                {
                    id: "hpp",
                    t: "HPP — Hermanus Public Protection",
                    n: [{ d: "087 550 5295", l: "Tel" }],
                    gloc: "Hermanus · Cliff Path",
                },
                {
                    id: "onrus",
                    t: "Onrus / Vermont SRA Emergency",
                    n: [{ d: "079 469 8606", l: "Emergency" }],
                    gloc: "Onrus · Vermont",
                },
                {
                    id: "sapsk",
                    t: "Kleinmond SAPS",
                    n: [
                        { d: "028 271 8200", l: "Tel" },
                        { d: "028 271 8202", l: "Alt" },
                        { d: "082 443 6069", l: "Mobile" },
                    ],
                    note: "Immediate crimes in progress · 16 Main Rd, Kleinmond 7195 · KLEINMONDSAPS@saps.gov.za",
                    gps: [-34.33963, 19.03232],
                    gloc: "Kleinmond",
                },
                {
                    id: "sapsh",
                    t: "Hermanus Police",
                    n: [{ d: "028 313 5300", l: "Tel" }],
                    note: "61 Main Rd, Hermanus 7200 · HermanusSAPS@saps.gov.za",
                    gps: [-34.41859, 19.23623],
                    gloc: "Hermanus",
                },
                {
                    id: "sapsg",
                    t: "Gansbaai Police",
                    n: [{ d: "028 384 0201", l: "Tel" }],
                    note: "16 Main St, Gansbaai 7220 · GANSBAAISAPS@saps.gov.za",
                    gps: [-34.57818, 19.35139],
                    gloc: "Gansbaai",
                },
                {
                    id: "sapss",
                    t: "Stanford Police",
                    n: [{ d: "028 341 0601", l: "Tel" }],
                    note: "6 Du Toit St, Stanford 7210 · StanfordSAPS@saps.gov.za",
                    gps: [-34.43881, 19.45789],
                    gloc: "Stanford",
                },
                {
                    id: "web",
                    t: "Overstrand Important Numbers",
                    m: "Municipal website",
                    n: [],
                    note: "Full list: overstrand.gov.za/important-numbers-2 · Switchboard 028 313 8000 · enquiries@overstrand.gov.za · Fire & Rescue 028 312 2400 · Traffic 028 313 1044 · HQ Magnolia St, Hermanus",
                },
            ],
        },
    ],

    // First aid quick guides — medical emergencies, distilled into very short,
    // one-line steps so a person can act under stress. Frontend: render each
    // group as an accordion, each guide as a card (summary open / steps expandable).
    firstAid: {
        intro: "Read these BEFORE you need them — under stress you'll act faster. In any life-threatening emergency call Provincial Ambulance 10177 or ER24 084 124 first.",
        groups: [
            {
                id: "cardiac",
                t: "Cardiac & Breathing",
                guides: [
                    {
                        id: "heart-attack",
                        t: "Heart Attack",
                        e: "💓",
                        signs: [
                            "Crushing chest pain spreading to arm, jaw or back",
                            "Shortness of breath with cold, clammy skin",
                            "Nausea, dizziness, sweating, sense of doom",
                            "Women/elderly may show only fatigue or breathlessness",
                        ],
                        do: [
                            "Call 10177 / ER24 084 124 now — never wait to see",
                            "Sit them down, lean slightly forward, keep them calm",
                            "Give 2× 150 mg aspirin to chew (if not allergic, adult)",
                            "Loosen tight clothing; monitor breathing",
                            "Be ready to start CPR if they collapse",
                        ],
                        dont: [
                            "Don't let them walk, exert, or 'sleep it off'",
                            "Don't give food or drink (except aspirin + water)",
                            "Don't let them drive themselves to hospital",
                            "No aspirin if allergic, bleeding, or under 16",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "cardiac-arrest",
                        t: "Cardiac Arrest & CPR",
                        e: "💗",
                        signs: [
                            "Collapses suddenly, unresponsive",
                            "Not breathing, or only gasping",
                            "No response to shout or shake — limp, no pulse",
                        ],
                        do: [
                            "Call 10177 / 084 124 and put on speaker",
                            "Send someone for the nearest AED",
                            "Lay flat on firm surface; kneel beside chest",
                            "Heel of one hand centre of chest, other on top, fingers locked",
                            "Arms straight — press 5–6 cm deep, 100–120/min",
                            "Let chest fully recoil each press (hands-only is fine)",
                            "If trained: give 2 breaths after every 30 compressions (30:2)",
                            "Use the AED: follow its voice prompts, stand clear to shock",
                            "Don't stop except for the AED / until help arrives",
                        ],
                        dont: [
                            "Don't stop compressions longer than 10 seconds",
                            "Don't lean on the chest — let it recoil fully",
                            "Don't touch them while the AED analyses or shocks",
                            "Don't use an AED in water or on a wet chest",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "choking",
                        t: "Choking (Adult & Child)",
                        e: "🗣️",
                        signs: [
                            "Can't speak, cough, or breathe; hands clutch throat",
                            "Face turns red then blue; silent ineffective cough",
                        ],
                        do: [
                            "Ask 'Are you choking?' — if they can answer, encourage coughing",
                            "Give 5 sharp back blows between the shoulder blades",
                            "If still blocked: 5 abdominal thrusts (fist above navel, sharp inward-up)",
                            "Alternate 5 back blows then 5 thrusts until clear",
                            "If they collapse: lower to floor, call 10177, start CPR",
                            "Look in mouth before breaths; remove object only if clearly visible",
                        ],
                        dont: [
                            "Don't blind finger-sweep the mouth",
                            "No abdominal thrusts on babies under 1 yr (use chest thrusts) or pregnant women",
                            "Don't give water to 'wash it down'",
                            "Don't leave them alone while choking",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }],
                    },
                    {
                        id: "stroke",
                        t: "Stroke — FAST",
                        e: "🧠",
                        signs: [
                            "F — Face: one side droops, can't smile",
                            "A — Arms: one arm drifts down when both raised",
                            "S — Speech: slurred or strange",
                            "T — Time: call now — every minute matters",
                            "Sudden confusion, weakness on one side, severe headache",
                        ],
                        do: [
                            "Call 10177 / ER24 084 124 immediately",
                            "Note the exact time symptoms started",
                            "Lie them on their side, head slightly raised",
                            "Loosen clothing, keep warm and calm",
                            "Watch airway — be ready for vomiting",
                        ],
                        dont: [
                            "Don't give aspirin or any medication",
                            "Don't give food or drink",
                            "Don't let them walk around",
                            "Don't drive them yourself / don't wait to see",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                ],
            },
            {
                id: "trauma",
                t: "Injury & Trauma",
                guides: [
                    {
                        id: "bleeding",
                        t: "Severe Bleeding",
                        e: "🩸",
                        signs: [
                            "Blood spurting or pooling; bright red blood",
                            "Soaked clothing or dressings; pallor, rapid weak pulse",
                        ],
                        do: [
                            "Call 10177 / 084 124",
                            "Press firmly with clean cloth directly on the wound",
                            "Don't lift to peek — add cloth on top if it soaks through",
                            "Raise the limb above heart if no fracture suspected",
                            "Tourniquet only if life-threatening & pressure fails: 5–7 cm above wound",
                            "Tighten till bleeding stops; note the time; never remove it",
                            "Keep them lying down and warm",
                        ],
                        dont: [
                            "Don't remove an embedded object — press around it",
                            "Don't remove soaked dressings or a tightened tourniquet",
                            "No tourniquet on neck, head, or torso",
                            "Don't give food or drink",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "burns",
                        t: "Burns & Scalds",
                        e: "🔥",
                        signs: [
                            "RED = painful, dry (1st degree)",
                            "Red + blisters + swelling = 2nd degree",
                            "White / black / leathery, no pain = 3rd degree",
                        ],
                        do: [
                            "Stop the burning — move from heat",
                            "Cool under cool running water for 20 min",
                            "Remove jewellery/tight clothing before swelling",
                            "Cut around clothing stuck to the burn — leave it on",
                            "Cover loosely with cling film or clean damp cloth",
                            "Get help for any burn bigger than a palm, or to face/hands/feet",
                            "Chemical: brush off dry powder first, then flush 20+ min",
                        ],
                        dont: [
                            "Don't use ice, butter, oil, toothpaste, or ointments",
                            "Don't pop blisters",
                            "Don't rip off clothing stuck to the burn",
                            "Don't leave it uncovered once cooled",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "head-injury",
                        t: "Head Injury & Concussion",
                        e: "🤕",
                        signs: [
                            "Confusion, drowsiness, or brief blackout",
                            "Vomiting, unequal pupils, blurred vision",
                            "Clear fluid or blood from nose/ears",
                            "Memory loss of the event",
                        ],
                        do: [
                            "Call 10177 for any loss of consciousness",
                            "Keep still; support head and neck in line with body",
                            "Gentle pressure on a bleeding scalp wound",
                            "Monitor consciousness, breathing, pupils every few minutes",
                            "Get assessed even if symptoms seem mild",
                        ],
                        dont: [
                            "Don't move them if neck/spine injury is possible",
                            "Don't wash a scalp wound",
                            "Don't give aspirin, alcohol, or sedatives",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "fracture",
                        t: "Broken Bone / Fracture",
                        e: "🦴",
                        signs: [
                            "Obvious deformity, swelling, bruising",
                            "Severe pain on movement or standing",
                            "Limb looks shortened, twisted, or at an odd angle",
                        ],
                        do: [
                            "Keep them still; support the limb as found",
                            "Immobilise the joints above AND below the break",
                            "Splint with magazine/rolled blanket, padded well",
                            "Check colour, warmth, feeling below the break",
                            "Cold pack wrapped in cloth, 15–20 min",
                        ],
                        dont: [
                            "Don't try to straighten or realign the limb",
                            "Don't push a bone protruding through skin back in",
                            "Don't ignore a cold, pale, or blue limb below the break",
                            "Don't move them for suspected neck/spine/pelvis injury",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                ],
            },
            {
                id: "environment",
                t: "Environmental & Medicine",
                guides: [
                    {
                        id: "anaphylaxis",
                        t: "Severe Allergic Reaction",
                        e: "💉",
                        signs: [
                            "Swelling of face, lips, tongue, or throat",
                            "Wheezing or trouble breathing; hives",
                            "Dizziness, collapse, vomiting",
                        ],
                        do: [
                            "Call 10177 / 084 124 now",
                            "Use their auto-injector (EpiPen) at once — into outer mid-thigh",
                            "Press firmly until it clicks, hold 10 s, rub the site",
                            "Lay flat, legs raised (sit up if breathing is hard)",
                            "Give a 2nd injection after 5–10 min if no improvement",
                        ],
                        dont: [
                            "Don't delay using the injector 'to see'",
                            "Don't give food or drink (throat may be swollen)",
                            "Don't inject into the buttock or a vein",
                            "Still go to hospital even if they improve (can relapse)",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "snakebite",
                        t: "Snakebite (SA)",
                        e: "🐍",
                        signs: [
                            "One or two puncture marks; pain, burning, swelling",
                            "Nausea, blurred vision, weakness, sweating",
                            "Sometimes no symptoms — don't wait",
                        ],
                        do: [
                            "Move away from the snake — don't chase it",
                            "Call 10177 / 084 124; get to hospital fast",
                            "Keep the limb still, below heart level; splint it",
                            "Remove rings, watches, tight bracelets, shoes",
                            "Firm (not tight) bandage over the bite for neurotoxic bites (cobra/mamba)",
                            "Remember / photo the snake from a distance if safe",
                            "Carry them lying still if possible",
                        ],
                        dont: [
                            "Don't cut or suck the wound",
                            "Don't apply a tourniquet or tight band",
                            "Don't ice, heat, or use electric shock",
                            "Don't wash the wound (venom is needed for testing)",
                            "Don't run or let them walk — spreads venom",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "drowning",
                        t: "Drowning / Near-Drowning",
                        e: "🌊",
                        signs: [
                            "Not moving, face-down, or gasping in the water",
                            "After rescue: no breathing, no response, blue lips",
                        ],
                        do: [
                            "Call 10177 / 084 124 first",
                            "Reach with a stick/rope or throw a buoy — don't enter water unless trained",
                            "Lay flat on firm ground; tilt head back, lift chin",
                            "No breathing → start CPR: 30 compressions, 2 breaths",
                            "Long, sustained CPR — drowning victims recover well",
                            "If breathing, recovery position + keep warm",
                        ],
                        dont: [
                            "Don't become a second casualty — don't enter water needlessly",
                            "Don't waste time draining water or doing abdominal thrusts",
                            "Don't stop CPR early",
                            "Go to hospital even if they seem fine (secondary drowning)",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "hypothermia",
                        t: "Hypothermia / Cold",
                        e: "🥶",
                        signs: [
                            "Violent shivering that then STOPS (dangerous)",
                            "Cold, pale skin; slow pulse; confusion, drowsiness, slurred speech",
                        ],
                        do: [
                            "Call 10177 if severe or unconscious",
                            "Get out of cold, wind, and wet clothes; pat dry (don't rub)",
                            "Wrap in blankets; cover the head",
                            "Warm compresses to chest, groin, armpits",
                            "Warm sweet drink if fully awake and able to swallow",
                        ],
                        dont: [
                            "Don't rub or massage the skin",
                            "No hot water bottles on limbs — forces cold blood to the heart",
                            "Don't give alcohol or caffeine",
                            "Don't stand them upright; don't give drinks if drowsy",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "heatstroke",
                        t: "Heat Stroke / Exhaustion",
                        e: "☀️",
                        signs: [
                            "Heat stroke: HOT, DRY, RED skin — no sweating, confusion, fainting (EMERGENCY)",
                            "Exhaustion: heavy sweating, pale clammy skin, cramps, nausea",
                        ],
                        do: [
                            "Heat stroke → call 10177 / 084 124 now",
                            "Move to cool shade/aircon; remove excess clothing",
                            "Cool fast: cold water sponge, ice packs on neck, armpits, groin",
                            "Fan vigorously",
                            "Cool water to drink only if fully conscious & not vomiting",
                        ],
                        dont: [
                            "Don't give alcohol or hot drinks",
                            "Don't give fluids to an unconscious or vomiting person",
                            "Don't re-expose to heat that day",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "shock-electrical",
                        t: "Electric Shock",
                        e: "⚡",
                        signs: [
                            "Collapsed near an electrical source; muscle spasms",
                            "Burns at entry/exit points; may stop breathing",
                        ],
                        do: [
                            "Don't touch them while still connected to the current",
                            "Switch off power at the mains first",
                            "If you can't: stand on dry rubber/wood, push away with a dry wooden or plastic object",
                            "Call 10177 / 084 124",
                            "If not breathing, start CPR; use an AED if available",
                            "Cover burns with clean dry dressings — no water",
                        ],
                        dont: [
                            "Don't touch with bare hands until power is off",
                            "Don't use wet or metal objects",
                            "Don't pour water on the burns",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                ],
            },
            {
                id: "medical",
                t: "Medical Emergencies",
                guides: [
                    {
                        id: "poisoning",
                        t: "Poisoning",
                        e: "🧪",
                        signs: [
                            "Burns/stains around the mouth; odd breath odour",
                            "Nausea, vomiting, drowsiness, confusion, seizures",
                            "Empty bottles nearby; chemical smell",
                        ],
                        do: [
                            "Call Poisons Info Centre 0861 555 777 (24/7)",
                            "Call 10177 / 084 124 if severe or unconscious",
                            "Have the container/label with you; tell them what & how much",
                            "Skin/eyes: rinse with cool running water 15–20 min",
                            "Inhaled fumes: get to fresh air",
                            "Follow the Centre's instructions exactly",
                        ],
                        dont: [
                            "Don't make them vomit",
                            "Don't follow the label blindly — call the Centre first",
                            "Don't give food or drink except as directed",
                            "Turn an unconscious person on their side",
                        ],
                        call: [{ d: "0861 555 777", l: "Poisons Centre" }, { d: "10177", l: "Ambulance" }],
                    },
                    {
                        id: "asthma",
                        t: "Severe Asthma Attack",
                        e: "🌬️",
                        signs: [
                            "Too breathless to speak in full sentences",
                            "Wheezing (or silent chest — very severe), blue lips",
                            "No improvement from reliever after a few puffs",
                        ],
                        do: [
                            "Sit them upright — never lie them down",
                            "Give 2–4 puffs of their blue reliever via spacer",
                            "Repeat every few minutes as needed",
                            "Remove triggers (smoke, perfume, animals)",
                            "Call 10177 if no improvement after ~10 min",
                        ],
                        dont: [
                            "Don't lie them flat",
                            "Don't give sedatives or 'calming' pills",
                            "Don't leave them alone or delay",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "diabetes",
                        t: "Diabetic Emergency (Low Sugar)",
                        e: "🩸",
                        signs: [
                            "Shakiness, sweating, pale skin, rapid heartbeat",
                            "Confusion, slurred speech, odd behaviour",
                            "Headache, hunger, weakness — seizures/unconscious if severe",
                        ],
                        do: [
                            "If conscious & can swallow: give fast sugar — glucose tabs, sugary drink, sweets",
                            "Wait 10 min; repeat sugar if no improvement",
                            "Once better, give a longer snack (bread/sandwich) to prevent relapse",
                            "If unconscious or fitting: call 10177, recovery position",
                            "Give nothing by mouth to an unconscious person",
                        ],
                        dont: [
                            "Don't give anything by mouth if unconscious",
                            "Don't give sugar-free / 'diet' drinks (no glucose)",
                            "Don't inject insulin without a blood-glucose test",
                            "Arrange medical review even after recovery",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "seizure",
                        t: "Seizure / Epilepsy",
                        e: "🌀",
                        signs: [
                            "Sudden collapse with stiff body and jerking limbs",
                            "Eyes roll back, foaming at mouth, loss of bladder control",
                        ],
                        do: [
                            "Clear hard/sharp objects away",
                            "Cushion the head with a soft item",
                            "Time the seizure; loosen tight neck clothing",
                            "Roll onto side (recovery position) once jerking stops",
                            "Stay until fully conscious; reassure as they wake",
                        ],
                        dont: [
                            "Don't hold them down or restrain",
                            "Don't put anything in their mouth — not even fingers",
                            "Don't give food/water during the seizure",
                            "Call 10177 if it lasts over 5 min, repeats, or is their first",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                    {
                        id: "fainting",
                        t: "Fainting & Recovery Position",
                        e: "😵",
                        signs: [
                            "Sudden dizziness, blurry vision, pale clammy skin",
                            "Brief loss of consciousness (seconds to a minute)",
                        ],
                        do: [
                            "Catch or lower them safely to the floor",
                            "Lie flat, raise legs above heart (if no injury)",
                            "Check breathing & responsiveness",
                            "Once conscious: recovery position — roll onto side, head tilted back to open airway",
                            "Call 10177 if not awake in 1–2 min",
                        ],
                        dont: [
                            "Don't sit them up immediately",
                            "Don't give food/drink till fully awake",
                            "Don't let them stand up too fast",
                        ],
                        call: [{ d: "10177", l: "Ambulance" }, { d: "084 124", l: "ER24" }],
                    },
                ],
            },
        ],
    },

    // National SA emergency & toll-free helplines (work from anywhere in the country).
    helplines: {
        intro: "National & toll-free numbers that work from anywhere in South Africa.",
        entries: [
            { id: "n112", t: "National Emergency (cell)", n: [{ d: "112", l: "Any network, even without airtime" }] },
            { id: "nsaps", t: "SAPS / Flying Squad", n: [{ d: "10111", l: "Police emergency" }] },
            { id: "nam", t: "Provincial Ambulance", n: [{ d: "10177", l: "Free · Emergency Medical Services" }] },
            { id: "nnet", t: "Netcare 911", n: [{ d: "082 911", l: "Private · 24/7" }] },
            { id: "ner24", t: "ER24", n: [{ d: "084 124", l: "Private · 24/7" }] },
            { id: "npoison", t: "Poisons Info Centre", n: [{ d: "0861 555 777", l: "Tygerberg · 24/7 poison advice" }] },
            { id: "nsadag", t: "SADAG Suicide / Crisis", n: [{ d: "0800 567 567", l: "24/7 mental health line" }] },
            { id: "nlifeline", t: "Lifeline Counselling", n: [{ d: "0861 322 322", l: "24/7 crisis counselling" }] },
            { id: "nchild", t: "Childline SA", n: [{ d: "0800 055 555", l: "Child protection & crisis" }] },
        ],
    },

    checklist: {
        intro: "Work through these before fire season. Progress is saved on this device.",
        groups: [
            {
                id: "cover",
                t: "Covered Before It Happens",
                items: [
                    {
                        id: "c01",
                        t: "Ensure your property is properly insured",
                    },
                    {
                        id: "c02",
                        t: "Keep current interior & exterior photos for your insurer",
                    },
                    {
                        id: "c03",
                        t: "Plan how your household functions during power cuts",
                    },
                    { id: "c04", t: "Make sure all pets are microchipped" },
                ],
            },
            {
                id: "yard",
                t: "Fire-Wise Yard",
                items: [
                    {
                        id: "c05",
                        t: "Maintain a fire-wise garden and a defendable space around the house",
                    },
                    {
                        id: "c06",
                        t: "Ensure sufficient water supply and hoses to defend your home",
                    },
                    { id: "c07", t: "Keep gutters clean and leaf-free" },
                    {
                        id: "c08",
                        t: "Move firewood, flammables and stacked timber away from the house",
                    },
                    { id: "c09", t: "Fit exterior taps with hose attachments" },
                    {
                        id: "c10",
                        t: "Keep access clear for fire trucks — blocked or unsafe access stops them",
                    },
                    {
                        id: "c11",
                        t: "Keep the nearest fire hydrant clearly marked and free of overgrown vegetation",
                    },
                ],
            },
            {
                id: "gear",
                t: "Emergency Gear",
                items: [
                    {
                        id: "c12",
                        t: "Firefighting equipment ready: extinguishers, fire blankets, beaters",
                    },
                    {
                        id: "c13",
                        t: "Protective clothing: leather boots, gloves, broad-brimmed hats, filter masks, goggles, eye drops",
                    },
                    {
                        id: "c14",
                        t: "Torches or headlamps with spare batteries for every household member",
                    },
                ],
            },
            {
                id: "firstaid",
                t: "First Aid & Supplies",
                items: [
                    {
                        id: "c15",
                        t: "First aid kit with burn-care dressings and prescription medicines",
                    },
                    { id: "c16", t: "Candles, matches or lighters" },
                    { id: "c17", t: "At least 3 days of non-perishable food" },
                    {
                        id: "c18",
                        t: "Bottled drinking water — 5 litres per person per day",
                    },
                ],
            },
            {
                id: "evac",
                t: "Evacuation Plan",
                items: [
                    {
                        id: "c19",
                        t: "Prepare your property as if staying, even if you plan to evacuate",
                    },
                    {
                        id: "c20",
                        t: "Watch Overstrand Municipality and community WhatsApp notifications",
                    },
                    {
                        id: "c21",
                        t: "Assign tasks now: packing IDs, documents, medicines, pet supplies, valuables",
                    },
                    {
                        id: "c22",
                        t: "Agree who informs your zone manager, family and neighbours",
                    },
                ],
            },
            {
                id: "vehicle",
                t: "Vehicle Readiness",
                items: [
                    {
                        id: "c23",
                        t: "Keep adequate fuel in the tank at all times",
                    },
                    {
                        id: "c24",
                        t: "Pack water, a first-aid kit with burn dressings, a wool blanket and a local route map",
                    },
                ],
            },
            {
                id: "stay",
                t: "If You Stay to Protect",
                items: [
                    {
                        id: "c25",
                        t: "Assign who wets down the garden, decks and wooden window frames",
                    },
                    {
                        id: "c26",
                        t: "Turn off gas bottles, close windows, wet towels under doors, move flammables indoors",
                    },
                    {
                        id: "c27",
                        t: "Keep gates open so emergency services can access your property",
                    },
                    {
                        id: "c28",
                        t: "Never block roads — make way for emergency vehicles",
                    },
                ],
            },
        ],
    },
};
