<template>
<div class="large-button" @click="routeToLink">
    <fa v-if="icon != null" class="icon" :icon="icon"></fa>
    <div v-if="title != null" class="title">{{ title }}</div>
    <div class="description">
        <slot></slot>
    </div>
</div>
</template>

<script setup lang="ts">
import router from 'src/router';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    title?: string;
    transparent?: boolean;
    activated?: boolean;
    icon?: string;
    iconColor?: string;
    to?: string;
}>(), {
    transparent: false,
    activated: false,
    iconColor: '#326496'
});

const currentIconColor = computed(() => props.iconColor ?? 'white');

const routeToLink = () => {
    if (props.to != null) {
        router.push(props.to ?? '');
    }
}
</script>

<style lang="scss" scoped>
.large-button {
    display: grid;
    grid-template-areas: 
        "icon title"
        "icon description";
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr 1fr;
    width: fit-content;
    align-items: center;
    color: $color-light;
    border: none;
    border-radius: $border-radius;
    padding: $spacing-small $spacing-medium;
    gap: 0 $spacing-medium;
    border: 2px solid $color-primary;
    background-color: rgba($color-primary, 0.5);
    text-align: left;

    &.transparent {
        background-color: transparent;
        border: 2px solid transparent;
    }

    &.activated {
        background-color: $color-grey;
    }

    > .icon {
        grid-area: icon;
        height: 2em;
        width: 2em;
        color: v-bind(currentIconColor);
    }

    > .title {
        grid-area: title;
        font-size: $font-size-large;
        margin-top: auto;
    }

    > .description {
        grid-area: description;
        font-size: $font-size-small;
        margin-bottom: auto;
    }
}
</style>