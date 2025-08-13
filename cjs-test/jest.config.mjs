export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: [
		'<rootDir>/test/**/*.ts',
		'<rootDir>/test/**/*.js',
	],
	modulePathIgnorePatterns: [],
	collectCoverage: false,
}
