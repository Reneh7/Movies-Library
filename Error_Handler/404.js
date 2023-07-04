module.exports = (req, res, next) => {
  res.status(404).send({
    Code: 404,
    message: "Page not found",
    method: req.method,
    end_point: req.url
  });
};