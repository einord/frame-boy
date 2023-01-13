<template>
<div class="dashboard">
    <div class="card test1" @mousemove.passive="onMouseMove">This a test card</div>
    <div class="card test2">I'm also a test card</div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const onMouseMove = (e: MouseEvent) => {
    if (e.buttons === 1) {
        if (e.target == null) { return; }
        const target = e.target as HTMLElement;

        const columnCount = Math.round(document.body.clientWidth / (100 + remToPixel()));
        const totalGap = columnCount * remToPixel();
        console.log(columnCount);
        
        // Set the target grid column to the nearest column to the mouse
        const startColumn = Math.round((e.clientX - (target.clientWidth / 2)) / 100);
        target.style.gridColumn = `${startColumn} / ${startColumn + 2}`;
    }
}

const remToPixel = () => {    
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
}
</script>

<style lang="scss" scoped>
.dashboard {
    // Dynamic grid depending on page size
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    position: relative;

    > .card {
        background-color: darkolivegreen;
    }

    > .test1 {
        grid-column: 4 / 6;
        grid-row: 3 / 5;
        background-color: darkslateblue;
    }
}
</style>