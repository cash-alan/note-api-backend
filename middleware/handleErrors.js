module.exports = (error, request, response, next) => {
  console.error(error)
  console.log(error.name)
  error.name === 'CastError'
    ? response.status(400).send({ error: 'id used is malformed' })
    : response.status(500).end()
}
