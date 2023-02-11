import { parsePhoneNumber } from 'awesome-phonenumber'

const div = document.createElement( 'div' );
div.id = 'rootdiv';

const pn = parsePhoneNumber( '+46707123456' );
div.innerHTML = `Formatted: ${pn.number.national}`;

document.documentElement.appendChild( div );
