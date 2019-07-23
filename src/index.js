'use strict';

goog.require('i18n.phonenumbers.AsYouTypeFormatter');
goog.require('i18n.phonenumbers.PhoneNumberFormat');
goog.require('i18n.phonenumbers.PhoneNumberType');
goog.require('i18n.phonenumbers.PhoneNumberUtil');
goog.require('i18n.phonenumbers.PhoneNumberUtil.ValidationResult');

var PhoneNumberType = i18n.phonenumbers.PhoneNumberType;
var PhoneNumberFormat = i18n.phonenumbers.PhoneNumberFormat;
var ValidationResult = i18n.phonenumbers.PhoneNumberUtil.ValidationResult;

var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance( );

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

		regionCode = PhoneNumber.getRegionCodeForCountryCode(
			phoneNumber.substring( 1, len + 1 )
		);

		if ( regionCode !== 'ZZ' )
			return { regionCode };
	}

	return { parsed, regionCode: void 0 };
}

/**
 * The PhoneNumber class.
 * @constructor
 */
function PhoneNumber( phoneNumber, regionCode )
{
	if ( !( this instanceof PhoneNumber ) )
		return new PhoneNumber( phoneNumber, regionCode );

	var self = this;

	var isInternal =
		typeof phoneNumber === 'string'
		? false
		: function( )
		{
			try
			{
				phoneUtil.isValidNumber( phoneNumber );
				return true
			}
			catch ( e )
			{
				return false;
			}
		}( );

	let parsed;

	if ( !isInternal )
	{
		if ( regionCode && ( phoneNumber.charAt( 0 ) === '+' ) )
		{
			// Ensure region code is valid
			var cc = PhoneNumber.getCountryCodeForRegionCode( regionCode );
			if ( phoneNumber.substr( 1, ( '' + cc ).length ) !== '' + cc )
				// Wrong region code, let's fix it
				regionCode = null;
		}

		if ( !regionCode )
			// Guess region code
			( { regionCode = null, parsed } = extractRegionCode( phoneNumber ) );
	}

	this._json = {
		'number'     : { },
		'regionCode' : regionCode,
		'valid'      : false,
		'possible'   : false
	};

	if ( isInternal )
	{
		this._number = phoneNumber;
	}
	else
	{
		this._number = null;
		this._json[ 'number' ][ 'input' ] = phoneNumber;

		if ( !regionCode )
		{
			this._json[ 'possibility' ] = 'invalid-country-code';
			return;
		}
		else
		{
			var cc = PhoneNumber.getCountryCodeForRegionCode( regionCode );
			if ( cc === 0 )
			{
				this._json[ 'possibility' ] = 'invalid-country-code';
				return;
			}
		}

		try
		{
			if ( parsed )
				this._number = parsed;
			else
				this._number = phoneUtil.parse( phoneNumber, regionCode );
		}
		catch ( e )
		{
			this._json[ 'possibility' ] = getValidationResult( phoneNumber );
			return;
		}
	}

	this._json[ 'number' ][ 'international' ] =
		phoneUtil.format( this._number, PhoneNumberFormat.INTERNATIONAL );
	this._json[ 'number' ][ 'national' ] =
		phoneUtil.format( this._number, PhoneNumberFormat.NATIONAL );
	this._json[ 'number' ][ 'e164' ] =
		phoneUtil.format( this._number, PhoneNumberFormat.E164 );
	this._json[ 'number' ][ 'rfc3966' ] =
		phoneUtil.format( this._number, PhoneNumberFormat.RFC3966 );
	this._json[ 'number' ][ 'significant' ] =
		phoneUtil.getNationalSignificantNumber( this._number );

	this._json[ 'canBeInternationallyDialled' ] =
		phoneUtil.canBeInternationallyDialled( this._number );

	this._json[ 'possible' ] = phoneUtil.isPossibleNumber( this._number );
	this._json[ 'valid' ] = phoneUtil.isValidNumber( this._number );

	this._json[ 'type' ] = getNumberType( self._number );

	this._json[ 'possibility' ] = getValidationResult( self._number );
}

PhoneNumber.getCountryCodeForRegionCode = function( regionCode )
{
	return phoneUtil.getCountryCodeForRegion( regionCode );
}

PhoneNumber.getRegionCodeForCountryCode = function( countryCode )
{
	var regionCode = phoneUtil.getRegionCodeForCountryCode( countryCode );
	return regionCode;
}

