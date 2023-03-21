import PhoneNumberClass, {
	parsePhoneNumber,
	getAsYouType,
	getExample,
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedRegionCodes,
	getSupportedCallingCodes,
	getNumberFrom,
} from 'awesome-phonenumber';



const failureResult = ( msg: string ) =>
( {
	valid: false,
	error: expect.objectContaining( {
		message: expect.stringContaining( msg ),
	} ),
} );

describe( 'general', ( ) =>
{
	it( 'should be able to parse a phone number', ( ) =>
	{
		var pn = parsePhoneNumber( '0707123456', { regionCode: 'SE' } );
		expect( pn.valid ).toBe( true );
		if ( pn.valid !== true ) return;
		expect( pn.possible ).toBe( true );
		expect( pn.typeIsMobile ).toBe( true );
		expect( pn.number.significant ).toBe( '707123456' );
		expect( pn.canBeInternationallyDialled ).toBe( true );
	} );

	it( 'should be able to create an example phone number', ( ) =>
	{
		var pn1 = getExample( 'SE' );
		expect( pn1.valid ).toBe( true );
		expect( pn1.possible ).toBe( true );

		var pn2 = getExample( 'SE', 'mobile' );
		expect( pn2.valid ).toBe( true );
		expect( pn2.possible ).toBe( true );
		expect( pn2.typeIsMobile ).toBe( true );
		expect( pn2.typeIsFixedLine ).toBe( false );

		var pn3 = getExample( 'SE', 'fixed-line' );
		expect( pn3.valid ).toBe( true );
		expect( pn3.possible ).toBe( true );
		expect( pn3.typeIsMobile ).toBe( false );
		expect( pn3.typeIsFixedLine ).toBe( true );
	} );

	it( 'should be able to convert country code <-> region code', ( ) =>
	{
		expect( getCountryCodeForRegionCode( 'SE' ) ).toBe( 46 );
		expect( getRegionCodeForCountryCode( 46 ) ).toBe( 'SE' );
	} );

	it( 'should be possible to get region code', ( ) =>
	{
		var pn = parsePhoneNumber( '0707123456', { regionCode: 'SE' } );
		expect( pn.regionCode ).toBe( 'SE' );
	} );

	it( 'should be possible to get country code', ( ) =>
	{
		var pn = parsePhoneNumber( '0707123456', { regionCode: 'SE' } );
		expect( pn.countryCode ).toBe( 46 );
	} );

	it( 'should have supported calling codes', ( ) =>
	{
		const codes = getSupportedCallingCodes( );
		expect( codes.length ).toBeGreaterThan( 100 );
	} );

	it( 'should not guess US for invalid region code numbers', ( ) =>
	{
		const pn = parsePhoneNumber( '+80012345678' );
		expect( pn.regionCode ).not.toBe( 'US' );
	} );

	it( 'should not guess US for known CA numbers', ( ) =>
	{
		const pn = parsePhoneNumber( '+1613 734.6759', { regionCode: 'CA' } );
		expect( pn.regionCode ).toBe( 'CA' );
	} );

	it( 'should not guess US for known CA numbers w/o "CA" specified', ( ) =>
	{
		const pn = parsePhoneNumber( '+16137346759' );
		expect( pn.regionCode ).toBe( 'CA' );
	} );

	it( 'should not use US for known CA numbers', ( ) =>
	{
		// Issue #51
		const pn = parsePhoneNumber( '+1613 734.6759', { regionCode: 'US' } );
		expect( pn.regionCode ).toBe( 'CA' );
	} );

	it( 'should not use region code for international numbers (+)', ( ) =>
	{
		const pn = parsePhoneNumber( '+49040398272', { regionCode: 'ES' } );
		expect( pn.regionCode ).toBe( 'DE' );
		expect( pn.countryCode ).toBe( 49 );
	} );

	it( 'should hint region code for double-zero leading numbers', ( ) =>
	{
		const pn = parsePhoneNumber( '0049040398272', { regionCode: 'ES' } );
		expect( pn.regionCode ).toBe( 'DE' );
		expect( pn.countryCode ).toBe( 49 );
	} );

	it( 'should hint region code for double-zero leading numbers', ( ) =>
	{
		const pn = parsePhoneNumber( '0049040398272', { regionCode: 'US' } );
		expect( pn.valid ).toBe( false );
		expect( pn.regionCode ).toBe( null );
	} );

	it( 'should extract region by prefix as early as possible', ( ) =>
	{
		const pn1 = parsePhoneNumber( '+1' );
		const pn1x = parsePhoneNumber( '+12' );
		expect( pn1.regionCode ).toBe( 'US' );
		expect( pn1x.regionCode ).toBe( 'US' );

		const pn2 = parsePhoneNumber( '+46' );
		const pn2x = parsePhoneNumber( '+467' );
		expect( pn2.regionCode ).toBe( 'SE' );
		expect( pn2x.regionCode ).toBe( 'SE' );

		const pn3 = parsePhoneNumber( '+358' );
		const pn3x = parsePhoneNumber( '+3587' );
		expect( pn3.regionCode ).toBe( 'FI' );
		expect( pn3x.regionCode ).toBe( 'FI' );
	} );

	it( 'should return unique list of calling codes', ( ) =>
	{
		const callingCodes = getSupportedCallingCodes( );

		expect( callingCodes.length ).toBe( new Set( callingCodes ).size );
	} );

	it( 'should return unique list of region codes', ( ) =>
	{
		const regionCodes = getSupportedRegionCodes( );

		expect( regionCodes.length ).toBe( new Set( regionCodes ).size );
	} );
} );


