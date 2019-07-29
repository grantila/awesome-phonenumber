'use strict';

const { expect } = require( 'chai' );

const PhoneNumber = require( '../../' );

describe( 'general', function( ) {
	it( 'should be able to parse a phone number', function( ) {
		var pn = new PhoneNumber( '0707123456', 'SE' );
		expect( pn.isValid( ) ).to.be.true;
		expect( pn.isPossible( ) ).to.be.true;
		expect( pn.isMobile( ) ).to.be.true;
		expect( pn.getNumber( 'significant' ) ).to.equal( '707123456' );
		expect( pn.canBeInternationallyDialled( ) ).to.equal( true );
		expect( pn.toJSON( ).canBeInternationallyDialled ).to.equal( true );
	} );

	it( 'should be able to create an example phone number', function( ) {
		var pn1 = PhoneNumber.getExample( 'SE' );
		expect( pn1.isValid( ) ).to.be.true;
		expect( pn1.isPossible( ) ).to.be.true;

		var pn2 = PhoneNumber.getExample( 'SE', 'mobile' );
		expect( pn2.isValid( ) ).to.be.true;
		expect( pn2.isPossible( ) ).to.be.true;
		expect( pn2.isMobile( ) ).to.be.true;
		expect( pn2.isFixedLine( ) ).to.be.false;

		var pn3 = PhoneNumber.getExample( 'SE', 'fixed-line' );
		expect( pn3.isValid( ) ).to.be.true;
		expect( pn3.isPossible( ) ).to.be.true;
		expect( pn3.isMobile( ) ).to.be.false;
		expect( pn3.isFixedLine( ) ).to.be.true;
	} );

	it( 'should be able to format as-you-type', function( ) {
		var ayt = PhoneNumber.getAsYouType( 'SE' );
		expect( ayt.addChar( '0' ) ).to.equal( '0' );
		expect( ayt.addChar( '7' ) ).to.equal( '07' );
		expect( ayt.addChar( '0' ) ).to.equal( '070' );
		expect( ayt.addChar( '7' ) ).to.equal( '070-7' );
		expect( ayt.addChar( '1' ) ).to.equal( '070-71' );
		expect( ayt.addChar( '2' ) ).to.equal( '070-712' );

		var pn1 = ayt.getPhoneNumber( );
		expect( pn1.isValid( ) ).to.be.false;

		expect( ayt.addChar( '3' ) ).to.equal( '070-712 3' );
		expect( ayt.addChar( '4' ) ).to.equal( '070-712 34' );
		expect( ayt.addChar( '5' ) ).to.equal( '070-712 34 5' );
		expect( ayt.addChar( '6' ) ).to.equal( '070-712 34 56' );

		var pn2 = ayt.getPhoneNumber( );
		expect( pn2.isValid( ) ).to.be.true;
		expect( pn2.isPossible( ) ).to.be.true;
	} );

	it( 'should be able to convert country code <-> region code', function( ) {
		expect( PhoneNumber.getCountryCodeForRegionCode( 'SE' ) ).to.equal( 46 );
		expect( PhoneNumber.getRegionCodeForCountryCode( 46 ) ).to.equal( 'SE' );
	} );

	it( 'should be possible to get region code', function( ) {
		var pn = new PhoneNumber( '0707123456', 'SE' );
		expect( pn.getRegionCode( ) ).to.equal( 'SE' );
	} );

	it( 'should have supported calling codes', function( ) {
		const codes = PhoneNumber.getSupportedCallingCodes( );
		expect( codes.length ).to.be.above( 100 );
	} );

	it( 'should have supported calling regions', function( ) {
		const regions = PhoneNumber.getSupportedRegionCodes( );
		expect( regions.length ).to.be.above( 100 );
	} );
} );
