import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
	entry: './src/index.ts',
	mode: 'production',
	plugins: [
		new HtmlWebpackPlugin( )
	],
}
