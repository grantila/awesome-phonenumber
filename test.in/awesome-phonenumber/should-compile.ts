import PhoneNumber from 'awesome-phonenumber';

describe( 'general', ( ) =>
{
	it( 'should be able to parse a phone number', ( ) =>
	{
		var pn = new PhoneNumber( '0707123456', 'SE' );
		expect( pn.isValid( ) ).toBe( true );
		expect( pn.isPossible( ) ).toBe( true );
		expect( pn.isMobile( ) ).toBe( true );
		expect( pn.getNumber( 'significant' ) ).toBe( '707123456' );
		expect( pn.canBeInternationallyDialled( ) ).toBe( true );
		expect( pn.toJSON( ).canBeInternationallyDialled ).toBe( true );
	} );

	it( 'should be able to create an example phone number', ( ) =>
	{
		var pn1 = PhoneNumber.getExample( 'SE' );
		expect( pn1.isValid( ) ).toBe( true );
		expect( pn1.isPossible( ) ).toBe( true );

		var pn2 = PhoneNumber.getExample( 'SE', 'mobile' );
		expect( pn2.isValid( ) ).toBe( true );
		expect( pn2.isPossible( ) ).toBe( true );
		expect( pn2.isMobile( ) ).toBe( true );
		expect( pn2.isFixedLine( ) ).toBe( false );

		var pn3 = PhoneNumber.getExample( 'SE', 'fixed-line' );
		expect( pn3.isValid( ) ).toBe( true );
		expect( pn3.isPossible( ) ).toBe( true );
		expect( pn3.isMobile( ) ).toBe( false );
		expect( pn3.isFixedLine( ) ).toBe( true );
	} );

	it( 'should be able to convert country code <-> region code', ( ) =>
	{
		expect( PhoneNumber.getCountryCodeForRegionCode( 'SE' ) ).toBe( 46 );
		expect( PhoneNumber.getRegionCodeForCountryCode( 46 ) ).toBe( 'SE' );
	} );

	it( 'should be possible to get region code', ( ) =>
	{
		var pn = new PhoneNumber( '0707123456', 'SE' );
		expect( pn.getRegionCode( ) ).toBe( 'SE' );
	} );

	it( 'should be possible to get country code', ( ) =>
	{
		var pn = new PhoneNumber( '0707123456', 'SE' );
		expect( pn.getCountryCode( ) ).toBe( 46 );
	} );

	it( 'should have supported calling codes', ( ) =>
	{
		const codes = PhoneNumber.getSupportedCallingCodes( );
		expect( codes.length ).toBeGreaterThanOrEqual( 100 );
	} );

	it( 'should not guess US for invalid region code numbers', ( ) =>
	{
		const pn = new PhoneNumber( '+80012345678' );
		expect( pn.getRegionCode( ) ).not.toBe( 'US' );
	} );

	it( 'should not guess US for known CA numbers', ( ) =>
	{
		const pn = new PhoneNumber( '+1613 734.6759', 'CA' );
		expect( pn.getRegionCode( ) ).toBe( 'CA' );
	} );

	it( 'should not guess US for known CA numbers w/o "CA" specified', ( ) =>
	{
		const pn = new PhoneNumber( '+16137346759' );
		expect( pn.getRegionCode( ) ).toBe( 'CA' );
	} );

	it( 'should not use US for known CA numbers', ( ) =>
	{
		// Issue #51
		const pn = new PhoneNumber( '+1613 734.6759', 'US' );
		expect( pn.getRegionCode( ) ).toBe( 'CA' );
	} );

	it( 'should extract region by prefix as early as possible', ( ) =>
	{
		const pn1 = new PhoneNumber( '+1' );
		const pn1x = new PhoneNumber( '+12' );
		expect( pn1.getRegionCode( ) ).toBe( 'US' );
		expect( pn1x.getRegionCode( ) ).toBe( 'US' );

		const pn2 = new PhoneNumber( '+46' );
		const pn2x = new PhoneNumber( '+467' );
		expect( pn2.getRegionCode( ) ).toBe( 'SE' );
		expect( pn2x.getRegionCode( ) ).toBe( 'SE' );

		const pn3 = new PhoneNumber( '+358' );
		const pn3x = new PhoneNumber( '+3587' );
		expect( pn3.getRegionCode( ) ).toBe( 'FI' );
		expect( pn3x.getRegionCode( ) ).toBe( 'FI' );
	} );

	it( 'should return unique list of calling codes', ( ) =>
	{
		const callingCodes = PhoneNumber.getSupportedCallingCodes( );

		expect( callingCodes.length ).toBe( new Set( callingCodes ).size );
	} );

	it( 'should return unique list of region codes', ( ) =>
	{
		const regionCodes = PhoneNumber.getSupportedRegionCodes( );

		expect( regionCodes.length ).toBe( new Set( regionCodes ).size );
	} );
} );


