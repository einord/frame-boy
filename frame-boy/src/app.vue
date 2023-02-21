<template>
    <div class="content">
        <router-view />
    </div>
    <application-footer />
</template>

<script setup lang="ts">
import ApplicationFooter from '@/components/main/application-footer.vue';
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    > .content {
        flex: 1;
    }
}
</style>