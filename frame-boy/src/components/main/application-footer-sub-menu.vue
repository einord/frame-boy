<template>
<div class="application-footer application-footer-sub-menu custom-menu">
    <div class="space left-space">
        <normal-button icon="arrow-left" transparent @click="menuGoBack" />
    </div>
    <nav>
        <slot></slot>
    </nav>
</div>
</template>

<script setup lang="ts">
import NormalButton from '@/components/common/normal-button.vue'

const menuGoBack = () => {
    window.history.back()
}

</script>

<style lang="scss" scoped>
.application-footer-sub-menu {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: auto;
    gap: 1rem;
    margin: 0;
    padding-bottom: 0.25em;
    font-size: $font-size-normal;
    background-color: $application-background-color;
    height: $footer-height;
    overflow: hidden;

    > .left-space {
        text-align: left;
    }

    > nav {
        display: flex;
        flex-direction: row;
        gap: 0.5em;

        :deep(a) {
            color: $color-text;
            text-decoration: none;
            transition: color 0.2s ease-in-out;
            border-radius: $border-radius;
            padding: 0.25em 0.5em;

            > .default {
                font-size: $font-size-large;
            }
        }
    }

    > .right-space {
        text-align: right;
        font-size: $font-size-small;
    }
}
</style>