describe( 'as-you-type', ( ) =>
{
	it( 'should be able to format as-you-type', ( ) =>
	{
		var ayt = PhoneNumber.getAsYouType( 'SE' );
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

	it( 'should be able to format as-you-type with removeChar', ( ) =>
	{
		var ayt = PhoneNumber.getAsYouType( 'SE' );
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

	it( 'should reset properly with new number', ( ) =>
	{
		var ayt = PhoneNumber.getAsYouType( 'SE' );
		expect( ayt.addChar( '0' ) ).toBe( '0' );
		expect( ayt.addChar( '7' ) ).toBe( '07' );
		expect( ayt.addChar( '0' ) ).toBe( '070' );
		expect( ayt.addChar( '7' ) ).toBe( '070-7' );
		expect( ayt.addChar( '1' ) ).toBe( '070-71' );
		expect( ayt.addChar( '2' ) ).toBe( '070-712' );

		ayt.reset( '070' );
		expect( ayt.number( ) ).toBe( '070' );
	} );

	it( 'should reset properly without new number', ( ) =>
	{
		var ayt = PhoneNumber.getAsYouType( 'SE' );
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


describe( 'instance', ( ) =>
{
	it( 'constructed should be instanceof PhoneNumber', ( ) =>
	{
		var pn = new PhoneNumber( '+12' );
		expect( pn instanceof PhoneNumber ).toBe( true );
	} );

	it( 'called should be instanceof PhoneNumber', ( ) =>
	{
		var pn = PhoneNumber( '+12' );
		expect( pn instanceof PhoneNumber ).toBe( true );
	} );
} );


describe( 'errors', ( ) =>
{
	it( 'should not allow too short numbers', ( ) =>
	{
		var pn = new PhoneNumber( '+12' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
	} );

	it( 'should handle invalid country code', ( ) =>
	{
		var pn = new PhoneNumber( '+0123' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle invalid country code (and valid region code)', ( ) =>
	{
		var pn = new PhoneNumber( '+0123', 'SE' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle invalid country code and region code', ( ) =>
	{
		var pn = new PhoneNumber( '0123', 'XX' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle missing country code', ( ) =>
	{
		var pn = new PhoneNumber( '0123' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle TOO_SHORT', ( ) =>
	{
		var pn = new PhoneNumber( '0123', 'SE' );
		expect( pn.isValid( ) ).toBe( false );
		expect( pn.isPossible( ) ).toBe( false );
		expect( pn.toJSON( ).possibility ).toBe( 'too-short' );
	} );

	it( 'should handle invalid phone number', ( ) =>
	{
		const failure = ( arg: any ) => ( ) => new PhoneNumber( arg );

		expect( failure( null ) ).toThrow( "Invalid phone number" );
		expect( failure( { } ) ).toThrow( "Invalid phone number" );
		expect( failure( [ ] ) ).toThrow( "Invalid phone number" );
		expect( failure( 5 ) ).toThrow( "Invalid phone number" );
		expect( failure( true ) ).toThrow( "Invalid phone number" );
	} );

	it( 'should handle invalid phone number', ( ) =>
	{
		const failure = ( arg: any ) =>
			( ) => new PhoneNumber( '987654321', arg );

		expect( failure( { } ) ).toThrow( "Invalid region code" );
		expect( failure( [ ] ) ).toThrow( "Invalid region code" );
		expect( failure( 5 ) ).toThrow( "Invalid region code" );
		expect( failure( true ) ).toThrow( "Invalid region code" );
	} );
} );
