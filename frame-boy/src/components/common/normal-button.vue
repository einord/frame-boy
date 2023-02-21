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
        background-color: $color-button-background;
    
        &.transparent {
            background-color: transparent;

            > svg {
                color: $color-grey;
            }
        }
    
        &.activated {
            background-color: $color-text;
        }
    
        > svg {
            height: 1.25em;
            width: 1.25em;
            color: $color-text;
        }
    }
    </style>