/* jshint node:true */

module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		clean: {
			dist: ["dist/*"]
		},
		copy: {
			dist: {

				files: [
					{
						expand: true,
						flatten: true,
						src: [
							"src/robots.txt",
							"src/sitemap.xml",
							"src/favicon.ico"
						],
						dest: "dist/"
					}
				]
			}
		},
		compress : {
			zip: {
				options : {
					archive: ("builds/rd-arts"+ "-" + grunt.template.date((new Date()), "yyyymmdd") + ".zip")
				},
				files: [{
					expand: true,
					cwd: "dist/",
					src: ["**/*"]
				}]
			}
		},
		connect:{
			dev: {
				options: {
					port     : 8080,
					hostname : "*",
					base     : "src"
				}
			},
			prod: {
				options: {
					port     : 9090,
					hostname : "*",
					base     : "dist"
				}
			}
		},
		validation: {
			dist: {
				options: {
					reset: true,
					path: "log/validation-status.json",
					reportpath: "log/validation-report.json",
					stoponerror: true
				},
				files: {
					src: ["src/index.html"]
				}
			}
		},
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace       : true,
					collapseBooleanAttributes: true,
					removeEmptyAttributes    : true,
					removeRedundantAttributes: true
				},
				files: [{
					src : "src/index.html",
					dest: "dist/index.html"
				}]
			}
		},
		cssmin: {
			dist: {
				files: [{
					src : "src/main.css",
					dest: "dist/main.css"
				}]
			}
		},
		jshint: {
			dist: {
				options: {jshintrc: ".jshintrc"},
				files: [
					{src: "Gruntfile.js"},
					{src: "src/lib/static-gmap.js"},
					{src: "src/main.js"}
				]
			}
		},
		uglify: {
			dist: {
				files: [
					{src: "src/lib/static-gmap.js", dest: "dist/lib/static-gmap.js"},
					{src: "src/lib/fluidvids.js", dest: "dist/lib/fluidvids.js"},
					{src: "src/main.js", dest: "dist/main.js"}
				]
			}
		},
		imagemin: {
			dist:{
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: "src/img",
					src:  ["**/*.{png,jpg}"],
					dest: "dist/img"
				}]
			}
		},
		watch: {
			js: {
				files: ["src/**/*.js"],
				tasks: ["jshint"],
			},
			all: {
				options: {
					livereload: true
				},
				files: ["src/**/*.{html,css,js,png,jpg}"]
			}
		}
	});

	(["clean", "compress", "connect", "cssmin", "jshint", "htmlmin", "imagemin", "uglify", "watch", "copy"]
		.forEach(function (task) {
			grunt.loadNpmTasks("grunt-contrib-" + task);
		})
	);

	grunt.loadNpmTasks("grunt-html-validation");

	grunt.registerTask("default", ["validation", "jshint"]);
	grunt.registerTask("livereload", ["connect:dev", "watch:all"]);
	grunt.registerTask("build", ["default", "clean", "uglify", "cssmin", "htmlmin", "imagemin", "copy"]);
	grunt.registerTask("archive", ["build", "compress"]);
};
