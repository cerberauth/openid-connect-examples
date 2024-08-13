import './assets/main.css'

import { createApp } from 'vue'
import { createAuth } from 'vue-auth3'
import driverBearerToken from 'vue-auth3/drivers/auth/bearer-token'
import driverHttpFetch from 'vue-auth3/drivers/http/fetch'
import App from './App.vue'
import './drivers/testid'
import router from './router'

const auth = createAuth({
  plugins: {
    router,
  },
  drivers: {
    auth: driverBearerToken,
    http: driverHttpFetch,
  },
})

const app = createApp(App)

app.use(router).use(auth)
// app.use(router)
app.mount('#app')
