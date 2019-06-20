module.exports = {
  errorHandler(err, req, res, next) {
  if (!err.message) {
    if (err.code == 401) {
      res.status(401).json({
        message: `Unauthorized`
      })
    } else if (err.code == 404) {
      res.status(404).send({
        message: `Data Not Found`
      })
    } else if (err.code == 500) {
      res.status(500).json({
        message: `Internal Server Errors`
      })
    } else {
      console.log(err);
      res.send(err)
    }
  } else {
    if (err.name === 'ValidationError') {
      res.status(400).json({
        message: err.message
      })
    } else {
      console.log(err);
      res.status(err.code).json({
        message: err.message
      })
    }
  }
}}