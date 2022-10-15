const mongoose = require('mongoose')

const conectionString = process.env.MONGO_DB_URI

// conection to mongodb
mongoose
  .connect(conectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.error(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
