module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['src/lds.<%= pkg.name %>.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		// https://npmjs.org/package/grunt-include-replace
		includereplace: {
			dist: {
				options: {
					// Global variables available in all files
					globals: {
						version: '<%= pkg.version %>',
						date: '<%= grunt.template.today("yyyy/mm/dd") %>'
					},
					// Optional variable prefix & suffix, defaults as shown
					prefix: '@@',
					suffix: ''
				},
				// Files to perform replacements and includes with
				src: 'src/lds.<%= pkg.name %>.js',
				// Destinaion directory to copy files to
				dest: 'dist/'
			}
		},
		// https://github.com/gruntjs/grunt-contrib-uglify
		uglify:{
			options: {
				compress:false,
				preserveComments:'some' // preserve the blocks of comments that start with a /*!
			},
			dist:{
				src:['dist/lds.<%= pkg.name %>.js'],
				dest:'dist/lds.<%= pkg.name %>.min.js'
			},
			cdn:{
				src:['dist/lds.<%= pkg.name %>.js'],
				dest:'build/lds.<%= pkg.name %><%= pkg.version %>.min.js'
			}
		},
		copy: {
			cdn: {
				files: [
					{
						src:"dist/lds.<%= pkg.name %>.js",
						dest:"../../cdn/trunk/src/main/resources/ml/ldsorg/ver/scripts/<%= pkg.folder %>/lds.<%= pkg.name %><%= pkg.version %>.min.js"
					},
					{
						src:"dist/lds.<%= pkg.name %>.js",
						dest:"../../cdn/tags/test/ml/ldsorg/ver/scripts/<%= pkg.folder %>/lds.<%= pkg.name %><%= pkg.version %>.min.js"
					},
					{
						src:"dist/lds.<%= pkg.name %>.js",
						dest:"../../cdn/tags/stage/ml/ldsorg/ver/scripts/<%= pkg.folder %>/lds.<%= pkg.name %><%= pkg.version %>.min.js"
					},
					{
						src:"dist/lds.<%= pkg.name %>.js",
						dest:'../../cdn/tags/prod/ml/ldsorg/ver/scripts/<%= pkg.folder %>/lds.<%= pkg.name %><%= pkg.version %>.min.js'
					}
				]
			}
		}
	});
	//grunt plugins
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-include-replace');

	grunt.registerTask('default',['jshint', 'includereplace', 'uglify:dist']);
	// only needed to be run by Aaron to put copies out on the CDN
	grunt.registerTask('cdn',['copy:cdn']);
};
