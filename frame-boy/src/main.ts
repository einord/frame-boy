import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas);

createApp(App)
    .component('fa', FontAwesomeIcon)
    .use(router)
    .mount('#app')
