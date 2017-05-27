module.exports = {
  plugins: [
    require('postcss-import')({}),
    require('postcss-nested')({}),
    require('postcss-cssnext')({
      warnForDuplicates: false,
    }),
    require('autoprefixer')({
      browsers: ['IE 9', 'IE 10', 'IE 11', 'last 2 versions']
    }),
  ]
};