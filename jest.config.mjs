export default {
	resolver: 'ts-jest-resolver',
	testEnvironment: 'node',
	testMatch: [
		'<rootDir>/test/**/*.ts',
		'<rootDir>/test/**/*.js',
	],
	moduleNameMapper: {
		"awesome-phonenumber": "<rootDir>/index.js",
	},
	modulePathIgnorePatterns: [],
	collectCoverage: false,
	extensionsToTreatAsEsm: ['.ts'],
}
