const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const loginCheck = require('./loginCheck')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession({
  resave: false,
  saveUninitialized: true, // 是否儲存未初始化的會話
  secret: 'keyboard cat', // 對session id 相關的cookie 進行簽名
  cookie: { maxAge: 10 * 1000 } // 設定 session 的有效時間，單位毫秒
}))

app.get('/', (req, res) => {
  // console.log(req.session)
  // console.log(req.session.firstName)
  // console.log(req.sessionID)
  if (req.session.firstName) { //判斷session 狀態，如果有效，則返回主頁，否則轉到登入頁面
    const userNow = req.session
    res.render('welcome', { userNow })
  } else {
    res.render('index')
  }
})

app.post('/login', (req, res) => {
  // console.log('loginUser', req.body)
  const userNow = loginCheck(req.body)
  // console.log('Now User', userNow)
  if (userNow) {
    req.session.firstName = userNow.firstName // 登入成功，設定 session
    res.render('welcome', { userNow })
  } else {
    const wrong = 'Username 或 Password 錯誤 !!'
    res.render('index', { wrong })
  }
  // console.log(req.session.firstName)
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})