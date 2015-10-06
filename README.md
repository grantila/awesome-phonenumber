# Awesome phonenumber parser

This library is a pre-compiled version of Google's `libphonenumber`, with a slightly simpler interface. It has a minimal footprint - is by far the smallest libphonenumber-based library available on npmjs (other libraries are orders of magnitude larger!), and has no dependencies.

Uses libphonenumber 7.0.11

## Comparison with other libraries

Since this library is pre-compiled, it doesn't depend on the closure compiler, and needs not load it on start. This makes the library faster and saves you a lot of space. It also means this library is trivial to use in any `browserify` project (or using any other means to run in the browser).

Among all the phone number libraries using Google's `libphonenumber`, only this one, `google-libphonenumber` (0.2.2) and `node-phonenumber` (0.2.1) had decent README's with examples. Other libraries embedding the closure compiler should get comparable figures.

`google-libphonenumber` and `node-phonenumber` naturally become faster once loaded and after first parsing, but for many applications, the first time matters a lot. Loading the closure compiler also adds to the application memory usage (RSS is measured here). The library footprints are also bigger, making `npm install` slower and increasing deploy times.

A test program loading a library, then parsing a phone number is called 5 times for each library, the mean values are:

Action                   | awesome-phonenumber | google-libphonenumber | node-phonenumber
------------------------ | ------------------- | --------------------- | ----------------
Load library first time  | 21 ms               | 101 ms                | 83 ms
Parse first phone number | 5 ms                | 11 ms                 | 8 ms
Increased memory usage   | 9.8 M               | 19.1 M                | 19.5 M
node_modules size        | 296 K               | 16 M                  | 53 M
node_modules files       | 15                  | 967                   | 4340
time npm install         | 0.7 s               | 2.4 s                 | 5.9 s

## Basic usage
```js
var PhoneNumber = require( 'awesome-phonenumber' );

var pn = new PhoneNumber( '0707123456', 'SE' );
pn.isValid( );  // -> true
pn.isMobile( ); // -> true
pn.getNumber( );                 // -> '+46707123456'
pn.getNumber( 'e164' );          // -> '+46707123456' (default)
pn.getNumber( 'international' ); // -> '+46 70 712 34 56'
pn.getNumber( 'national' );      // -> '070-712 34 56'
pn.getNumber( 'rfc3966' );       // -> 'tel:+46-70-712-34-56'
pn.getNumber( 'significant' );   // -> '707123456'

pn.toJSON( );                  // -> json blob, so that:
JSON.stringify( pn, null, 4 ); // -> This:
// {
//     "number": {
//         "input": "0707123456",
//         "international": "+46 70 712 34 56",
//         "national": "070-712 34 56",
//         "e164": "+46707123456",
//         "rfc3966": "tel:+46-70-712-34-56",
//         "significant": "707123456"
//     },
//     "regionCode": "SE",
//     "valid": true,
//     "possible": true,
//     "type": "mobile",
//     "possibility": "is-possible"
// }
```

## API types

The API consists of the `PhoneNumber` class which sometimes uses *enums*. These are:

### <a name="phone-number-types"></a>Phone number types
```js
'fixed-line'
'fixed-line-or-mobile'
'mobile'
'pager'
'personal-number'
'premium-rate'
'shared-cost'
'toll-free'
'uan'
'voip'
'unknown'
```

### Phone number possibilities

```js
'is-possible'
'invalid-country-code'
'too-long'
'too-short'
'unknown'
```

### Phone number formats

```js
'international'
'national'
'e164'
'rfc3966'
'significant'
```

## API functions

### Library
```js
var PhoneNumber = require( 'awesome-phonenumber' );
````

### Country codes

There are conversion functions between the 2-character ISO 3166-1 region codes (e.g. 'SE' for Sweden) and the corresponding country calling codes.

```js
PhoneNumber.getCountryCodeForRegionCode( regionCode );  // -> countryCode
PhoneNumber.getRegionCodeForCountryCode( countryCode ); // -> regionCode
````

#### Example

```js
PhoneNumber.getCountryCodeForRegionCode( 'SE' ); // -> 46
PhoneNumber.getRegionCodeForCountryCode( 46 );   // -> 'SE'
````

### Phone numbers

An instance of the `PhoneNumber` class will be created even if `PhoneNumber` is called as a function.

```js
var pn = PhoneNumber( number, regionCode );
// is the same as
var pn = new PhoneNumber( number, regionCode );
```

PhoneNumber objects can also be created using the `getExample( regionCode[, type ] )` function, see section [Example phone numbers for country](#example) below.

```js
pn.toJSON( );               // -> json blob as seen in "Basic usage" above
pn.isValid( );              // -> Boolean
pn.isPossible( );           // -> Boolean
pn.getType( );              // -> Any of the "Phone number types" defined above
pn.isMobile( );             // -> true if type is 'mobile' or 'fixed-line-or-mobile'
pn.isFixedLine( );          // -> true if type is 'fixed-line' or 'fixed-line-or-mobile'
pn.getNumber( [ format ] ); // -> Formatted number, see "Basic usage" for examples

// Returns the number formatted to how to dial it from another region.
pn.getNumberFrom( fromRegionCode );
```

#### Example

```js
// Calling the Swedish number 0707123456 from Japan:
PhoneNumber( '0707123456', 'SE' ).getNumberFrom( 'JP' ); // '010 46 70 712 34 56'
```

### <a name="example"></a>Example phone numbers for country

Sometimes you want to display a formatted example phone number for a certain country (and maybe also a certain type of phone number). The `getExample` function is used for this.

```js
PhoneNumber.getExample( regionCode[, phoneNumberType] ); // PhoneNumber object
```

The `phoneNumberType` is any of the [types defined above](#phone-number-types).

#### Example

```js
PhoneNumber.getExample( 'SE' ).getNumber( );                      // '+468123456'
PhoneNumber.getExample( 'SE', 'mobile' ).getNumber( );            // '+46701234567'
PhoneNumber.getExample( 'SE', 'mobile' ).getNumber( 'national' ); // '070 123 45 67'
```

### As-you-type formatting

You can use an `AsYouType` class to format a phone number as it is being typed. An instance of this class is retrieved by `var ayt = PhoneNumber.getAsYouType( regionCode )`, and has the following methods:

```js
// Add a character to the end of the number
ayt.addChar( nextChar );

// Get the current formatted number
ayt.number( );

// Remove the last character
ayt.removeChar( );

// Replace the whole number with a new number (or an empty number if null)
ayt.reset( [ number ] );

// Get a PhoneNumber object representing the current number
ayt.getPhoneNumber( );
```

All the functions above except `getPhoneNumber( )` return the current formatted number (as a String of course, as it may include spaces and other characters).

#### Example

```js
var ayt = PhoneNumber.getAsYouType( 'SE' );
ayt.addChar( '0' ); // -> '0'
ayt.addChar( '7' ); // -> '07'
ayt.addChar( '0' ); // -> '070'
ayt.addChar( '7' ); // -> '070 7'
ayt.addChar( '1' ); // -> '070 71'
ayt.addChar( '2' ); // -> '070 712'
ayt.addChar( '3' ); // -> '070 712 3'
ayt.addChar( '4' ); // -> '070 712 34'
ayt.addChar( '5' ); // -> '070 712 34 5'
ayt.addChar( '6' ); // -> '070 712 34 56'
ayt.removeChar( );  // -> '070 712 34 5'
ayt.addChar( '7' ); // -> '070 712 34 57'
```
