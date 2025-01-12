import { Contact, parseCsvContacts } from './contact';

const TEST_GOOGLE_CSV = `First Name,Middle Name,Last Name,Title,Suffix,Web Page,Birthday,Anniversary,Notes,E-mail Address,E-mail 2 Address,E-mail 3 Address,Primary Phone,Home Phone,Home Phone 2,Mobile Phone,Pager,Home Fax,Home Address,Home Street,Home Street 2,Home Street 3,Home Address PO Box,Home City,Home State,Home Postal Code,Home Country,Spouse,Children,Manager's Name,Assistant's Name,Referred By,Company Main Phone,Business Phone,Business Phone 2,Business Fax,Assistant's Phone,Company,Job Title,Department,Business Address,Business Street,Business Street 2,Business Street 3,Business Address PO Box,Business City,Business State,Business Postal Code,Business Country,Other Phone,Other Fax,Other Address,Other Street,Other Street 2,Other Street 3,Other Address PO Box,Other City,Other State,Other Postal Code,Other Country,Callback,Car Phone,ISDN,Radio Phone,TTY/TDD Phone,Telex,Categories
John,,Doe,,,,,,,,,,,,,91551000,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,myContacts;starred
Jane,,Doe,,,,,,,,,,,,,+4741644000,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,myContacts;starred
,,,,,,,,,mail@mail.com,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
Norway,,Doe,,,,,,,mail@hotmail.com,,,,,,+47 111111,,,"Industrigata 50B
Oslo, 0357
Norway",50B Industrigata,,,,Oslo,,0357,Norway,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,Restored from Samsung - SM-G950F;myContacts
John,,Cruickshank,,,,,,,,,,,,,+474800000,,,"Vardåslia 10
Kristiansand S 4637
Norway",10 Vardåslia,,,,Kristiansand S,,4637,Norway,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,myContacts
`;

const TEST_OUTLOOK_CSV = `First Name,Middle Name,Last Name,Title,Suffix,Nickname,Given Yomi,Surname Yomi,E-mail Address,E-mail 2 Address,E-mail 3 Address,Home Phone,Home Phone 2,Business Phone,Business Phone 2,Mobile Phone,Car Phone,Other Phone,Primary Phone,Pager,Business Fax,Home Fax,Other Fax,Company Main Phone,Callback,Radio Phone,Telex,TTY/TDD Phone,IMAddress,Job Title,Department,Company,Office Location,Manager's Name,Assistant's Name,Assistant's Phone,Company Yomi,Business Street,Business City,Business State,Business Postal Code,Business Country/Region,Home Street,Home City,Home State,Home Postal Code,Home Country/Region,Other Street,Other City,Other State,Other Postal Code,Other Country/Region,Personal Web Page,Spouse,Schools,Hobby,Location,Web Page,Birthday,Anniversary,Notes
Larsen,,,,,,,,,,,,,,,+47 466 88 000,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
Svein,,Heimdal,,,,,,,,,,,,,901 06 000,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
`;

const TEST_MULTILINE_CSV = `First Name,Last Name,Home Address
John,Doe,"123 Main St
Apt 4B
New York, NY 10001"
Jane,Smith,"456 Oak Road,
Suite 789"`;

describe('Contact Parser', () => {
  it('should parse Google CSV format correctly', () => {
    const contacts = parseCsvContacts(TEST_GOOGLE_CSV);

    expect(contacts.length).toBe(5);

    console.log(contacts);

    // Verify first contact (John Doe)
    expect(contacts[0]).toEqual(
      jasmine.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        mobilePhone: '91551000',
        categories: 'myContacts;starred',
      })
    );

    expect(contacts[1]).toEqual(
        jasmine.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          mobilePhone: '+4741644000',
          categories: 'myContacts;starred',
        })
      );

    expect(contacts[2]).toEqual(
      jasmine.objectContaining({
        emailAddress: 'mail@mail.com',
      })
    );

    // Verify contact with address (Norway Doe)
    expect(contacts[3]).toEqual(
      jasmine.objectContaining({
        firstName: 'Norway',
        lastName: 'Doe',
        emailAddress: 'mail@hotmail.com',
        mobilePhone: '+47 111111',
        homeStreet: '50B Industrigata',
        homeCity: 'Oslo',
        homePostalCode: '0357',
        homeCountry: 'Norway',
      })
    );

    expect(contacts[4]).toEqual(
        jasmine.objectContaining({
          lastName: 'Cruickshank',
        })
      );
  });

  it('should parse Outlook CSV format correctly', () => {
    const contacts = parseCsvContacts(TEST_OUTLOOK_CSV);

    expect(contacts.length).toBe(2);

    // Verify first contact (Larsen)
    expect(contacts[0]).toEqual(
      jasmine.objectContaining({
        firstName: 'Larsen',
        mobilePhone: '+47 466 88 000',
      })
    );

    // Verify second contact (Svein)
    expect(contacts[1]).toEqual(
      jasmine.objectContaining({
        firstName: 'Svein',
        lastName: 'Heimdal',
        mobilePhone: '901 06 000',
      })
    );
  });

  it('should handle empty CSV content', () => {
    expect(parseCsvContacts('')).toEqual([]);
    expect(parseCsvContacts('header1,header2\n')).toEqual([]);
  });

  it('should handle multiline values in CSV', () => {
    const contacts = parseCsvContacts(TEST_MULTILINE_CSV);
    
    expect(contacts.length).toBe(2);
    expect(contacts[0]).toEqual(
      jasmine.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        homeAddress: '123 Main St\nApt 4B\nNew York, NY 10001'
      })
    );

    expect(contacts[1]).toEqual(
      jasmine.objectContaining({
        firstName: 'Jane',
        lastName: 'Smith',
        homeAddress: '456 Oak Road,\nSuite 789'
      })
    );
  });
  
  it('should handle escaped quotes in CSV', () => {
    const csvWithQuotes = `First Name,Notes
John,"Quote ""test"" here"`;
    
    const contacts = parseCsvContacts(csvWithQuotes);
    expect(contacts[0].notes).toBe('Quote "test" here');
  });
});
