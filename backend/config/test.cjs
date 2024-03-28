
console.log("test db:", process.env.DATABASE_URL_TEST)

module.exports = {
    LOGS_DIR: './logs',
    DATABASE_URL: process.env.DATABASE_URL_TEST,
}
