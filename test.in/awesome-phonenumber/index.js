const PhoneNumber = require( '../../' );

describe( 'general', function( ) {
	it( 'should be able to parse a phone number', function( ) {
		var pn = new PhoneNumber( '0707123456', 'SE' );
		expect( pn.isValid( ) ).toBe( true );
		expect( pn.isPossible( ) ).toBe( true );
		expect( pn.isMobile( ) ).toBe( true );
		expect( pn.getNumber( 'significant' ) ).toBe( '707123456' );
		expect( pn.canBeInternationallyDialled( ) ).toBe( true );
		expect( pn.toJSON( ).canBeInternationallyDialled ).toBe( true );
	} );

	it( 'should be able to create an example phone number', function( ) {
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

	it( 'should be able to format as-you-type', function( ) {
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

	it( 'should be able to convert country code <-> region code', function( ) {
		expect( PhoneNumber.getCountryCodeForRegionCode( 'SE' ) ).toBe( 46 );
		expect( PhoneNumber.getRegionCodeForCountryCode( 46 ) ).toBe( 'SE' );
	} );

	it( 'should be possible to get region code', function( ) {
		var pn = new PhoneNumber( '0707123456', 'SE' );
		expect( pn.getRegionCode( ) ).toBe( 'SE' );
	} );

	it( 'should have supported calling codes', function( ) {
		const codes = PhoneNumber.getSupportedCallingCodes( );
		expect( codes.length ).toBeGreaterThan( 100 );
	} );

	it( 'should have supported calling regions', function( ) {
		const regions = PhoneNumber.getSupportedRegionCodes( );
		expect( regions.length ).toBeGreaterThan( 100 );
	} );
} );