describe( 'as-you-type', ( ) =>
{
	it( 'should be able to format as-you-type', ( ) =>
	{
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

	it( 'should be able to format as-you-type with removeChar', ( ) =>
	{
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
		expect( pn1.valid ).toBe( false );

		expect( ayt.addChar( '4' ) ).toBe( '070-712 34' );
		expect( ayt.addChar( '5' ) ).toBe( '070-712 34 5' );
		expect( ayt.addChar( '6' ) ).toBe( '070-712 34 56' );

		var pn2 = ayt.getPhoneNumber( );
		expect( pn2.valid ).toBe( true );
		expect( pn2.possible ).toBe( true );
	} );

	it( 'should reset properly with new number', ( ) =>
	{
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

	it( 'should reset properly without new number', ( ) =>
	{
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


describe( 'errors', ( ) =>
{
	it( 'should not allow too short numbers', ( ) =>
	{
		var pn = parsePhoneNumber( '+12' );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
	} );

	it( 'should handle invalid country code', ( ) =>
	{
		var pn = parsePhoneNumber( '+0123' );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle invalid country code (and valid region code)', ( ) =>
	{
		var pn = parsePhoneNumber( '+0123', { regionCode: 'SE' } );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle invalid country code and region code', ( ) =>
	{
		var pn = parsePhoneNumber( '0123', { regionCode: 'XX' } );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle missing country code', ( ) =>
	{
		var pn = parsePhoneNumber( '0123' );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'invalid-country-code' );
	} );

	it( 'should handle TOO_SHORT', ( ) =>
	{
		var pn = parsePhoneNumber( '0123', { regionCode: 'SE' } );
		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'too-short' );
	} );

	it( 'should handle invalid phone number', ( ) =>
	{
		const failure = ( arg: any ) => parsePhoneNumber( arg );

		expect( failure( null ) )
			.toMatchObject( failureResult( "Invalid phone number" ) );
		expect( failure( { } ) )
			.toMatchObject( failureResult( "Invalid phone number" ) );
		expect( failure( [ ] ) )
			.toMatchObject( failureResult( "Invalid phone number" ) );
		expect( failure( 5 ) )
			.toMatchObject( failureResult( "Invalid phone number" ) );
		expect( failure( true ) )
			.toMatchObject( failureResult( "Invalid phone number" ) );
	} );

	it( 'should handle invalid phone number', ( ) =>
	{
		const failure = ( arg: any ) => parsePhoneNumber( '987654321', arg );

		expect( failure( "SE" ) )
			.toMatchObject( failureResult( "Invalid options" ) );
		expect( failure( 5 ) )
			.toMatchObject( failureResult( "Invalid options" ) );
		expect( failure( true ) )
			.toMatchObject( failureResult( "Invalid options" ) );
	} );

	// https://github.com/grantila/awesome-phonenumber/issues/98
	it( 'should handle invalid phone number #98', ( ) =>
	{
		const pn = parsePhoneNumber( "0740521234", { regionCode: "US" } );

		expect( pn.valid ).toBe( false );
		expect( pn.possible ).toBe( false );
		expect( pn.possibility ).toBe( 'invalid' );
	} );
} );

describe( 'getNumberFrom', ( ) =>
{
	it( 'Using weakmap', ( ) =>
	{
		const pn = parsePhoneNumber( '0707654321', { regionCode: 'SE' } );
		if ( !pn.valid )
		{
			expect( pn.valid ).toBe( true );
			return;
		}
		const fromJp = getNumberFrom( pn, 'JP' );
		expect( fromJp.number ).toBe( '010 46 70 765 43 21' );
	} );

	it( 'Using non-weakmap object', ( ) =>
	{
		const pn = parsePhoneNumber( '0707654321', { regionCode: 'SE' } );
		if ( !pn.valid )
		{
			expect( pn.valid ).toBe( true );
			return;
		}
		const clone = JSON.parse( JSON.stringify( pn ) ) ;
		const fromJp = getNumberFrom( clone, 'JP' );
		expect( fromJp.number ).toBe( '010 46 70 765 43 21' );
	} );
} );
