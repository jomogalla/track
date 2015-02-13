module.exports = function(config){
	config.set({
		basePath: './',
		frameworks: ['mocha', 'chai'],
		files: [
			'./app/vendorJS/jquery-1.11.2.js',
			'./app/vendorJS/angular.js',
			'./app/vendorJS/angular-mocks.js',
			'./app/vendorJS/*.js',
			'./app/app.js',
			'./app/**/*.js',
		],
		port: 9876,
		browsers: ['PhantomJS'],
		colors: true,
		logLevel: config.LOG_DEBUG,
		autoWatch: true,
		singleRun: false,
		reporters: ['progress'],
	});
};