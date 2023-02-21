<template>
    <button class="normal-button" :class="{ transparent, activated }">
        <fa v-if="icon != null" :icon="icon"></fa>
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
    withDefaults(defineProps<{
        transparent?: boolean;
        activated?: boolean;
        icon?: string;
    }>(), {
        transparent: false,
        activated: false
    });
</script>

<style lang="scss" scoped>
    .normal-button {
        display: inline-flex;
        color: $color-text;
        border: none;
        align-items: center;
        justify-content: center;
        border-radius: $border-radius;
        padding: $spacing-small $spacing-medium;
        gap: $spacing-small;
        border: 2px solid transparent;
    
        &.transparent {
            background-color: transparent;
        }
    
        &.activated {
            background-color: $color-grey;
        }
    
        > svg {
            height: 1.25em;
            width: 1.25em;
            color: $color-grey;
        }
    }
    </style>