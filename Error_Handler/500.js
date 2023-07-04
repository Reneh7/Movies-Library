module.exports = (err, req, res, next) => {
  res.status(500).send({
    Code: 500,
    message: "Sorry, something went wrong",
    Error: err,
  });
};