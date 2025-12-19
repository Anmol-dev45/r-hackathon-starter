// Nepal Administrative Data
// Provinces, Districts, and Municipalities

export interface Municipality {
    name: string;
    type: 'Metropolitan' | 'Sub-Metropolitan' | 'Municipality' | 'Rural Municipality';
    wards: number;
}

export interface District {
    name: string;
    municipalities: Municipality[];
}

export interface Province {
    id: number;
    name: string;
    nameNe: string;
    districts: District[];
}

export const NEPAL_ADMINISTRATIVE_DATA: Province[] = [
    {
        id: 1,
        name: 'Koshi',
        nameNe: 'कोशी',
        districts: [
            {
                name: 'Bhojpur',
                municipalities: [
                    { name: 'Bhojpur Municipality', type: 'Municipality', wards: 11 },
                    { name: 'Shadananda Municipality', type: 'Municipality', wards: 14 },
                ],
            },
            {
                name: 'Dhankuta',
                municipalities: [
                    { name: 'Dhankuta Municipality', type: 'Municipality', wards: 10 },
                    { name: 'Pakhribas Municipality', type: 'Municipality', wards: 9 },
                ],
            },
            {
                name: 'Morang',
                municipalities: [
                    { name: 'Biratnagar Metropolitan City', type: 'Metropolitan', wards: 19 },
                    { name: 'Sundarharaicha Municipality', type: 'Municipality', wards: 14 },
                    { name: 'Belbari Municipality', type: 'Municipality', wards: 10 },
                ],
            },
            {
                name: 'Sunsari',
                municipalities: [
                    { name: 'Dharan Sub-Metropolitan City', type: 'Sub-Metropolitan', wards: 20 },
                    { name: 'Itahari Sub-Metropolitan City', type: 'Sub-Metropolitan', wards: 23 },
                    { name: 'Inaruwa Municipality', type: 'Municipality', wards: 9 },
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'Madhesh',
        nameNe: 'मधेश',
        districts: [
            {
                name: 'Saptari',
                municipalities: [
                    { name: 'Rajbiraj Municipality', type: 'Municipality', wards: 13 },
                    { name: 'Khadak Municipality', type: 'Municipality', wards: 9 },
                ],
            },
            {
                name: 'Siraha',
                municipalities: [
                    { name: 'Lahan Municipality', type: 'Municipality', wards: 18 },
                    { name: 'Siraha Municipality', type: 'Municipality', wards: 11 },
                ],
            },
            {
                name: 'Dhanusha',
                municipalities: [
                    { name: 'Janakpur Sub-Metropolitan City', type: 'Sub-Metropolitan', wards: 25 },
                    { name: 'Chhireshwornath Municipality', type: 'Municipality', wards: 9 },
                ],
            },
        ],
    },
    {
        id: 3,
        name: 'Bagmati',
        nameNe: 'बागमती',
        districts: [
            {
                name: 'Kathmandu',
                municipalities: [
                    { name: 'Kathmandu Metropolitan City', type: 'Metropolitan', wards: 32 },
                    { name: 'Kirtipur Municipality', type: 'Municipality', wards: 10 },
                    { name: 'Shankharapur Municipality', type: 'Municipality', wards: 9 },
                    { name: 'Kageshwori Manohara Municipality', type: 'Municipality', wards: 9 },
                ],
            },
            {
                name: 'Lalitpur',
                municipalities: [
                    { name: 'Lalitpur Metropolitan City', type: 'Metropolitan', wards: 29 },
                    { name: 'Mahalaxmi Municipality', type: 'Municipality', wards: 10 },
                    { name: 'Godawari Municipality', type: 'Municipality', wards: 14 },
                ],
            },
            {
                name: 'Bhaktapur',
                municipalities: [
                    { name: 'Bhaktapur Municipality', type: 'Municipality', wards: 10 },
                    { name: 'Madhyapur Thimi Municipality', type: 'Municipality', wards: 9 },
                    { name: 'Suryabinayak Municipality', type: 'Municipality', wards: 10 },
                ],
            },
            {
                name: 'Chitwan',
                municipalities: [
                    { name: 'Bharatpur Metropolitan City', type: 'Metropolitan', wards: 29 },
                    { name: 'Ratnanagar Municipality', type: 'Municipality', wards: 16 },
                ],
            },
            {
                name: 'Dhading',
                municipalities: [
                    { name: 'Nilkantha Municipality', type: 'Municipality', wards: 14 },
                    { name: 'Dhunibeshi Municipality', type: 'Municipality', wards: 9 },
                ],
            },
        ],
    },
    {
        id: 4,
        name: 'Gandaki',
        nameNe: 'गण्डकी',
        districts: [
            {
                name: 'Kaski',
                municipalities: [
                    { name: 'Pokhara Metropolitan City', type: 'Metropolitan', wards: 33 },
                    { name: 'Annapurna Rural Municipality', type: 'Rural Municipality', wards: 11 },
                ],
            },
            {
                name: 'Gorkha',
                municipalities: [
                    { name: 'Gorkha Municipality', type: 'Municipality', wards: 14 },
                    { name: 'Palungtar Municipality', type: 'Municipality', wards: 13 },
                ],
            },
            {
                name: 'Tanahun',
                municipalities: [
                    { name: 'Bhanu Municipality', type: 'Municipality', wards: 13 },
                    { name: 'Bhimad Municipality', type: 'Municipality', wards: 9 },
                ],
            },
        ],
    },
    {
        id: 5,
        name: 'Lumbini',
        nameNe: 'लुम्बिनी',
        districts: [
            {
                name: 'Rupandehi',
                municipalities: [
                    { name: 'Butwal Sub-Metropolitan City', type: 'Sub-Metropolitan', wards: 19 },
                    { name: 'Siddharthanagar Municipality', type: 'Municipality', wards: 18 },
                    { name: 'Tilottama Municipality', type: 'Municipality', wards: 18 },
                ],
            },
            {
                name: 'Kapilvastu',
                municipalities: [
                    { name: 'Kapilvastu Municipality', type: 'Municipality', wards: 14 },
                    { name: 'Buddhabhumi Municipality', type: 'Municipality', wards: 14 },
                ],
            },
            {
                name: 'Nawalparasi West',
                municipalities: [
                    { name: 'Ramgram Municipality', type: 'Municipality', wards: 17 },
                    { name: 'Sunwal Municipality', type: 'Municipality', wards: 9 },
                ],
            },
        ],
    },
    {
        id: 6,
        name: 'Karnali',
        nameNe: 'कर्णाली',
        districts: [
            {
                name: 'Surkhet',
                municipalities: [
                    { name: 'Birendranagar Municipality', type: 'Municipality', wards: 16 },
                    { name: 'Bheriganga Municipality', type: 'Municipality', wards: 12 },
                ],
            },
            {
                name: 'Dailekh',
                municipalities: [
                    { name: 'Narayan Municipality', type: 'Municipality', wards: 11 },
                    { name: 'Dullu Municipality', type: 'Municipality', wards: 9 },
                ],
            },
        ],
    },
    {
        id: 7,
        name: 'Sudurpashchim',
        nameNe: 'सुदूरपश्चिम',
        districts: [
            {
                name: 'Kailali',
                municipalities: [
                    { name: 'Dhangadhi Sub-Metropolitan City', type: 'Sub-Metropolitan', wards: 19 },
                    { name: 'Lamkichuha Municipality', type: 'Municipality', wards: 10 },
                ],
            },
            {
                name: 'Kanchanpur',
                municipalities: [
                    { name: 'Bhimdatta Municipality', type: 'Municipality', wards: 19 },
                    { name: 'Mahakali Municipality', type: 'Municipality', wards: 9 },
                ],
            },
        ],
    },
];

// Helper functions
export function getProvinceById(id: number): Province | undefined {
    return NEPAL_ADMINISTRATIVE_DATA.find(p => p.id === id);
}

export function getDistrictsByProvince(provinceName: string): District[] {
    const province = NEPAL_ADMINISTRATIVE_DATA.find(p => p.name === provinceName);
    return province?.districts || [];
}

export function getMunicipalitiesByDistrict(provinceName: string, districtName: string): Municipality[] {
    const province = NEPAL_ADMINISTRATIVE_DATA.find(p => p.name === provinceName);
    const district = province?.districts.find(d => d.name === districtName);
    return district?.municipalities || [];
}

export function getWardsByMunicipality(provinceName: string, districtName: string, municipalityName: string): number {
    const municipalities = getMunicipalitiesByDistrict(provinceName, districtName);
    const municipality = municipalities.find(m => m.name === municipalityName);
    return municipality?.wards || 0;
}
