import PhoneNumberClass, {
	parsePhoneNumber,
	getAsYouType,
	getExample,
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedRegionCodes,
	getSupportedCallingCodes,
} from 'awesome-phonenumber';


describe( 'general', function( ) {
	it( 'should be able to parse a phone number', function( ) {
		var pn = parsePhoneNumber( '0707123456', 'SE' );
		expect( pn.isValid( ) ).toBe( true );
		expect( pn.isPossible( ) ).toBe( true );
		expect( pn.isMobile( ) ).toBe( true );
		expect( pn.getNumber( 'significant' ) ).toBe( '707123456' );
		expect( pn.canBeInternationallyDialled( ) ).toBe( true );
		expect( pn.toJSON( ).canBeInternationallyDialled ).toBe( true );
	} );

	it( 'should be able to create an example phone number', function( ) {
		var pn1 = getExample( 'SE' );
		expect( pn1.isValid( ) ).toBe( true );
		expect( pn1.isPossible( ) ).toBe( true );

		var pn2 = getExample( 'SE', 'mobile' );
		expect( pn2.isValid( ) ).toBe( true );
		expect( pn2.isPossible( ) ).toBe( true );
		expect( pn2.isMobile( ) ).toBe( true );
		expect( pn2.isFixedLine( ) ).toBe( false );

		var pn3 = getExample( 'SE', 'fixed-line' );
		expect( pn3.isValid( ) ).toBe( true );
		expect( pn3.isPossible( ) ).toBe( true );
		expect( pn3.isMobile( ) ).toBe( false );
		expect( pn3.isFixedLine( ) ).toBe( true );
	} );

	it( 'should be able to convert country code <-> region code', function( ) {
		expect( getCountryCodeForRegionCode( 'SE' ) ).toBe( 46 );
		expect( getRegionCodeForCountryCode( 46 ) ).toBe( 'SE' );
	} );

	it( 'should be possible to get region code', function( ) {
		var pn = parsePhoneNumber( '0707123456', 'SE' );
		expect( pn.getRegionCode( ) ).toBe( 'SE' );
	} );

	it( 'should be possible to get country code', function( ) {
		var pn = parsePhoneNumber( '0707123456', 'SE' );
		expect( pn.getCountryCode( ) ).toBe( 46 );
	} );

	it( 'should have supported calling codes', function( ) {
		const codes = getSupportedCallingCodes( );
		expect( codes.length ).toBeGreaterThan( 100 );
	} );

	it( 'should not guess US for invalid region code numbers', function( ) {
		const pn = parsePhoneNumber( '+80012345678' );
		expect( pn.getRegionCode( ) ).not.toBe( 'US' );
	} );

	it( 'should not guess US for known CA numbers', function( ) {
		const pn = parsePhoneNumber( '+1613 734.6759', 'CA' );
		expect( pn.getRegionCode( ) ).toBe( 'CA' );
	} );

	it( 'should not guess US for known CA numbers w/o "CA" specified', function( ) {
		const pn = parsePhoneNumber( '+16137346759' );
		expect( pn.getRegionCode( ) ).toBe( 'CA' );
	} );

	it( 'should not use US for known CA numbers', function( ) {
		// Issue #51
		const pn = parsePhoneNumber( '+1613 734.6759', 'US' );
		expect( pn.getRegionCode( ) ).toBe( 'CA' );
	} );

	it( 'should extract region by prefix as early as possible', function( ) {
		const pn1 = parsePhoneNumber( '+1' );
		const pn1x = parsePhoneNumber( '+12' );
		expect( pn1.getRegionCode( ) ).toBe( 'US' );
		expect( pn1x.getRegionCode( ) ).toBe( 'US' );

		const pn2 = parsePhoneNumber( '+46' );
		const pn2x = parsePhoneNumber( '+467' );
		expect( pn2.getRegionCode( ) ).toBe( 'SE' );
		expect( pn2x.getRegionCode( ) ).toBe( 'SE' );

		const pn3 = parsePhoneNumber( '+358' );
		const pn3x = parsePhoneNumber( '+3587' );
		expect( pn3.getRegionCode( ) ).toBe( 'FI' );
		expect( pn3x.getRegionCode( ) ).toBe( 'FI' );
	} );

	it( 'should return unique list of calling codes', function( ) {
		const callingCodes = getSupportedCallingCodes( );

		expect( callingCodes.length ).toBe( new Set( callingCodes ).size );
	} );

	it( 'should return unique list of region codes', function( ) {
		const regionCodes = getSupportedRegionCodes( );

		expect( regionCodes.length ).toBe( new Set( regionCodes ).size );
	} );
} );


