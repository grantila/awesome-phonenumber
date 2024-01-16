export type PhoneNumberFormat =
	| 'e164'
	| 'international'
	| 'national'
	| 'rfc3966'
	| 'significant';

export type PhoneNumberTypes =
	| 'fixed-line'
	| 'fixed-line-or-mobile'
	| 'mobile'
	| 'pager'
	| 'personal-number'
	| 'premium-rate'
	| 'shared-cost'
	| 'toll-free'
	| 'uan'
	| 'voip'
	| 'unknown';

export type PhoneNumberPossibility =
	| 'is-possible'
	| 'invalid'
	| 'invalid-country-code'
	| 'too-long'
	| 'too-short';

/**
 * Parse a phone number into an object describing the number.
 *
 * @example
 *   ```ts
 *   // Using a national phone number format
 *   parsePhoneNumber( '0707123456', { regionCode: 'SE' } )
 *   // Using an international (e164) phone number format
 *   parsePhoneNumber( '+46707123456' )
 *   ```
 *
 * The options object is on the form:
 *   ```ts
 *   {
 *     regionCode?: Alpha2CountryCode;
 *   }
 *   ```
 *
 * @param phoneNumber Either an `e164` formatted (international) phone number
 *                    or a _national_ phone number.
 * @param options     Object of type {@link PhoneNumberParseOptions}.
 * @returns A {@link ParsedPhoneNumber}
 */
export function parsePhoneNumber(
	phoneNumber: string,
	options?: PhoneNumberParseOptions
): ParsedPhoneNumber;

export interface PhoneNumberParseOptions
{
	/**
	 * If the phone number is on national form, this region code specifies the
	 * region of the phone number, e.g. "SE" for Sweden.
	 */
	regionCode?: Alpha2CountryCode;
}

export interface ParsedPhoneNumberFull
{
	number: {
		input: string;
		international: string;
		national: string;
		e164: string;
		rfc3966: string;
		significant: string;
	};
	possibility: PhoneNumberPossibility;
	regionCode: Alpha2CountryCode;
	valid: boolean;
	possible: boolean;
	canBeInternationallyDialled: boolean;
	type: PhoneNumberTypes;
	countryCode: number;
	typeIsMobile: boolean;
	typeIsFixedLine: boolean;
}

export type ParsedPhoneNumberValid =
	& Omit< ParsedPhoneNumberFull, 'valid' >
	& { valid: true; };

export type ParsedPhoneNumberInvalid =
	& Partial< Omit< ParsedPhoneNumberFull, 'valid' | 'possible' | 'possibility' > >
	& {
		valid: false;
		possible: boolean;
		possibility: PhoneNumberPossibility;
		error?: unknown;
	};

export type ParsedPhoneNumber =
	| ParsedPhoneNumberValid
	| ParsedPhoneNumberInvalid;

export function getCountryCodeForRegionCode( regionCode: Alpha2CountryCode ): number;
export function getRegionCodeForCountryCode( countryCode: number ): Alpha2CountryCode;
export function getSupportedCallingCodes( ): string[ ];
export function getSupportedRegionCodes( ): Alpha2CountryCode[ ];

/**
 * Get an example phone number, given a region code and a phone number
 * {@link PhoneNumberTypes type}.
 *
 * @param regionCode Region code {@link Alpha2CountryCode type}
 * @param type Phone number {@link PhoneNumberTypes type}
 */
export function getExample(
	regionCode: Alpha2CountryCode,
	type?: PhoneNumberTypes
): ParsedPhoneNumber;


/**
 * Get a phonenumber string as it would be called from another country.
 *
 * @param parsedPhoneNumber A phone number object as returned from {@link parsePhoneNumber `parsePhoneNumber()`}
 * @param regionCode Region code of the country to call from {@link Alpha2CountryCode type}
 */
export function getNumberFrom(
	parsedPhoneNumber: ParsedPhoneNumberValid,
	regionCode?: Alpha2CountryCode
): PhoneNumberFrom;

export type PhoneNumberFrom =
	| PhoneNumberFromValid
	| PhoneNumberFromInvalid;

export interface PhoneNumberFromValid
{
	valid: true;
	number: string;
}

export interface PhoneNumberFromInvalid
{
	valid: false;
	number?: string;
	error?: unknown;
}


/**
 * Get an instance of the AsYouType class, based on a region code.
 *
 * @param regionCode The region code to get an AsYouType instance for.  {@link Alpha2CountryCode type}
 */
export function getAsYouType( regionCode: Alpha2CountryCode ): AsYouType;


export class AsYouType
{
	private constructor( );

	addChar( char: string ): string;
	number( ): string;
	removeChar( ): string;
	reset( number?: string ): string;
	getPhoneNumber( ): ParsedPhoneNumber;
}

