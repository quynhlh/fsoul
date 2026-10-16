export type FPTOffice = { id: string; name: string; area: string };
export type FPTCity = { id: string; name: string; country: string; offices?: FPTOffice[] };

export const FPT_LOCATIONS: FPTCity[] = [
  // Vietnam
  { id: 'hanoi', name: 'Ha Noi', country: 'Vietnam', offices: [
    { id: 'caugiay', name: 'Cau Giay Office', area: 'Duy Tan St, Cau Giay District' },
    { id: 'hoalac', name: 'Hoa Lac Campus', area: 'Hoa Lac Hi-Tech Park, Thach That' },
  ]},
  { id: 'hcm', name: 'Ho Chi Minh City', country: 'Vietnam', offices: [
    { id: 'ftown', name: 'Ftown 3 & Ftown 2', area: 'District 9 (Thu Duc City)' },
    { id: 'tanthan', name: 'Tan Thuan Office', area: 'District 7' },
  ]},
  { id: 'danang', name: 'Da Nang', country: 'Vietnam' },
  { id: 'cantho', name: 'Can Tho', country: 'Vietnam' },
  { id: 'quynhon', name: 'Quy Nhon', country: 'Vietnam' },
  // International
  { id: 'tokyo', name: 'Tokyo', country: 'Japan' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore' },
  { id: 'kl', name: 'Kuala Lumpur', country: 'Malaysia' },
  { id: 'atlanta', name: 'Atlanta', country: 'USA' },
  { id: 'sydney', name: 'Sydney', country: 'Australia' },
  { id: 'paris', name: 'Paris', country: 'France' },
];
