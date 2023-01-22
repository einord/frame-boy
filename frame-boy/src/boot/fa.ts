import { boot } from 'quasar/wrappers';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

export default boot(({ app }) => {
    app.component('fa', FontAwesomeIcon);
    library.add(fas);
});