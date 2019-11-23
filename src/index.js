'use strict';

goog.require('i18n.phonenumbers.AsYouTypeFormatter');
goog.require('i18n.phonenumbers.PhoneNumberFormat');
goog.require('i18n.phonenumbers.PhoneNumberType');
goog.require('i18n.phonenumbers.PhoneNumberUtil');
goog.require('i18n.phonenumbers.PhoneNumberUtil.ValidationResult');

const PhoneNumberType = i18n.phonenumbers.PhoneNumberType;
const PhoneNumberFormat = i18n.phonenumbers.PhoneNumberFormat;
const ValidationResult = i18n.phonenumbers.PhoneNumberUtil.ValidationResult;

const phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance( );

function getNumberType( number )
{
	switch( phoneUtil.getNumberType( number ) )
	{
		case PhoneNumberType.FIXED_LINE:           return 'fixed-line';
		case PhoneNumberType.FIXED_LINE_OR_MOBILE: return 'fixed-line-or-mobile';
		case PhoneNumberType.MOBILE:               return 'mobile';
		case PhoneNumberType.PAGER:                return 'pager';
		case PhoneNumberType.PERSONAL_NUMBER:      return 'personal-number';
		case PhoneNumberType.PREMIUM_RATE:         return 'premium-rate';
		case PhoneNumberType.SHARED_COST:          return 'shared-cost';
		case PhoneNumberType.TOLL_FREE:            return 'toll-free';
		case PhoneNumberType.UAN:                  return 'uan';
		case PhoneNumberType.VOIP:                 return 'voip';
		default:
		case PhoneNumberType.UNKNOWN:              return 'unknown';
	}
}

function toNumberType( exportedName )
{
	switch( exportedName )
	{
		case 'fixed-line':           return PhoneNumberType.FIXED_LINE;
		case 'fixed-line-or-mobile': return PhoneNumberType.FIXED_LINE_OR_MOBILE;
		case 'mobile':               return PhoneNumberType.MOBILE;
		case 'pager':                return PhoneNumberType.PAGER;
		case 'personal-number':      return PhoneNumberType.PERSONAL_NUMBER;
		case 'premium-rate':         return PhoneNumberType.PREMIUM_RATE;
		case 'shared-cost':          return PhoneNumberType.SHARED_COST;
		case 'toll-free':            return PhoneNumberType.TOLL_FREE;
		case 'uan':                  return PhoneNumberType.UAN;
		case 'voip':                 return PhoneNumberType.VOIP;
		default:
		case 'unknown':              return PhoneNumberType.UNKNOWN;
	}
}

function getValidationResult( number )
{
	try
	{
		switch( phoneUtil.isPossibleNumberWithReason( number ) )
		{
			case ValidationResult.IS_POSSIBLE:          return 'is-possible';
			case ValidationResult.INVALID_COUNTRY_CODE: return 'invalid-country-code';
			case ValidationResult.TOO_LONG:             return 'too-long';
			case ValidationResult.TOO_SHORT:            return 'too-short';
		}

		if ( phoneUtil.isPossibleNumber( number ) )
			return 'is-possible';
	} catch ( err ) { }

	return 'unknown';
}

function extractRegionCode( phoneNumber )
{
	var parsed, regionCode;

	if ( phoneNumber.charAt( 0 ) !== '+' )
		return { parsed, regionCode };

	try
	{
		parsed = phoneUtil.parse( phoneNumber );
	} catch ( err ) { }

	if ( parsed )
	{
		regionCode = phoneUtil.getRegionCodeForNumber( parsed );

		if ( regionCode != null && regionCode !== 'ZZ' )
			return { parsed, regionCode };
	}

	for ( var len = 1; len < 4; ++len )
	{
		regionCode = void 0;

		if ( phoneNumber.length < len + 1 )
			return { parsed, regionCode };

		regionCode = getRegionCodeForCountryCode(
			phoneNumber.substring( 1, len + 1 )
		);

		if ( regionCode !== 'ZZ' )
			return { regionCode };
	}

	return { parsed, regionCode: void 0 };
}

function preParse( phoneNumber, regionCode )
{
	if ( regionCode && ( phoneNumber.charAt( 0 ) === '+' ) )
	{
		// Ensure region code is valid
		const cc = getCountryCodeForRegionCode( regionCode );
		if ( phoneNumber.substr( 1, ( '' + cc ).length ) !== '' + cc )
			// Wrong region code, let's fix it
			regionCode = null;
	}

	if ( !regionCode )
	{
		// Guess region code
		let parsed;
		( { regionCode = null, parsed } = extractRegionCode( phoneNumber ) );
		return { regionCode, parsed };
	}

	return { regionCode };
}

function fromNumberUndefined( ) { }

