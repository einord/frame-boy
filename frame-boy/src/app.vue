<template>
    <router-view class="content" />
    <application-footer />
</template>

<script setup lang="ts">
import ApplicationFooter from './components/application-footer.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
$q.dark.set(true); // TODO: Make this dynamic in the applications settings

</script>
