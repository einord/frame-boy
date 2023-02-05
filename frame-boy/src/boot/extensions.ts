import { boot } from 'quasar/wrappers';
import { compile, createApp, defineAsyncComponent } from 'vue';

const fileData = `
<template>
<div class="current-time-ext">
This is an external extension showing the current time: {{ new Date() }}
</div>
</template>

<script setup lang="ts">
console.log('Extension widget loaded');
</script>

<style lang="scss" scoped>
.current-time {
background-color: lightsteelblue;
}
</style>
`;

function importStringAsFile() {

    const blob = new Blob([fileData], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    return url;
}

export default boot(({ app }) => {
    // app.component('fa', FontAwesomeIcon);
    // library.add(fas);

    console.log('booting extensions');
    // app.component('current-time-ext', () => import(/* @vite-ignore */ importStringAsFile()));
    // app.component('current-time-ext', () => fileData);
    
    const currentTimeExtensionPath = '/src/components/extensions/current-time';
    // app.component('current-time-ext', defineAsyncComponent(/* @vite-ignore */() => import(currentTimeExtensionPath)));
    // app.component('current-time-ext', defineAsyncComponent(() => import('./test.vue')));
    // app.component('current-time-ext', defineAsyncComponent(() => import(/* @vite-ignore */ importStringAsFile())));
    // app.component('current-time-ext', () => compile(fileData));
    // const hej = createApp({ render: compile(fileData) });
    app.component('current-time-ext', () => compile(fileData));
});