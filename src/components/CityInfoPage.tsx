import React, { useState } from 'react';
import { X, MapPin, Building2, GraduationCap, Hotel, Heart, Phone, ChevronLeft, Search } from 'lucide-react';
import { Language } from '../types';

interface CityInfoProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const DISTRICTS: Record<string, any> = {
  'Sri Ganganagar': {
    hi: 'श्रीगंगानगर',
    population: '19 Lakh+',
    area: '10,978 km²',
    pincode: '335001',
    hospitals: [
      { name: 'District Hospital Sri Ganganagar', phone: '0154-2470300', type: 'Government' },
      { name: 'Ganganagar Medical College & Hospital', phone: '0154-2420100', type: 'Medical College' },
      { name: 'Shri Ram Hospital', phone: '0154-2476543', type: 'Private' },
      { name: 'City Hospital', phone: '0154-2470111', type: 'Private' },
      { name: 'Emergency / Ambulance', phone: '108', type: 'Emergency' },
    ],
    schools: [
      { name: 'Kendriya Vidyalaya Sri Ganganagar', phone: '0154-2475321', type: 'Central' },
      { name: 'Govt. Senior Secondary School', phone: '0154-2470456', type: 'Government' },
      { name: 'DAV Public School', phone: '0154-2476789', type: 'Private' },
      { name: 'St. Xavier School', phone: '0154-2471234', type: 'Private' },
    ],
    colleges: [
      { name: 'Govt. Dungar College', phone: '0154-2470222', type: 'Government' },
      { name: 'Ganganagar Medical College', phone: '0154-2420100', type: 'Medical' },
      { name: 'Engineering College Sri Ganganagar', phone: '0154-2420200', type: 'Engineering' },
    ],
    hotels: [
      { name: 'Hotel Haveli', phone: '0154-2476543', type: 'Hotel' },
      { name: 'Hotel Paradise', phone: '0154-2471111', type: 'Hotel' },
      { name: 'Dharamshala Near Bus Stand', phone: '0154-2470555', type: 'Dharamshala' },
    ],
    emergency: [
      { name: 'Police Control Room', phone: '0154-2470100 / 100' },
      { name: 'Fire Brigade', phone: '101' },
      { name: 'Ambulance', phone: '108' },
      { name: 'District Collector Office', phone: '0154-2470200' },
    ],
  },
  'Hanumangarh': {
    hi: 'हनुमानगढ़',
    population: '17 Lakh+',
    area: '9,656 km²',
    pincode: '335512',
    hospitals: [
      { name: 'District Hospital Hanumangarh', phone: '01552-222100', type: 'Government' },
      { name: 'Shri Balaji Hospital', phone: '01552-222456', type: 'Private' },
      { name: 'Ambulance', phone: '108', type: 'Emergency' },
    ],
    schools: [
      { name: 'Kendriya Vidyalaya Hanumangarh', phone: '01552-222321', type: 'Central' },
      { name: 'Govt. Senior Secondary School', phone: '01552-222456', type: 'Government' },
    ],
    colleges: [
      { name: 'Govt. College Hanumangarh', phone: '01552-222222', type: 'Government' },
      { name: 'BTC College', phone: '01552-222333', type: 'Private' },
    ],
    hotels: [
      { name: 'Hotel Kalyan', phone: '01552-222555', type: 'Hotel' },
      { name: 'Dharamshala Sector 2', phone: '01552-222666', type: 'Dharamshala' },
    ],
    emergency: [
      { name: 'Police', phone: '100 / 01552-222100' },
      { name: 'Fire', phone: '101' },
      { name: 'Ambulance', phone: '108' },
    ],
  },
  'Bikaner': {
    hi: 'बीकानेर',
    population: '23 Lakh+',
    area: '27,244 km²',
    pincode: '334001',
    hospitals: [
      { name: 'PBM Hospital Bikaner (Govt.)', phone: '0151-2201200', type: 'Government' },
      { name: 'SDMH Hospital', phone: '0151-2204000', type: 'Private' },
      { name: 'Ambulance', phone: '108', type: 'Emergency' },
    ],
    schools: [
      { name: 'Kendriya Vidyalaya Bikaner', phone: '0151-2201321', type: 'Central' },
      { name: 'MGD School Bikaner', phone: '0151-2201456', type: 'Private' },
    ],
    colleges: [
      { name: 'Dungar College Bikaner', phone: '0151-2201100', type: 'Government' },
      { name: 'SPMVV Medical College', phone: '0151-2201200', type: 'Medical' },
    ],
    hotels: [
      { name: 'Hotel Bhanwar Niwas', phone: '0151-2229323', type: 'Hotel' },
      { name: 'Hotel Marudhar Heritage', phone: '0151-2523902', type: 'Hotel' },
    ],
    emergency: [
      { name: 'Police', phone: '100 / 0151-2200100' },
      { name: 'Fire', phone: '101' },
      { name: 'Ambulance', phone: '108' },
    ],
  },
  'Jaipur': {
    hi: 'जयपुर',
    population: '66 Lakh+',
    area: '11,143 km²',
    pincode: '302001',
    hospitals: [
      { name: 'SMS Hospital Jaipur', phone: '0141-2518888', type: 'Government' },
      { name: 'Fortis Hospital Jaipur', phone: '0141-2547000', type: 'Private' },
      { name: 'Mahatma Gandhi Hospital', phone: '0141-2510001', type: 'Government' },
    ],
    schools: [
      { name: 'Maharaja Sawai Man Singh School', phone: '0141-2610101', type: 'Government' },
      { name: 'St. Xaviers School Jaipur', phone: '0141-2740155', type: 'Private' },
    ],
    colleges: [
      { name: 'University of Rajasthan', phone: '0141-2708001', type: 'University' },
      { name: 'SMS Medical College', phone: '0141-2518888', type: 'Medical' },
      { name: 'MNIT Jaipur', phone: '0141-2529087', type: 'Engineering' },
    ],
    hotels: [
      { name: 'Hotel Rambagh Palace', phone: '0141-2385700', type: 'Luxury' },
      { name: 'Hotel Pearl Palace', phone: '0141-2373700', type: 'Budget' },
    ],
    emergency: [
      { name: 'Police', phone: '100 / 0141-2744000' },
      { name: 'Fire', phone: '101' },
      { name: 'Ambulance', phone: '108' },
    ],
  },
  'Jodhpur': {
    hi: 'जोधपुर', population: '36 Lakh+', area: '22,850 km²', pincode: '342001',
    hospitals: [{ name: 'MDM Hospital Jodhpur', phone: '0291-2434374', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }],
    schools: [{ name: 'Kendriya Vidyalaya Jodhpur', phone: '0291-2434100', type: 'Central' }],
    colleges: [{ name: 'JNV University Jodhpur', phone: '0291-2720111', type: 'University' }, { name: 'Dr. SN Medical College', phone: '0291-2434374', type: 'Medical' }],
    hotels: [{ name: 'Hotel Umaid Bhawan Palace', phone: '0291-2510101', type: 'Luxury' }],
    emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }],
  },
  'Udaipur': {
    hi: 'उदयपुर', population: '30 Lakh+', area: '13,430 km²', pincode: '313001',
    hospitals: [{ name: 'RNT Medical College Hospital', phone: '0294-2527811', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }],
    schools: [{ name: 'Kendriya Vidyalaya Udaipur', phone: '0294-2527100', type: 'Central' }],
    colleges: [{ name: 'Mohanlal Sukhadia University', phone: '0294-2471035', type: 'University' }],
    hotels: [{ name: 'Hotel Lake Palace', phone: '0294-2528800', type: 'Luxury' }],
    emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }],
  },
  'Kota': {
    hi: 'कोटा', population: '19 Lakh+', area: '5,217 km²', pincode: '324001',
    hospitals: [{ name: 'MBS Hospital Kota', phone: '0744-2320101', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }],
    schools: [{ name: 'Kendriya Vidyalaya Kota', phone: '0744-2320321', type: 'Central' }],
    colleges: [{ name: 'Government College Kota', phone: '0744-2320200', type: 'Government' }],
    hotels: [{ name: 'Hotel Brijraj Bhawan', phone: '0744-2450529', type: 'Heritage' }],
    emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }],
  },
  'Ajmer': {
    hi: 'अजमेर', population: '25 Lakh+', area: '8,481 km²', pincode: '305001',
    hospitals: [{ name: 'JLN Hospital Ajmer', phone: '0145-2627101', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }],
    schools: [{ name: 'Mayo College Ajmer', phone: '0145-2627321', type: 'Private' }],
    colleges: [{ name: 'MDS University Ajmer', phone: '0145-2787068', type: 'University' }],
    hotels: [{ name: 'Hotel Mansingh Palace', phone: '0145-2425702', type: 'Hotel' }],
    emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }],
  },
  'Alwar': { hi: 'अलवर', population: '36 Lakh+', area: '8,380 km²', pincode: '301001', hospitals: [{ name: 'District Hospital Alwar', phone: '0144-2335200', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Kendriya Vidyalaya Alwar', phone: '0144-2335100', type: 'Central' }], colleges: [{ name: 'Govt. College Alwar', phone: '0144-2335300', type: 'Government' }], hotels: [{ name: 'Hotel Alwar Bagh', phone: '0144-2700101', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Bharatpur': { hi: 'भरतपुर', population: '25 Lakh+', area: '5,066 km²', pincode: '321001', hospitals: [{ name: 'District Hospital Bharatpur', phone: '05644-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Kendriya Vidyalaya Bharatpur', phone: '05644-222321', type: 'Central' }], colleges: [{ name: 'Govt. College Bharatpur', phone: '05644-222200', type: 'Government' }], hotels: [{ name: 'Hotel Sunbird', phone: '05644-223322', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Bhilwara': { hi: 'भीलवाड़ा', population: '24 Lakh+', area: '10,455 km²', pincode: '311001', hospitals: [{ name: 'District Hospital Bhilwara', phone: '01482-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Kendriya Vidyalaya Bhilwara', phone: '01482-222321', type: 'Central' }], colleges: [{ name: 'Govt. College Bhilwara', phone: '01482-222200', type: 'Government' }], hotels: [{ name: 'Hotel Apex', phone: '01482-224455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Barmer': { hi: 'बाड़मेर', population: '26 Lakh+', area: '28,387 km²', pincode: '344001', hospitals: [{ name: 'District Hospital Barmer', phone: '02982-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Barmer', phone: '02982-222321', type: 'Government' }], colleges: [{ name: 'Govt. College Barmer', phone: '02982-222200', type: 'Government' }], hotels: [{ name: 'Hotel Barmer Palace', phone: '02982-224455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Churu': { hi: 'चुरू', population: '20 Lakh+', area: '13,858 km²', pincode: '331001', hospitals: [{ name: 'District Hospital Churu', phone: '01562-252100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Churu', phone: '01562-252321', type: 'Government' }], colleges: [{ name: 'Govt. College Churu', phone: '01562-252200', type: 'Government' }], hotels: [{ name: 'Hotel Churu', phone: '01562-254455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Dausa': { hi: 'दौसा', population: '16 Lakh+', area: '3,432 km²', pincode: '303303', hospitals: [{ name: 'District Hospital Dausa', phone: '01427-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Dausa', phone: '01427-222321', type: 'Government' }], colleges: [{ name: 'Govt. College Dausa', phone: '01427-222200', type: 'Government' }], hotels: [{ name: 'Hotel Dausa', phone: '01427-224455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Dholpur': { hi: 'धौलपुर', population: '12 Lakh+', area: '3,034 km²', pincode: '328001', hospitals: [{ name: 'District Hospital Dholpur', phone: '05642-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Dholpur', phone: '05642-222321', type: 'Government' }], colleges: [{ name: 'Govt. College Dholpur', phone: '05642-222200', type: 'Government' }], hotels: [{ name: 'Hotel Dholpur', phone: '05642-224455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Dungarpur': { hi: 'डूंगरपुर', population: '13 Lakh+', area: '3,770 km²', pincode: '314001', hospitals: [{ name: 'District Hospital Dungarpur', phone: '02964-230100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Dungarpur', phone: '02964-230321', type: 'Government' }], colleges: [{ name: 'Govt. College Dungarpur', phone: '02964-230200', type: 'Government' }], hotels: [{ name: 'Hotel Dungarpur', phone: '02964-234455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Jaisalmer': { hi: 'जैसलमेर', population: '7 Lakh+', area: '38,401 km²', pincode: '345001', hospitals: [{ name: 'District Hospital Jaisalmer', phone: '02992-252100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Jaisalmer', phone: '02992-252321', type: 'Government' }], colleges: [{ name: 'Govt. College Jaisalmer', phone: '02992-252200', type: 'Government' }], hotels: [{ name: 'Hotel Suryagarh', phone: '02992-269269', type: 'Luxury' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Jalore': { hi: 'जालोर', population: '18 Lakh+', area: '10,640 km²', pincode: '343001', hospitals: [{ name: 'District Hospital Jalore', phone: '02973-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Jalore', phone: '02973-222321', type: 'Government' }], colleges: [{ name: 'Govt. College Jalore', phone: '02973-222200', type: 'Government' }], hotels: [{ name: 'Hotel Jalore', phone: '02973-224455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Jhalawar': { hi: 'झालावाड़', population: '14 Lakh+', area: '6,219 km²', pincode: '326001', hospitals: [{ name: 'District Hospital Jhalawar', phone: '07432-232100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Jhalawar', phone: '07432-232321', type: 'Government' }], colleges: [{ name: 'Govt. College Jhalawar', phone: '07432-232200', type: 'Government' }], hotels: [{ name: 'Hotel Jhalawar', phone: '07432-234455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Jhunjhunu': { hi: 'झुंझुनूं', population: '21 Lakh+', area: '5,928 km²', pincode: '333001', hospitals: [{ name: 'District Hospital Jhunjhunu', phone: '01592-232100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Kendriya Vidyalaya Jhunjhunu', phone: '01592-232321', type: 'Central' }], colleges: [{ name: 'Govt. College Jhunjhunu', phone: '01592-232200', type: 'Government' }], hotels: [{ name: 'Hotel Jhunjhunu', phone: '01592-234455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Karauli': { hi: 'करौली', population: '14 Lakh+', area: '5,530 km²', pincode: '322241', hospitals: [{ name: 'District Hospital Karauli', phone: '07464-220100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Karauli', phone: '07464-220321', type: 'Government' }], colleges: [{ name: 'Govt. College Karauli', phone: '07464-220200', type: 'Government' }], hotels: [{ name: 'Hotel Karauli', phone: '07464-224455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Nagaur': { hi: 'नागौर', population: '33 Lakh+', area: '17,718 km²', pincode: '341001', hospitals: [{ name: 'District Hospital Nagaur', phone: '01582-243100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Nagaur', phone: '01582-243321', type: 'Government' }], colleges: [{ name: 'Govt. College Nagaur', phone: '01582-243200', type: 'Government' }], hotels: [{ name: 'Hotel Nagaur', phone: '01582-244455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Pali': { hi: 'पाली', population: '20 Lakh+', area: '12,387 km²', pincode: '306401', hospitals: [{ name: 'District Hospital Pali', phone: '02932-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Pali', phone: '02932-222321', type: 'Government' }], colleges: [{ name: 'Govt. College Pali', phone: '02932-222200', type: 'Government' }], hotels: [{ name: 'Hotel Pali', phone: '02932-224455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Pratapgarh': { hi: 'प्रतापगढ़', population: '8 Lakh+', area: '4,117 km²', pincode: '312605', hospitals: [{ name: 'District Hospital Pratapgarh', phone: '01478-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Pratapgarh', phone: '01478-222321', type: 'Government' }], colleges: [{ name: 'Govt. College Pratapgarh', phone: '01478-222200', type: 'Government' }], hotels: [{ name: 'Hotel Pratapgarh', phone: '01478-224455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Rajsamand': { hi: 'राजसमंद', population: '11 Lakh+', area: '4,768 km²', pincode: '313324', hospitals: [{ name: 'District Hospital Rajsamand', phone: '02952-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Rajsamand', phone: '02952-222321', type: 'Government' }], colleges: [{ name: 'Govt. College Rajsamand', phone: '02952-222200', type: 'Government' }], hotels: [{ name: 'Hotel Rajsamand', phone: '02952-224455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Sawai Madhopur': { hi: 'सवाई माधोपुर', population: '13 Lakh+', area: '5,043 km²', pincode: '322001', hospitals: [{ name: 'District Hospital Sawai Madhopur', phone: '07462-220100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Sawai Madhopur', phone: '07462-220321', type: 'Government' }], colleges: [{ name: 'Govt. College Sawai Madhopur', phone: '07462-220200', type: 'Government' }], hotels: [{ name: 'Ranthambore Regency', phone: '07462-223999', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Sikar': { hi: 'सीकर', population: '26 Lakh+', area: '7,732 km²', pincode: '332001', hospitals: [{ name: 'District Hospital Sikar', phone: '01572-252100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Kendriya Vidyalaya Sikar', phone: '01572-252321', type: 'Central' }], colleges: [{ name: 'Govt. College Sikar', phone: '01572-252200', type: 'Government' }], hotels: [{ name: 'Hotel Sikar', phone: '01572-254455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Sirohi': { hi: 'सिरोही', population: '10 Lakh+', area: '5,136 km²', pincode: '307001', hospitals: [{ name: 'District Hospital Sirohi', phone: '02972-222100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Sirohi', phone: '02972-222321', type: 'Government' }], colleges: [{ name: 'Govt. College Sirohi', phone: '02972-222200', type: 'Government' }], hotels: [{ name: 'Mount Abu Hotel', phone: '02974-235151', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Tonk': { hi: 'टोंक', population: '14 Lakh+', area: '7,194 km²', pincode: '304001', hospitals: [{ name: 'District Hospital Tonk', phone: '01432-244100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Tonk', phone: '01432-244321', type: 'Government' }], colleges: [{ name: 'Govt. College Tonk', phone: '01432-244200', type: 'Government' }], hotels: [{ name: 'Hotel Tonk', phone: '01432-244455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Bundi': { hi: 'बूंदी', population: '11 Lakh+', area: '5,550 km²', pincode: '323001', hospitals: [{ name: 'District Hospital Bundi', phone: '0747-2444100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Bundi', phone: '0747-2444321', type: 'Government' }], colleges: [{ name: 'Govt. College Bundi', phone: '0747-2444200', type: 'Government' }], hotels: [{ name: 'Hotel Bundi Haveli', phone: '0747-2443311', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Banswara': { hi: 'बांसवाड़ा', population: '17 Lakh+', area: '5,037 km²', pincode: '327001', hospitals: [{ name: 'District Hospital Banswara', phone: '02962-242100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Govt. School Banswara', phone: '02962-242321', type: 'Government' }], colleges: [{ name: 'Govt. College Banswara', phone: '02962-242200', type: 'Government' }], hotels: [{ name: 'Hotel Banswara', phone: '02962-244455', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
  'Chittorgarh': { hi: 'चित्तौड़गढ़', population: '15 Lakh+', area: '10,856 km²', pincode: '312001', hospitals: [{ name: 'District Hospital Chittorgarh', phone: '01472-240100', type: 'Government' }, { name: 'Ambulance', phone: '108', type: 'Emergency' }], schools: [{ name: 'Kendriya Vidyalaya Chittorgarh', phone: '01472-240321', type: 'Central' }], colleges: [{ name: 'Govt. College Chittorgarh', phone: '01472-240200', type: 'Government' }], hotels: [{ name: 'Hotel Padmini Palace', phone: '01472-241718', type: 'Hotel' }], emergency: [{ name: 'Police', phone: '100' }, { name: 'Ambulance', phone: '108' }] },
};

export default function CityInfoPage({ isOpen, onClose, lang }: CityInfoProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const districtNames = Object.keys(DISTRICTS);
  const filtered = search ? districtNames.filter(d =>
    d.toLowerCase().includes(search.toLowerCase()) ||
    DISTRICTS[d].hi.includes(search)
  ) : districtNames;

  const district = selected ? DISTRICTS[selected] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            {selected && (
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
            )}
            <MapPin size={20} className="text-[#075E54]" />
            <div>
              <h2 className="font-black text-slate-900 text-base">
                {selected ? (lang === 'en' ? selected : DISTRICTS[selected].hi) : (lang === 'en' ? '🗺️ Rajasthan District Info' : '🗺️ राजस्थान जिला जानकारी')}
              </h2>
              <p className="text-[10px] text-slate-400">
                {selected ? `${district.population} population • PIN: ${district.pincode}` : `${districtNames.length} districts • Hospitals, Schools, Hotels`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">

          {/* District List */}
          {!selected && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="District dhundho..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm" />
              </div>

              <p className="text-xs text-slate-500">Kisi bhi district pe click karo → Hospitals, Schools, Hotels ki jankari paao</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filtered.map(name => (
                  <button key={name} onClick={() => setSelected(name)}
                    className="flex flex-col items-start p-3 bg-slate-50 hover:bg-[#eefaf7] hover:border-[#128C7E]/30 border border-slate-100 rounded-xl cursor-pointer transition-all text-left group">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin size={11} className="text-[#075E54] flex-shrink-0" />
                      <span className="text-xs font-black text-slate-800 group-hover:text-[#075E54] leading-tight">{name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{DISTRICTS[name].hi}</span>
                    <span className="text-[9px] text-slate-300 mt-0.5">{DISTRICTS[name].population}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* District Detail */}
          {selected && district && (
            <div className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Population', value: district.population },
                  { label: 'Area', value: district.area },
                  { label: 'PIN Code', value: district.pincode },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xs font-black text-slate-800">{s.value}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Hospitals */}
              <Section icon={<Heart size={14} className="text-red-500" />} title="🏥 Hospitals" color="red">
                {district.hospitals.map((h: any, i: number) => (
                  <InfoCard key={i} name={h.name} phone={h.phone} badge={h.type} />
                ))}
              </Section>

              {/* Schools */}
              <Section icon={<GraduationCap size={14} className="text-blue-500" />} title="🏫 Schools" color="blue">
                {district.schools.map((s: any, i: number) => (
                  <InfoCard key={i} name={s.name} phone={s.phone} badge={s.type} />
                ))}
              </Section>

              {/* Colleges */}
              <Section icon={<Building2 size={14} className="text-purple-500" />} title="🎓 Colleges / University" color="purple">
                {district.colleges.map((c: any, i: number) => (
                  <InfoCard key={i} name={c.name} phone={c.phone} badge={c.type} />
                ))}
              </Section>

              {/* Hotels */}
              <Section icon={<Hotel size={14} className="text-amber-500" />} title="🏨 Hotels & Dharamshala" color="amber">
                {district.hotels.map((h: any, i: number) => (
                  <InfoCard key={i} name={h.name} phone={h.phone} badge={h.type} />
                ))}
              </Section>

              {/* Emergency */}
              <Section icon={<Phone size={14} className="text-green-500" />} title="📞 Emergency Numbers" color="green">
                {district.emergency.map((e: any, i: number) => (
                  <InfoCard key={i} name={e.name} phone={e.phone} badge="Emergency" />
                ))}
              </Section>

              <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-3 text-xs text-[#075E54] text-center">
                <p className="font-black mb-0.5">Jobs dhundh rahe hain {selected} mein?</p>
                <p>sriganganagarjobs.in pe free job post karein ya dhundhen!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, color, children }: any) {
  const colors: any = {
    red: 'bg-red-50 border-red-100',
    blue: 'bg-blue-50 border-blue-100',
    purple: 'bg-purple-50 border-purple-100',
    amber: 'bg-amber-50 border-amber-100',
    green: 'bg-green-50 border-green-100',
  };
  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-black text-slate-800">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoCard({ name, phone, badge }: { name: string; phone: string; badge: string }) {
  return (
    <div className="bg-white rounded-xl p-3 flex items-center justify-between gap-2 border border-white shadow-sm">
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-800 leading-tight">{name}</p>
        <span className="text-[9px] text-slate-400 font-medium">{badge}</span>
      </div>
      <a href={`tel:${phone}`}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#25D366] text-slate-900 font-black text-[10px] rounded-lg flex-shrink-0 hover:bg-[#20ba5a] transition-colors">
        <Phone size={9} />{phone}
      </a>
    </div>
  );
}
