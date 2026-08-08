export interface LocationHierarchyNode {
  [country: string]: {
    [state: string]: {
      [district: string]: {
        [tahsil: string]: string[]; // list of villages/towns
      };
    };
  };
}

export const WORLD_LOCATIONS_DATA: LocationHierarchyNode = {
  India: {
    Rajasthan: {
      'Sri Ganganagar': {
        'Sri Ganganagar Tahsil': ['Sri Ganganagar City', 'Mirzewala', 'Matili Rathan', 'Hindumalkot', 'Kotha'],
        'Padampur Tahsil': ['Padampur Town', 'Gajsinghpur', 'Ridmalsar', 'Jaloki', 'Delwan', 'Chak 17 BB'],
        'Suratgarh Tahsil': ['Suratgarh City', 'Rajiyasar', 'Biradhwal', 'Manaksar', 'Sardargarh'],
        'Raisinghnagar Tahsil': ['Raisinghnagar Town', 'Gajsinghpur Road', 'Sameja Koki', 'Muklawa'],
        'Anupgarh Tahsil': ['Anupgarh City', 'Ramsinghpur', 'Banda Colony', '78 GB'],
        'Sadulshahar Tahsil': ['Sadulshahar Town', 'Khatwon', 'Takhranwali', 'Lalgarh Jattan'],
        'Karanpur Tahsil': ['Srikaranpur Town', 'Majhiwala', 'Kesarisinghpur', 'Ganganagar Road'],
        'Vijaynagar Tahsil': ['Sri Vijaynagar Town', 'Jaitsar', '22 GB', 'Sardargarh Road']
      },
      Hanumangarh: {
        'Hanumangarh Tahsil': ['Hanumangarh Town', 'Hanumangarh Junction', 'Pilibanga', 'Rawatsar'],
        'Nohar Tahsil': ['Nohar Town', 'Bhadra', 'Fephana', 'Gogamedi'],
        'Tibi Tahsil': ['Tibi Town', 'Talwara Jheel', 'Surewala']
      },
      Bikaner: {
        'Bikaner Tahsil': ['Bikaner City', 'Nokha', 'Lunkaransar', 'Khajuwala', 'Kolayat']
      },
      Jaipur: {
        'Jaipur Tahsil': ['Jaipur City', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura'],
        'Sanganer Tahsil': ['Sanganer Town', 'Pratap Nagar', 'Sitapura Industrial Area'],
        'Amer Tahsil': ['Amer Town', 'Kukas', 'Chandwaji']
      },
      Jodhpur: {
        'Jodhpur Tahsil': ['Jodhpur City', 'Ratanada', 'Shastri Nagar', 'Mandore', 'Pali Road'],
        'Luni Tahsil': ['Luni Town', 'Salawas', 'Kankani']
      }
    },
    Punjab: {
      Bathinda: {
        'Bathinda Tahsil': ['Bathinda City', 'Mauri', 'Raman', 'Sangat'],
        'Talwandi Sabo Tahsil': ['Talwandi Sabo Town', 'Rama Mandi']
      },
      Amritsar: {
        'Amritsar Tahsil': ['Amritsar City', 'Ajnala', 'Baba Bakala', 'Majitha']
      },
      Ludhiana: {
        'Ludhiana Tahsil': ['Ludhiana City', 'Jagraon', 'Khanna', 'Samrala']
      },
      Abohar: {
        'Abohar Tahsil': ['Abohar City', 'Khuian Sarwer', 'Sitogunno', 'Balluana']
      }
    },
    Delhi: {
      'Central Delhi': {
        'Connaught Place Tahsil': ['Connaught Place', 'Karol Bagh', 'Paharganj']
      },
      'South Delhi': {
        'Saket Tahsil': ['Saket', 'Hauz Khas', 'Green Park', 'Mehrauli']
      }
    },
    Maharashtra: {
      Mumbai: {
        'Mumbai Suburban': ['Andheri West', 'Bandra', 'Borivali', 'Kurla', 'Powai']
      },
      Pune: {
        'Haveli Tahsil': ['Pune City', 'Hinjewadi', 'Kothrud', 'Viman Nagar', 'Hadapsar']
      }
    },
    Haryana: {
      Sirsa: {
        'Sirsa Tahsil': ['Sirsa City', 'Ellenabad', 'Kalanwali', 'Rania']
      },
      Gurugram: {
        'Gurugram Tahsil': ['Gurugram City', 'DLF Phase 3', 'Cyber Hub', 'Sohna', 'Manesar']
      }
    }
  },
  Nepal: {
    Bagmati: {
      Kathmandu: {
        'Kathmandu Metropolitan': ['Thamel', 'New Road', 'Baneshwor', 'Koteshwor']
      }
    },
    Lumbini: {
      Rupandehi: {
        'Butwal Tahsil': ['Butwal City', 'Bhairahawa', 'Siddharthanagar']
      }
    }
  },
  UAE: {
    Dubai: {
      'Dubai Central': {
        Deira: ['Al Rigga', 'Naif', 'Al Muteena', 'Port Saeed'],
        'Bur Dubai': ['Al Karama', 'Al Mankhool', 'Oud Metha']
      }
    },
    'Abu Dhabi': {
      'Abu Dhabi City': {
        'Mussafah Tahsil': ['Mussafah Industrial', 'Shabiya', 'Mohammed Bin Zayed City']
      }
    }
  },
  'Saudi Arabia': {
    Riyadh: {
      'Riyadh District': {
        'Batha Tahsil': ['Batha City', 'Olaya', 'Shumaisi', 'Hara']
      }
    }
  },
  'Qatar': {
    Doha: {
      'Doha Central': {
        'Grand Hamad': ['Al Sadd', 'Mansoura', 'Najma', 'Industrial Area']
      }
    }
  },
  'USA': {
    California: {
      'Los Angeles': {
        'LA Metro': ['Downtown LA', 'Hollywood', 'Santa Monica', 'Torrance']
      }
    }
  },
  'Canada': {
    Ontario: {
      Brampton: {
        'Brampton Central': ['Bramalea', 'Springdale', 'Heart Lake']
      }
    }
  }
};

export const POPULAR_COUNTRIES = Object.keys(WORLD_LOCATIONS_DATA);

export function getStatesForCountry(country: string): string[] {
  if (!country || !WORLD_LOCATIONS_DATA[country]) return ['Rajasthan', 'Punjab', 'Delhi', 'Haryana', 'Other State'];
  return Object.keys(WORLD_LOCATIONS_DATA[country]);
}

export function getDistrictsForState(country: string, state: string): string[] {
  if (!country || !state || !WORLD_LOCATIONS_DATA[country]?.[state]) {
    return ['Sri Ganganagar', 'Hanumangarh', 'Bikaner', 'Jaipur', 'Other District'];
  }
  return Object.keys(WORLD_LOCATIONS_DATA[country][state]);
}

export function getTahsilsForDistrict(country: string, state: string, district: string): string[] {
  if (!country || !state || !district || !WORLD_LOCATIONS_DATA[country]?.[state]?.[district]) {
    return ['Sri Ganganagar Tahsil', 'Padampur Tahsil', 'Suratgarh Tahsil', 'Other Tahsil / Tehsil'];
  }
  return Object.keys(WORLD_LOCATIONS_DATA[country][state][district]);
}

export function getVillagesForTahsil(country: string, state: string, district: string, tahsil: string): string[] {
  if (!country || !state || !district || !tahsil || !WORLD_LOCATIONS_DATA[country]?.[state]?.[district]?.[tahsil]) {
    return [];
  }
  return WORLD_LOCATIONS_DATA[country][state][district][tahsil];
}
