import PhoneNumber from '../../'

const div = document.createElement( 'div' );
div.id = 'rootdiv';

const pn = new PhoneNumber( '+46707123456' );
div.innerHTML = `Formatted: ${pn.getNumber('national')}`;

document.documentElement.appendChild( div );
