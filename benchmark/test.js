
var libs = {
	'awesome-phonenumber': function( ) {
		var mem1 = process.memoryUsage( );
		var time1 = Date.now( );

		var { parsePhoneNumber } = require( 'awesome-phonenumber' );

		var time2 = Date.now( );

		const pn1 = parsePhoneNumber( '0707123456', { regionCode: 'SE' } );
		pn1.number.international;

		var time3 = Date.now( );

		pn1.number.international;

		var time4 = Date.now( );

		const pn2 = parsePhoneNumber( '0707123456', { regionCode: 'SE' } );
		pn2.number.international;

		var time5 = Date.now( );
		var mem2 = process.memoryUsage( );

		return [ time2 - time1, time3 - time2, time4 - time3, time5 - time4, mem2.rss - mem1.rss ];
	},
	'google-libphonenumber': function( ) {
		var mem1 = process.memoryUsage( );
		var time1 = Date.now( );

		var PNF = require('google-libphonenumber').PhoneNumberFormat;
		var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

		var time2 = Date.now( );

		var phoneNumber = phoneUtil.parse('0707123456', 'SE');
		phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);

		var time3 = Date.now( );

		phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);

		var time4 = Date.now( );

		var phoneNumber = phoneUtil.parse('0707123456', 'SE');
		phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);

		var time5 = Date.now( );
		var mem2 = process.memoryUsage( );

		return [ time2 - time1, time3 - time2, time4 - time3, time5 - time4, mem2.rss - mem1.rss ];
	},
	'libphonenumber-js': function( ) {
		var mem1 = process.memoryUsage( );
		var time1 = Date.now( );

		var parsePhoneNumber = require('libphonenumber-js');

		var time2 = Date.now( );

		var phoneNumber = parsePhoneNumber('0707123456', 'SE');
		phoneNumber.formatInternational();

		var time3 = Date.now( );

		phoneNumber.formatInternational();

		var time4 = Date.now( );

		var phoneNumber = parsePhoneNumber('0707123456', 'SE');
		phoneNumber.formatInternational();

		var time5 = Date.now( );
		var mem2 = process.memoryUsage( );

		return [ time2 - time1, time3 - time2, time4 - time3, time5 - time4, mem2.rss - mem1.rss ];
	}
};

console.log( libs[ process.argv[ 2 ] ]( ) );