// /** @deprecated use `parsePhoneNumber()` instead */
// export default PhoneNumber;

/**
 * ISO 3166-1 alpha-2 region codes. Find the corresponding region {@link https://www.iso.org/obp/ui/#search/code/ here}.
 */
export type Alpha2CountryCode =
  | "AD"
  | "AE"
  | "AF"
  | "AG"
  | "AI"
  | "AL"
  | "AM"
  | "AO"
  | "AQ"
  | "AR"
  | "AS"
  | "AT"
  | "AU"
  | "AW"
  | "AX"
  | "AZ"
  | "BA"
  | "BB"
  | "BD"
  | "BE"
  | "BF"
  | "BG"
  | "BH"
  | "BI"
  | "BJ"
  | "BL"
  | "BM"
  | "BN"
  | "BO"
  | "BQ"
  | "BR"
  | "BS"
  | "BT"
  | "BV"
  | "BW"
  | "BY"
  | "BZ"
  | "CA"
  | "CC"
  | "CD"
  | "CF"
  | "CG"
  | "CH"
  | "CI"
  | "CK"
  | "CL"
  | "CM"
  | "CN"
  | "CO"
  | "CR"
  | "CU"
  | "CV"
  | "CW"
  | "CX"
  | "CY"
  | "CZ"
  | "DE"
  | "DJ"
  | "DK"
  | "DM"
  | "DO"
  | "DZ"
  | "EC"
  | "EE"
  | "EG"
  | "EH"
  | "ER"
  | "ES"
  | "ET"
  | "FI"
  | "FJ"
  | "FK"
  | "FM"
  | "FO"
  | "FR"
  | "GA"
  | "GB"
  | "GD"
  | "GE"
  | "GF"
  | "GG"
  | "GH"
  | "GI"
  | "GL"
  | "GM"
  | "GN"
  | "GP"
  | "GQ"
  | "GR"
  | "GS"
  | "GT"
  | "GU"
  | "GW"
  | "GY"
  | "HK"
  | "HM"
  | "HN"
  | "HR"
  | "HT"
  | "HU"
  | "ID"
  | "IE"
  | "IL"
  | "IM"
  | "IN"
  | "IO"
  | "IQ"
  | "IR"
  | "IS"
  | "IT"
  | "JE"
  | "JM"
  | "JO"
  | "JP"
  | "KE"
  | "KG"
  | "KH"
  | "KI"
  | "KM"
  | "KN"
  | "KP"
  | "KR"
  | "KW"
  | "KY"
  | "KZ"
  | "LA"
  | "LB"
  | "LC"
  | "LI"
  | "LK"
  | "LR"
  | "LS"
  | "LT"
  | "LU"
  | "LV"
  | "LY"
  | "MA"
  | "MC"
  | "MD"
  | "ME"
  | "MF"
  | "MG"
  | "MH"
  | "MK"
  | "ML"
  | "MM"
  | "MN"
  | "MO"
  | "MP"
  | "MQ"
  | "MR"
  | "MS"
  | "MT"
  | "MU"
  | "MV"
  | "MW"
  | "MX"
  | "MY"
  | "MZ"
  | "NA"
  | "NC"
  | "NE"
  | "NF"
  | "NG"
  | "NI"
  | "NL"
  | "NO"
  | "NP"
  | "NR"
  | "NU"
  | "NZ"
  | "OM"
  | "PA"
  | "PE"
  | "PF"
  | "PG"
  | "PH"
  | "PK"
  | "PL"
  | "PM"
  | "PN"
  | "PR"
  | "PS"
  | "PT"
  | "PW"
  | "PY"
  | "QA"
  | "RE"
  | "RO"
  | "RS"
  | "RU"
  | "RW"
  | "SA"
  | "SB"
  | "SC"
  | "SD"
  | "SE"
  | "SG"
  | "SH"
  | "SI"
  | "SJ"
  | "SK"
  | "SL"
  | "SM"
  | "SN"
  | "SO"
  | "SR"
  | "SS"
  | "ST"
  | "SV"
  | "SX"
  | "SY"
  | "SZ"
  | "TC"
  | "TD"
  | "TF"
  | "TG"
  | "TH"
  | "TJ"
  | "TK"
  | "TL"
  | "TM"
  | "TN"
  | "TO"
  | "TR"
  | "TT"
  | "TV"
  | "TW"
  | "TZ"
  | "UA"
  | "UG"
  | "UM"
  | "US"
  | "UY"
  | "UZ"
  | "VA"
  | "VC"
  | "VE"
  | "VG"
  | "VI"
  | "VN"
  | "VU"
  | "WF"
  | "WS"
  | "XK"
  | "YE"
  | "YT"
  | "ZA"
  | "ZM"
  | "ZW";
