
const {
	PhoneNumber,
	AsYouType,
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedCallingCodes,
	getSupportedRegionCodes,
	findNumbers,
	getExample,
	getAsYouType,
	getNumberFrom,
} = index;

const parsePhoneNumber = ( ...args ) =>
{
	try
	{
		const ret = index( ...args ).toJSON( );
		if ( !ret.valid && !ret.possible )
		{
			ret.possible = false;
			if ( !ret.possibility )
				ret.possibility = 'invalid';
		}
		return ret;
	}
	catch ( error )
	{
		return {
			valid: false,
			possible: false,
			possibility: 'invalid',
			error,
		};
	}
};

export {
	AsYouType,
	parsePhoneNumber,
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedCallingCodes,
	getSupportedRegionCodes,
	findNumbers,
	getExample,
	getAsYouType,
	getNumberFrom,
}
