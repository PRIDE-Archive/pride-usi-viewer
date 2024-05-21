module.exports = {
	outputDir:'dist',
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	lintOnSave: false,
	productionSourceMap: false,
	css: {
	    loaderOptions: {
	    	less: {
	    		javascriptEnabled: true
	    	}
	    }
	}
	// transpileDependencies: [
	// 	'vue-echarts',
	// 	'resize-detector'
	// ],
	// runtimeCompiler:true
}