describe( 'as-you-type', function( ) {
	it( 'should be able to format as-you-type', function( ) {
		var ayt = getAsYouType( 'SE' );
		expect( ayt.addChar( '0' ) ).toBe( '0' );
		expect( ayt.addChar( '7' ) ).toBe( '07' );
		expect( ayt.addChar( '0' ) ).toBe( '070' );
		expect( ayt.addChar( '7' ) ).toBe( '070-7' );
		expect( ayt.addChar( '1' ) ).toBe( '070-71' );
		expect( ayt.addChar( '2' ) ).toBe( '070-712' );

		var pn1 = ayt.getPhoneNumber( );
		expect( pn1.isValid( ) ).toBe( false );

		expect( ayt.addChar( '3' ) ).toBe( '070-712 3' );
		expect( ayt.addChar( '4' ) ).toBe( '070-712 34' );
		expect( ayt.addChar( '5' ) ).toBe( '070-712 34 5' );
		expect( ayt.addChar( '6' ) ).toBe( '070-712 34 56' );

		var pn2 = ayt.getPhoneNumber( );
		expect( pn2.isValid( ) ).toBe( true );
		expect( pn2.isPossible( ) ).toBe( true );
	} );

	it( 'should be able to format as-you-type with removeChar', function( ) {
		var ayt = getAsYouType( 'SE' );
		expect( ayt.addChar( '0' ) ).toBe( '0' );
		expect( ayt.addChar( '7' ) ).toBe( '07' );
		expect( ayt.addChar( '0' ) ).toBe( '070' );
		expect( ayt.addChar( '7' ) ).toBe( '070-7' );
		expect( ayt.addChar( '1' ) ).toBe( '070-71' );
		expect( ayt.addChar( '2' ) ).toBe( '070-712' );
		expect( ayt.addChar( '3' ) ).toBe( '070-712 3' );
		expect( ayt.removeChar( ) ).toBe( '070-712' );
		expect( ayt.addChar( '3' ) ).toBe( '070-712 3' );

		var pn1 = ayt.getPhoneNumber( );
		expect( pn1.isValid( ) ).toBe( false );

		expect( ayt.addChar( '4' ) ).toBe( '070-712 34' );
		expect( ayt.addChar( '5' ) ).toBe( '070-712 34 5' );
		expect( ayt.addChar( '6' ) ).toBe( '070-712 34 56' );

		var pn2 = ayt.getPhoneNumber( );
		expect( pn2.isValid( ) ).toBe( true );
		expect( pn2.isPossible( ) ).toBe( true );
	} );

	it( 'should reset properly with new number', function( ) {
		var ayt = getAsYouType( 'SE' );
		expect( ayt.addChar( '0' ) ).toBe( '0' );
		expect( ayt.addChar( '7' ) ).toBe( '07' );
		expect( ayt.addChar( '0' ) ).toBe( '070' );
		expect( ayt.addChar( '7' ) ).toBe( '070-7' );
		expect( ayt.addChar( '1' ) ).toBe( '070-71' );
		expect( ayt.addChar( '2' ) ).toBe( '070-712' );

		ayt.reset( '070' );
		expect( ayt.number( ) ).toBe( '070' );
	} );

	it( 'should reset properly without new number', function( ) {
		var ayt = getAsYouType( 'SE' );
		expect( ayt.addChar( '0' ) ).toBe( '0' );
		expect( ayt.addChar( '7' ) ).toBe( '07' );
		expect( ayt.addChar( '0' ) ).toBe( '070' );
		expect( ayt.addChar( '7' ) ).toBe( '070-7' );
		expect( ayt.addChar( '1' ) ).toBe( '070-71' );
		expect( ayt.addChar( '2' ) ).toBe( '070-712' );

		ayt.reset( );
		expect( ayt.number( ) ).toBe( '' );
	} );
} );


describe( 'instance', function( ) {
	it( 'called should be instanceof PhoneNumber', function( ) {
		var pn = parsePhoneNumber( '+12' );
		expect( pn instanceof PhoneNumberClass ).toBe( true );
	} );
} );


describe( 'errors', function( ) {
	it( 'should not allow too short numbers', function( ) {
		var pn = parsePhoneNumber( '+12' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
	} );

	it( 'should handle invalid country code', function( ) {
		var pn = parsePhoneNumber( '+0123' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle invalid country code (and valid region code)', function( ) {
		var pn = parsePhoneNumber( '+0123', 'SE' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle invalid country code and region code', function( ) {
		var pn = parsePhoneNumber( '0123', 'XX' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle missing country code', function( ) {
		var pn = parsePhoneNumber( '0123' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle TOO_SHORT', function( ) {
		var pn = parsePhoneNumber( '0123', 'SE' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'too-short' );
	} );

	it( 'should handle invalid phone number', function( ) {
		const failure = ( arg: any ) => ( ) => parsePhoneNumber( arg );

		expect( failure( null ) ).toThrow( "Invalid phone number" );
		expect( failure( { } ) ).toThrow( "Invalid phone number" );
		expect( failure( [ ] ) ).toThrow( "Invalid phone number" );
		expect( failure( 5 ) ).toThrow( "Invalid phone number" );
		expect( failure( true ) ).toThrow( "Invalid phone number" );
	} );

	it( 'should handle invalid phone number', function( ) {
		const failure = ( arg: any ) => ( ) => parsePhoneNumber( '987654321', arg );

		expect( failure( { } ) ).toThrow( "Invalid region code" );
		expect( failure( [ ] ) ).toThrow( "Invalid region code" );
		expect( failure( 5 ) ).toThrow( "Invalid region code" );
		expect( failure( true ) ).toThrow( "Invalid region code" );
	} );
} );
