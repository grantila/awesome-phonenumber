const {
  parsePhoneNumber,
  getExample,
  getAsYouType,
  getCountryCodeForRegionCode,
  getRegionCodeForCountryCode,
  getSupportedCallingCodes,
  getSupportedRegionCodes,
} = require('awesome-phonenumber');

describe('general', () => {
  it('should be able to parse a phone number', () => {
    var pn = parsePhoneNumber('0707123456', { regionCode: 'SE' });
    expect(pn.valid).toBe(true);
    expect(pn.possible).toBe(true);
    expect(pn.typeIsMobile).toBe(true);
    expect(pn.number.significant).toBe('707123456');
    expect(pn.canBeInternationallyDialled).toBe(true);
  });

  it('should be able to create an example phone number', () => {
    var pn1 = getExample('SE');
    expect(pn1.valid).toBe(true);
    expect(pn1.possible).toBe(true);

    var pn2 = getExample('SE', 'mobile');
    expect(pn2.valid).toBe(true);
    expect(pn2.possible).toBe(true);
    expect(pn2.typeIsMobile).toBe(true);
    expect(pn2.typeIsFixedLine).toBe(false);

    var pn3 = getExample('SE', 'fixed-line');
    expect(pn3.valid).toBe(true);
    expect(pn3.possible).toBe(true);
    expect(pn3.typeIsMobile).toBe(false);
    expect(pn3.typeIsFixedLine).toBe(true);
  });

  it('should be able to format as-you-type', () => {
    var ayt = getAsYouType('SE');
    expect(ayt.addChar('0')).toBe('0');
    expect(ayt.addChar('7')).toBe('07');
    expect(ayt.addChar('0')).toBe('070');
    expect(ayt.addChar('7')).toBe('070-7');
    expect(ayt.addChar('1')).toBe('070-71');
    expect(ayt.addChar('2')).toBe('070-712');

    var pn1 = ayt.getPhoneNumber();
    expect(pn1.valid).toBe(false);

    expect(ayt.addChar('3')).toBe('070-712 3');
    expect(ayt.addChar('4')).toBe('070-712 34');
    expect(ayt.addChar('5')).toBe('070-712 34 5');
    expect(ayt.addChar('6')).toBe('070-712 34 56');

    var pn2 = ayt.getPhoneNumber();
    expect(pn2.valid).toBe(true);
    expect(pn2.possible).toBe(true);
  });

  it('should be able to convert country code <-> region code', () => {
    expect(getCountryCodeForRegionCode('SE')).toBe(46);
    expect(getRegionCodeForCountryCode(46)).toBe('SE');
  });

  it('should be possible to get region code', () => {
    var pn = parsePhoneNumber('0707123456', { regionCode: 'SE' });
    expect(pn.regionCode).toBe('SE');
  });

  it('should have supported calling codes', () => {
    const codes = getSupportedCallingCodes();
    expect(codes.length).toBeGreaterThan(100);
  });

  it('should have supported calling regions', () => {
    const regions = getSupportedRegionCodes();
    expect(regions.length).toBeGreaterThan(100);
  });

  it('should parse the singapore number correctly', () => {
    const { valid } = parsePhoneNumber('+6589569999', { regionCode: 'SG' });
    expect(valid).toBe(true);
  });
});