function getParseFailed( phoneNumber, regionCode, possibility )
{
	return {
		[ 'number' ]: {
			[ 'input' ]: phoneNumber,
			[ 'international' ]: undefined,
			[ 'national' ]: undefined,
			[ 'e164' ]: undefined,
			[ 'rfc3966' ]: undefined,
			[ 'significant' ]: undefined,
		},
		[ 'numberFrom' ]: fromNumberUndefined,

		[ 'canBeInternationallyDialled' ]: false,
		[ 'possible' ]: false,
		[ 'valid' ]: false,
		[ 'mobile' ]: false,
		[ 'fixedLine' ]: false,
		[ 'type' ]: 'unknown',
		[ 'possibility' ]: possibility,
		[ 'regionCode' ]: regionCode,
		[ 'countryCode' ]: getCountryCodeForRegionCode( regionCode ),
		[ 'ok' ]: false,
	};
}

function isParsed( parsed )
{
	if ( typeof parsed !== 'object' )
		return false;

	try
	{
		phoneUtil.isValidNumber( parsed );
		return true;
	}
	catch ( e )
	{
		return false;
	}
}

/**
 * Parse a phone number (and a region code hint)
 *
 * @param {string} phoneNumber The input phone number
 * @param {string} regionCode Used unless phone number is e164
 */
function parse( phoneNumber, regionCode )
{
	if ( regionCode != null && typeof regionCode !== 'string' )
		throw new TypeError( "Invalid region code, expected a string" );

	let parsed;
	if ( isParsed( phoneNumber ) )
	{
		parsed = phoneNumber;
		regionCode = phoneUtil.getRegionCodeForNumber( parsed );
	}
	else
	{
		if ( typeof phoneNumber !== 'string' )
			throw new TypeError( "Invalid phone number, expected a string" );

		( { regionCode, parsed } = preParse( phoneNumber, regionCode ) );

		if ( !regionCode )
			return getParseFailed(
				phoneNumber, regionCode, 'invalid-country-code'
			);
		else
		{
			const cc = getCountryCodeForRegionCode( regionCode );
			if ( cc === 0 )
				return getParseFailed(
					phoneNumber, regionCode, 'invalid-country-code'
				);
		}

		try
		{
			if ( !parsed )
				parsed = phoneUtil.parse( phoneNumber, regionCode );
		}
		catch ( e )
		{
			return getParseFailed(
				phoneNumber, regionCode, getValidationResult( phoneNumber )
			);
		}
	}

	const canBeInternationallyDialled =
		phoneUtil.canBeInternationallyDialled( parsed );
	const possible = phoneUtil.isPossibleNumber( parsed );
	const valid = phoneUtil.isValidNumber( parsed );
	const type = getNumberType( parsed );
	const mobile = type === 'mobile' || type === 'fixed-line-or-mobile';
	const fixedLine = type === 'fixed-line' || type === 'fixed-line-or-mobile';
	const possibility = getValidationResult( parsed );

	const ok =
		possible
		&&
		valid
		&&
		possibility === 'is-possible';

	if ( typeof Proxy === 'undefined' )
		return {
			[ 'number' ]: {
				[ 'input' ]:
					phoneNumber,
				[ 'international' ]:
					phoneUtil.format( parsed, PhoneNumberFormat.INTERNATIONAL ),
				[ 'national' ]:
					phoneUtil.format( parsed, PhoneNumberFormat.NATIONAL ),
				[ 'e164' ]:
					phoneUtil.format( parsed, PhoneNumberFormat.E164 ),
				[ 'rfc3966' ]:
					phoneUtil.format( parsed, PhoneNumberFormat.RFC3966 ),
				[ 'significant' ]:
					phoneUtil.getNationalSignificantNumber( parsed ),
			},

			[ 'numberFrom' ]: regionCode =>
				phoneUtil.formatOutOfCountryCallingNumber( parsed, regionCode ),

			[ 'canBeInternationallyDialled' ]: canBeInternationallyDialled,
			[ 'possible' ]: possible,
			[ 'valid' ]: valid,
			[ 'type' ]: type,
			[ 'mobile' ]: mobile,
			[ 'fixedLine' ]: fixedLine,
			[ 'possibility' ]: possibility,
			[ 'regionCode' ]: regionCode,
			[ 'countryCode' ]: getCountryCodeForRegionCode( regionCode ),
			[ 'ok' ]: ok,
		};

	const number = new Proxy(
		{
			[ 'input' ]: phoneNumber,
			[ 'international' ]: undefined,
			[ 'national' ]: undefined,
			[ 'e164' ]: undefined,
			[ 'rfc3966' ]: undefined,
			[ 'significant' ]: undefined,
		}, {
			get( target, key, receiver )
			{
				switch ( key )
				{
					case 'international':
						return phoneUtil.format( parsed, PhoneNumberFormat.INTERNATIONAL );
					case 'national':
						return phoneUtil.format( parsed, PhoneNumberFormat.NATIONAL );
					case 'e164':
						return phoneUtil.format( parsed, PhoneNumberFormat.E164 );
					case 'rfc3966':
						return phoneUtil.format( parsed, PhoneNumberFormat.RFC3966 );
					case 'significant':
						return phoneUtil.getNationalSignificantNumber( parsed );
					default:
						return Reflect.get( target, key, receiver );
				}
			}
		}
	);

	return new Proxy(
		{
			[ 'number' ]: number,
			[ 'numberFrom' ]: regionCode =>
				phoneUtil.formatOutOfCountryCallingNumber( parsed, regionCode ),

			[ 'canBeInternationallyDialled' ]: canBeInternationallyDialled,
			[ 'possible' ]: possible,
			[ 'valid' ]: valid,
			[ 'type' ]: type,
			[ 'mobile' ]: mobile,
			[ 'fixedLine' ]: fixedLine,
			[ 'possibility' ]: possibility,
			[ 'regionCode' ]: regionCode,
			[ 'countryCode' ]: undefined,
			[ 'ok' ]: ok,
		}, {
		get( target, key, receiver )
		{
			switch ( key )
			{
				case 'countryCode':
					return getCountryCodeForRegionCode( regionCode );
				default:
					return Reflect.get( target, key, receiver );
			}
		},
	} );
}

