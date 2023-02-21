import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import ApplicationFooterSubMenu from '@/components/main/application-footer-sub-menu.vue'
import NormalButton from '@/components/common/normal-button.vue'

library.add(fas);

createApp(App)
    .component('fa', FontAwesomeIcon)
    .component('sub-menu', ApplicationFooterSubMenu)
    .component('normal-button', NormalButton)
    .use(router)
    .mount('#app')
