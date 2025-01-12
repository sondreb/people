export interface Contact {
  id?: number;
  imageUrl?: string;
  anniversary?: Date;
  assistantName?: string;
  assistantPhone?: string;
  birthday?: Date;
  businessAddress?: string;
  businessAddressPOBox?: string;
  businessCity?: string;
  businessCountry?: string;
  businessCountryRegion?: string;
  businessFax?: string;
  businessPhone?: string;
  businessPhone2?: string;
  businessPostalCode?: string;
  businessState?: string;
  businessStreet?: string;
  businessStreet2?: string;
  businessStreet3?: string;
  callback?: string;
  carPhone?: string;
  categories?: string;
  children?: string;
  company?: string;
  companyMainPhone?: string;
  companyYomi?: string;
  department?: string;
  email2Address?: string;
  email3Address?: string;
  emailAddress?: string;
  firstName?: string;
  givenYomi?: string;
  hobby?: string;
  homeAddress?: string;
  homeAddressPOBox?: string;
  homeCity?: string;
  homeCountry?: string;
  homeCountryRegion?: string;
  homeFax?: string;
  homePhone?: string;
  homePhone2?: string;
  homePostalCode?: string;
  homeState?: string;
  homeStreet?: string;
  homeStreet2?: string;
  homeStreet3?: string;
  imAddress?: string;
  isdn?: string;
  jobTitle?: string;
  lastName?: string;
  location?: string;
  managerName?: string;
  middleName?: string;
  mobilePhone?: string;
  nickname?: string;
  notes?: string;
  officeLocation?: string;
  otherAddress?: string;
  otherAddressPOBox?: string;
  otherCity?: string;
  otherCountry?: string;
  otherCountryRegion?: string;
  otherFax?: string;
  otherPhone?: string;
  otherPostalCode?: string;
  otherState?: string;
  otherStreet?: string;
  otherStreet2?: string;
  otherStreet3?: string;
  pager?: string;
  personalWebPage?: string;
  primaryPhone?: string;
  radioPhone?: string;
  referredBy?: string;
  schools?: string;
  spouse?: string;
  suffix?: string;
  surnameYomi?: string;
  ttyTddPhone?: string;
  telex?: string;
  title?: string;
  webPage?: string;
}

const headerMapping: { [key: string]: keyof Contact } = {
  'Anniversary': 'anniversary',
  'Assistant\'s Name': 'assistantName',
  'Assistant\'s Phone': 'assistantPhone',
  'Birthday': 'birthday',
  'Business Address': 'businessAddress',
  'Business Address PO Box': 'businessAddressPOBox',
  'Business City': 'businessCity',
  'Business Country': 'businessCountry',
  'Business Country/Region': 'businessCountryRegion',
  'Business Fax': 'businessFax',
  'Business Phone': 'businessPhone',
  'Business Phone 2': 'businessPhone2',
  'Business Postal Code': 'businessPostalCode',
  'Business State': 'businessState',
  'Business Street': 'businessStreet',
  'Business Street 2': 'businessStreet2',
  'Business Street 3': 'businessStreet3',
  'Callback': 'callback',
  'Car Phone': 'carPhone',
  'Categories': 'categories',
  'Children': 'children',
  'Company': 'company',
  'Company Main Phone': 'companyMainPhone',
  'Company Yomi': 'companyYomi',
  'Department': 'department',
  'E-mail 2 Address': 'email2Address',
  'E-mail 3 Address': 'email3Address',
  'E-mail Address': 'emailAddress',
  'First Name': 'firstName',
  'Given Yomi': 'givenYomi',
  'Hobby': 'hobby',
  'Home Address': 'homeAddress',
  'Home Address PO Box': 'homeAddressPOBox',
  'Home City': 'homeCity',
  'Home Country': 'homeCountry',
  'Home Country/Region': 'homeCountryRegion',
  'Home Fax': 'homeFax',
  'Home Phone': 'homePhone',
  'Home Phone 2': 'homePhone2',
  'Home Postal Code': 'homePostalCode',
  'Home State': 'homeState',
  'Home Street': 'homeStreet',
  'Home Street 2': 'homeStreet2',
  'Home Street 3': 'homeStreet3',
  'IM Address': 'imAddress',
  'ISDN': 'isdn',
  'Job Title': 'jobTitle',
  'Last Name': 'lastName',
  'Location': 'location',
  'Manager\'s Name': 'managerName',
  'Middle Name': 'middleName',
  'Mobile Phone': 'mobilePhone',
  'Nickname': 'nickname',
  'Notes': 'notes',
  'Office Location': 'officeLocation',
  'Other Address': 'otherAddress',
  'Other Address PO Box': 'otherAddressPOBox',
  'Other City': 'otherCity',
  'Other Country': 'otherCountry',
  'Other Country/Region': 'otherCountryRegion',
  'Other Fax': 'otherFax',
  'Other Phone': 'otherPhone',
  'Other Postal Code': 'otherPostalCode',
  'Other State': 'otherState',
  'Other Street': 'otherStreet',
  'Other Street 2': 'otherStreet2',
  'Other Street 3': 'otherStreet3',
  'Pager': 'pager',
  'Personal Web Page': 'personalWebPage',
  'Primary Phone': 'primaryPhone',
  'Radio Phone': 'radioPhone',
  'Referred By': 'referredBy',
  'Schools': 'schools',
  'Spouse': 'spouse',
  'Suffix': 'suffix',
  'Surname Yomi': 'surnameYomi',
  'TTY/TDD Phone': 'ttyTddPhone',
  'Telex': 'telex',
  'Title': 'title',
  'Web Page': 'webPage'
};

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        currentValue += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  values.push(currentValue.trim());
  return values;
}

export function parseCsvContacts(csvContent: string): Contact[] {
  if (!csvContent) return [];

  // Split into lines but preserve newlines within quoted fields
  const lines: string[] = [];
  let currentLine = '';
  let insideQuotes = false;

  csvContent.split('').forEach(char => {
    if (char === '"') {
      insideQuotes = !insideQuotes;
      currentLine += char;
    } else if (char === '\n' && !insideQuotes) {
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += char;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const contacts: Contact[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const contact: Partial<Contact> = {};

    headers.forEach((header, index) => {
      const mappedProperty = headerMapping[header];
      if (mappedProperty) {
        let value = values[index];
        if (value) {
          // Remove surrounding quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"');
          }
          
          if (mappedProperty === 'anniversary' || mappedProperty === 'birthday') {
            contact[mappedProperty] = new Date(value);
          } else {
            (contact as any)[mappedProperty] = value;
          }
        }
      }
    });

    contacts.push(contact as Contact);
  }

  return contacts;
}
