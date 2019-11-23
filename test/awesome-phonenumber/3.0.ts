'use strict';

import {
	parse,
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedCallingCodes,
	getSupportedRegionCodes,
	getExample,
	getAsYouType,
} from '../../'


describe( 'parse', function( ) {
	it( 'should parse a phone number', function( ) {
		const parsed = parse( '0707123456', 'SE' );

		if ( !parsed.valid )
		{
			parsed.number.national;
		}

		expect( parsed.valid ).toBe( true );
		expect( parsed.possible ).toBe( true );
		expect( parsed.mobile ).toBe( true );
		expect( parsed.number.significant ).toBe( '707123456' );
		expect( parsed.canBeInternationallyDialled ).toBe( true );
	} );

	it( 'should parse an e164 phone number', function( ) {
		const parsed = parse( '+46707123456' );

		if ( !parsed.valid )
		{
			parsed.number.national;
		}

		expect( parsed.valid ).toBe( true );
		expect( parsed.possible ).toBe( true );
		expect( parsed.mobile ).toBe( true );
		expect( parsed.number.significant ).toBe( '707123456' );
		expect( parsed.canBeInternationallyDialled ).toBe( true );
	} );

	it( 'should be able to create an example phone number', function( ) {
		var pn1 = getExample( 'SE' );
		expect( pn1.valid ).toBe( true );
		expect( pn1.possible ).toBe( true );

		var pn2 = getExample( 'SE', 'mobile' );
		expect( pn2.valid ).toBe( true );
		expect( pn2.possible ).toBe( true );
		expect( pn2.mobile ).toBe( true );
		expect( pn2.fixedLine ).toBe( false );

		var pn3 = getExample( 'SE', 'fixed-line' );
		expect( pn3.valid ).toBe( true );
		expect( pn3.possible ).toBe( true );
		expect( pn3.mobile ).toBe( false );
		expect( pn3.fixedLine ).toBe( true );
	} );

	it( 'should be able to format as-you-type', function( ) {
		var ayt = getAsYouType( 'SE' );
		expect( ayt.addChar( '0' ) ).toBe( '0' );
		expect( ayt.addChar( '7' ) ).toBe( '07' );
		expect( ayt.addChar( '0' ) ).toBe( '070' );
		expect( ayt.addChar( '7' ) ).toBe( '070-7' );
		expect( ayt.addChar( '1' ) ).toBe( '070-71' );
		expect( ayt.addChar( '2' ) ).toBe( '070-712' );

		var pn1 = ayt.getPhoneNumber( );
		expect( pn1.valid ).toBe( false );

		expect( ayt.addChar( '3' ) ).toBe( '070-712 3' );
		expect( ayt.addChar( '4' ) ).toBe( '070-712 34' );
		expect( ayt.addChar( '5' ) ).toBe( '070-712 34 5' );
		expect( ayt.addChar( '6' ) ).toBe( '070-712 34 56' );

		var pn2 = ayt.getPhoneNumber( );
		expect( pn2.valid ).toBe( true );
		expect( pn2.possible ).toBe( true );
	} );

	it( 'should be able to convert country code <-> region code', function( ) {
		expect( getCountryCodeForRegionCode( 'SE' ) ).toBe( 46 );
		expect( getRegionCodeForCountryCode( 46 ) ).toBe( 'SE' );
	} );

	it( 'should be possible to get region code', function( ) {
		const pn = parse( '0707123456', 'SE' );
		expect( pn.regionCode ).toBe( 'SE' );
	} );

	it( 'should be possible to get country code', function( ) {
		const pn = parse( '0707123456', 'SE' );
		expect( pn.countryCode ).toBe( 46 );
	} );

	it( 'should have supported calling codes', function( ) {
		const codes = getSupportedCallingCodes( );
		expect( codes.length ).toBeGreaterThanOrEqual( 100 );
	} );

	it( 'should have supported calling codes', function( ) {
		const codes = getSupportedRegionCodes( );
		expect( codes.length ).toBeGreaterThanOrEqual( 100 );
	} );

	it( 'should not guess US for invalid region code numbers', function( ) {
		const pn = parse( '+80012345678' );
		expect( pn.regionCode ).not.toBe( 'US' );
	} );

	it( 'should not guess US for known CA numbers', function( ) {
		const pn = parse( '+1613 734.6759', 'CA' );
		expect( pn.regionCode ).toBe( 'CA' );
	} );

	it( 'should not guess US for known CA numbers w/o "CA" specified', function( ) {
		const pn = parse( '+16137346759' );
		expect( pn.regionCode ).toBe( 'CA' );
	} );

	it( 'should extract region by prefix as early as possible', function( ) {
		const pn1 = parse( '+1' );
		const pn1x = parse( '+12' );
		expect( pn1.regionCode ).toBe( 'US' );
		expect( pn1x.regionCode ).toBe( 'US' );

		const pn2 = parse( '+46' );
		const pn2x = parse( '+467' );
		expect( pn2.regionCode ).toBe( 'SE' );
		expect( pn2x.regionCode ).toBe( 'SE' );

		const pn3 = parse( '+358' );
		const pn3x = parse( '+3587' );
		expect( pn3.regionCode ).toBe( 'FI' );
		expect( pn3x.regionCode ).toBe( 'FI' );
	} );
} );


describe( 'errors', function( ) {
	it( 'should not allow too short numbers', function( ) {
		const pn = parse( '+12' );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
	} );

	it( 'should handle invalid country code', function( ) {
		const pn = parse( '+0123' );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle invalid country code (and valid region code)', function( ) {
		const pn = parse( '+0123', 'SE' );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle invalid country code and region code', function( ) {
		const pn = parse( '0123', 'XX' );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle missing country code', function( ) {
		const pn = parse( '0123' );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle TOO_SHORT', function( ) {
		const pn = parse( '0123', 'SE' );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'too-short' );
	} );

	it( 'should handle invalid phone number', function( ) {
		const failure = ( arg: any ) => ( ) => parse( arg );

		expect( failure( null ) ).toThrow( "Invalid phone number" );
		expect( failure( { } ) ).toThrow( "Invalid phone number" );
		expect( failure( [ ] ) ).toThrow( "Invalid phone number" );
		expect( failure( 5 ) ).toThrow( "Invalid phone number" );
		expect( failure( true ) ).toThrow( "Invalid phone number" );
	} );

	it( 'should handle invalid phone number', function( ) {
		const failure = ( arg: any ) => ( ) => parse( '987654321', arg );

		expect( failure( { } ) ).toThrow( "Invalid region code" );
		expect( failure( [ ] ) ).toThrow( "Invalid region code" );
		expect( failure( 5 ) ).toThrow( "Invalid region code" );
		expect( failure( true ) ).toThrow( "Invalid region code" );
	} );
} );
