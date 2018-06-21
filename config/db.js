if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://ano:ano123@ds161610.mlab.com:61610/vidjot-34'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}