function getCountryCodeForRegionCode( regionCode )
{
	return phoneUtil.getCountryCodeForRegion( regionCode );
}

function getRegionCodeForCountryCode( countryCode )
{
	return phoneUtil.getRegionCodeForCountryCode( countryCode );
}

function getSupportedRegionCodes( )
{
	return phoneUtil.getSupportedRegions( );
}

function getSupportedCallingCodes( )
{
	return phoneUtil.getSupportedCallingCodes( );
}

function getExample( regionCode, type /* = null */ )
{
	var example;
	if ( !type )
		example = phoneUtil.getExampleNumber( regionCode );
	else
		example = phoneUtil.getExampleNumberForType(
			regionCode, toNumberType( type ) );

	return parse( example, regionCode );
}

function getAsYouType( regionCode )
{
	return new AsYouType( regionCode );
}

/**
 * The AsYouType class.
 * @constructor
 */
function AsYouType( regionCode )
{
	this._regionCode = regionCode;
	this._aytf = new i18n.phonenumbers.AsYouTypeFormatter( regionCode );
	this._number = '';
}

AsYouType.prototype.addChar = function( nextChar )
{
	this._number = this._aytf.inputDigit( nextChar );
	return this._number;
}

AsYouType.prototype.number = function( )
{
	return this._number;
}

AsYouType.prototype.removeChar = function( )
{
	var number = this._number;
	if ( number.length > 0 )
		this.reset( number.substr( 0, number.length - 1 ) );

	return this._number;
}

AsYouType.prototype.reset = function( number /* = '' */ )
{
	this._aytf.clear( );
	if ( number )
		for ( var i = 0, n = number.length; i < n; ++i )
			this.addChar( number.charAt( i ) );
	return this._number;
}

AsYouType.prototype.getPhoneNumber = function( )
{
	return parse( this._number, this._regionCode );
}

goog.global =
	( typeof exports !== 'undefined' )
	? exports
	: ( typeof self !== 'undefined' )
	? self
	: window;

goog.exportSymbol( 'parse', parse );

goog.exportSymbol( 'getCountryCodeForRegionCode',
	getCountryCodeForRegionCode );
goog.exportSymbol( 'getRegionCodeForCountryCode',
	getRegionCodeForCountryCode );
goog.exportSymbol( 'getSupportedRegionCodes', getSupportedRegionCodes );
goog.exportSymbol( 'getSupportedCallingCodes', getSupportedCallingCodes );

goog.exportSymbol( 'getExample', getExample );

goog.exportSymbol( 'getAsYouType', getAsYouType );

goog.exportSymbol( 'AsYouType', AsYouType );

goog.exportSymbol( 'AsYouType.prototype.addChar',
	AsYouType.prototype.addChar );
goog.exportSymbol( 'AsYouType.prototype.number',
	AsYouType.prototype.number );
goog.exportSymbol( 'AsYouType.prototype.removeChar',
	AsYouType.prototype.removeChar );
goog.exportSymbol( 'AsYouType.prototype.reset',
	AsYouType.prototype.reset );
goog.exportSymbol( 'AsYouType.prototype.getPhoneNumber',
	AsYouType.prototype.getPhoneNumber );
