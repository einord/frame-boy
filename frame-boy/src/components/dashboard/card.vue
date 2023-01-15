<template>
<div class="card">
    <slot></slot>
</div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.card {
    background-color: transparent;
    border: 2px dashed hsla(100, 100%, 100%, 10%);
    transition:
        transform 200ms ease-in-out,
        box-shadow 200ms ease-in-out,
        background-color 200ms ease-in-out,
        grid-row 200ms ease-in-out,
        grid-column 200ms ease-in-out;

    &.dragging {
        background-color: hsla(100, 100%, 100%, 10%);
        transform: scale(1.1);
        box-shadow: 0.25rem 0.25rem 0.25rem 0 rgba(255, 255, 255, 0.05);
    }
}
</style>