export default {
	resolver: 'ts-jest-resolver',
	testEnvironment: 'node',
	testMatch: [
		'<rootDir>/test/**/*.ts',
		'<rootDir>/test/**/*.js',
	],
	modulePathIgnorePatterns: [],
	collectCoverage: false,
	extensionsToTreatAsEsm: ['.ts'],
}