PhoneNumber.getSupportedRegionCodes = function( )
{
	return phoneUtil.getSupportedRegions( );
}

PhoneNumber.getSupportedCallingCodes = function( )
{
	return phoneUtil.getSupportedCallingCodes( );
}

PhoneNumber.getExample = function( regionCode, type /* = null */ )
{
	var example;
	if ( !type )
		example = phoneUtil.getExampleNumber( regionCode );
	else
		example = phoneUtil.getExampleNumberForType(
			regionCode, toNumberType( type ) );

	return new PhoneNumber( example, regionCode );
}

PhoneNumber.getAsYouType = function( regionCode )
{
	return new AsYouType( regionCode );
}

PhoneNumber.prototype.toJSON = function( )
{
	return this._json;
}

PhoneNumber.prototype.canBeInternationallyDialled = function( )
{
	return this._json[ 'canBeInternationallyDialled' ];
}

PhoneNumber.prototype.isValid = function( )
{
	return this._json[ 'valid' ];
}

PhoneNumber.prototype.isPossible = function( )
{
	return this._json[ 'possible' ];
}

PhoneNumber.prototype.getType = function( )
{
	return this._json[ 'type' ];
}

PhoneNumber.prototype.isMobile = function( )
{
	return this._json[ 'type' ] === 'mobile'
		|| this._json[ 'type' ] === 'fixed-line-or-mobile';
}

PhoneNumber.prototype.isFixedLine = function( )
{
	return this._json[ 'type' ] === 'fixed-line'
		|| this._json[ 'type' ] === 'fixed-line-or-mobile';
}

/**
 * The type can be any of 'international', 'national', 'e164', 'rfc3966',
 * 'significant'.
 */
PhoneNumber.prototype.getNumber = function( type /* = e164 */ )
{
	type = type == null ? 'e164' : type;

	return this._json[ 'number' ][ type ];
}

PhoneNumber.prototype.getNumberFrom = function( regionCode )
{
	return phoneUtil.formatOutOfCountryCallingNumber( this._number, regionCode );
}

PhoneNumber.prototype.getRegionCode = function( )
{
	return this._json[ 'regionCode' ];
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
	return new PhoneNumber( this._number, this._regionCode );
}


goog.global =
	( typeof exports !== 'undefined' )
	? exports
	: ( typeof self !== 'undefined' )
	? self
	: window;

goog.exportSymbol( 'PhoneNumber', PhoneNumber );

goog.exportSymbol( 'PhoneNumber.getCountryCodeForRegionCode',
	PhoneNumber.getCountryCodeForRegionCode );
goog.exportSymbol( 'PhoneNumber.getRegionCodeForCountryCode',
	PhoneNumber.getRegionCodeForCountryCode );
goog.exportSymbol( 'PhoneNumber.getSupportedCallingCodes',
	PhoneNumber.getSupportedCallingCodes );
goog.exportSymbol( 'PhoneNumber.getExample',
	PhoneNumber.getExample );
goog.exportSymbol( 'PhoneNumber.getAsYouType',
	PhoneNumber.getAsYouType );

goog.exportSymbol( 'PhoneNumber.prototype.toJSON',
	PhoneNumber.prototype.toJSON );
goog.exportSymbol( 'PhoneNumber.prototype.canBeInternationallyDialled',
	PhoneNumber.prototype.canBeInternationallyDialled );
goog.exportSymbol( 'PhoneNumber.prototype.isValid',
	PhoneNumber.prototype.isValid );
goog.exportSymbol( 'PhoneNumber.prototype.isPossible',
	PhoneNumber.prototype.isPossible );
goog.exportSymbol( 'PhoneNumber.prototype.getType',
	PhoneNumber.prototype.getType );
goog.exportSymbol( 'PhoneNumber.prototype.isMobile',
	PhoneNumber.prototype.isMobile );
goog.exportSymbol( 'PhoneNumber.prototype.isFixedLine',
	PhoneNumber.prototype.isFixedLine );
goog.exportSymbol( 'PhoneNumber.prototype.getNumber',
	PhoneNumber.prototype.getNumber );
goog.exportSymbol( 'PhoneNumber.prototype.getNumberFrom',
	PhoneNumber.prototype.getNumberFrom );
goog.exportSymbol( 'PhoneNumber.prototype.getRegionCode',
	PhoneNumber.prototype.getRegionCode );

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
