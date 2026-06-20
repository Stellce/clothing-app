import { access, readFileSync } from 'fs'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

const app = express()
const port = 8765

const endpointsJSON = JSON.parse(readFileSync('db.json', 'utf-8'))

const corsOptions = {
  origin: ['http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', '*'],
  allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

function resolveEndpoints(prevRoute, json, forced) {
  for (let newRoute in json) {
    const data = json[newRoute];
    const route = prevRoute + '/' + newRoute;

    if (newRoute === "0" || typeof data !== 'object') continue;

    if (data['url'] || data['queryParams'] || forced) {
      addEndpoint(route, data)
    } else if (data['eachAsEndpoint']) {
      resolveEndpoints(route, data, true)
    } else if (data['urlArr']) {
      addEndpoint(route, data['urlArr'])
      resolveEndpoints(route, data)
    } else {
      resolveEndpoints(route, data)
    }
  }
}

resolveEndpoints('', endpointsJSON)

app.post('/oauth2/login/basic', (req, res) => {

  console.log(`login req: `, req)
  
  const { username, password } = req.body

  const access_token = jwt.sign(
    {
      sub: "mocksub:testUser",
      email: 'john.doe@email.com',
      realm_access: {
        roles: username === 'john.doe@example.com' ? 'ADMIN' : 'CUSTOMER'
      },
      iss: 'mock-server',
      name: 'User'
    },
    'test-key',
    {
      expiresIn: '15m'
    }
  )
  const refresh_token = 1;

  res.json({
    access_token,
    refresh_token
  })
})
console.log(`\tPOST: /oauth2/login/basic`)

app.get('test', (req, res) => {
  res.send({test: 'ok'});
})
console.log(`\tGET: /test`);

app.listen(port, () => {
  console.log(`Mock backend listening on port ${port}`)
})

function addEndpoint(route, data) {
  const queryParams = data['queryParams'];
  const method = data['method'] || 'get';
  const status = data['resStatusCode'];
  if (data['method']) data = data['data'];
  app[method](route, (req, res) => {
    const reqParams = Object.entries(req.query).map(([key, value]) => ({ key, value }))

    if (queryParams) data = queryParams[reqParams[0].key][reqParams[0].value];
    if (status) res.status(status);
    res.send(data);
  })
  if (!queryParams) console.log(`\t${method.toUpperCase()}: ${route}`);
}
