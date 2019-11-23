
export as namespace AwesomePhonenumber;

declare namespace AwesomePhonenumber
{
	type PhoneNumberFormat =
		| 'e164'
		| 'international'
		| 'national'
		| 'rfc3966'
		| 'significant';

	type PhoneNumberTypes =
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

	type PhoneNumberPossibility =
		| 'is-possible'
		| 'invalid-country-code'
		| 'too-long'
		| 'too-short'
		| 'unknown';

	interface ParsedPhoneNumberNumbers< T >
	{
		input: string;
		international: T;
		national: T;
		e164: T;
		rfc3966: T;
		significant: T;
	}

	interface ParsedPhoneNumberBase
	{
		canBeInternationallyDialled: boolean;
		possible: boolean;
		type,
		mobile: boolean;
		fixedLine: boolean;
		possibility: PhoneNumberPossibility;
		regionCode: string;
		countryCode: number;
	}

	interface ValidParsedPhoneNumber extends ParsedPhoneNumberBase
	{
		number: ParsedPhoneNumberNumbers< string >;
		numberFrom: ( regionCode: string ) => string;
		valid: true;
		ok: boolean;
	}
	interface InvalidParsedPhoneNumber extends ParsedPhoneNumberBase
	{
		number: ParsedPhoneNumberNumbers< undefined >;
		numberFrom: ( regionCode: string ) => undefined;
		valid: false;
		ok: false;
	}

	type ParsedPhoneNumber =
		( ValidParsedPhoneNumber | InvalidParsedPhoneNumber );
}

export interface AsYouType
{
	addChar( char: string ): string;
	number( ): string;
	removeChar( ): string;
	reset( number?: string ): string;
	getPhoneNumber( ): AwesomePhonenumber.ParsedPhoneNumber;
}

export function parse( phoneNumber: string, countryCode?: string )
: AwesomePhonenumber.ParsedPhoneNumber;

export function getCountryCodeForRegionCode( regionCode: string ): number;
export function getRegionCodeForCountryCode( countryCode: number ): string;
export function getSupportedCallingCodes( ): Array< string >;
export function getSupportedRegionCodes( ): Array< string >;

export function getExample(
	regionCode: string,
	type?: AwesomePhonenumber.PhoneNumberTypes
): AwesomePhonenumber.ParsedPhoneNumber;

export function getAsYouType( regionCode: string ): AsYouType;

export default parse;
