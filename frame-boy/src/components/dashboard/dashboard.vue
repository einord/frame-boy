<template>
<div ref="dashboardElement" class="dashboard" @mousemove.passive="onMouseMove" @touchmove="onMouseMove" @touchend="onMouseUp" @mouseup.passive="onMouseUp" @mouseleave.passive="onMouseUp">
    <card class="test1" :edit-mode="editMode" @touchstart="onMouseDown" @mousedown.passive="onMouseDown">This a test card</card>
    <card class="test2" :edit-mode="editMode" @touchstart="onMouseDown" @mousedown.passive="onMouseDown">
        <component :is="CurrentTime" :edit-mode="editMode" />
    </card>
</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Card from './card.vue';
import CurrentTime from '@/components/extensions/current-time';

const props = withDefaults(defineProps<{
    editMode?: boolean;
}>(), {
    editMode: false
});

const minimumColumnWidth = 100;
const minimumColumnWidthStyle = computed(() => `${minimumColumnWidth}px`);
const gridGapPixelWidth = parseFloat(getComputedStyle(document.documentElement).fontSize); // 1rem
const gridGapPixelWidthStyle = '1rem';
const dashboardElement = ref<HTMLElement>();
const currentDraggingCard = ref<HTMLElement>();
const currentDraggingCardMousePositionDiff = ref<{ x: number, y: number }>();

const onMouseDown = (e: MouseEvent | TouchEvent) => {
    if (props.editMode === false) { return; }

    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;
    const target = e.target as HTMLElement;

    if (target == null || (touchEvent.touches != null && (touchEvent?.touches?.length ?? 0) < 1)) {
        currentDraggingCard.value = undefined;
        return;
    }

    const clientX = touchEvent?.touches == null ? mouseEvent.clientX : touchEvent.touches[0].clientX;
    const clientY = touchEvent?.touches == null ? mouseEvent.clientY : touchEvent.touches[0].clientY;

    currentDraggingCard.value = target;
    currentDraggingCardMousePositionDiff.value = {
        x: clientX - target.offsetLeft,
        y: clientY - target.offsetTop
    };
    target.classList.add('dragging');
}

const onMouseMove = (e: MouseEvent | TouchEvent) => {
    if (props.editMode === false) { return; }

    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;

    if (mouseEvent?.buttons ?? 1 === 1) {
        if (currentDraggingCard.value == null
            || dashboardElement.value == null
            || currentDraggingCardMousePositionDiff.value == null
        ) { return; }
        
        const target = currentDraggingCard.value;
        const clientX = touchEvent?.touches == null ? mouseEvent.clientX : touchEvent.touches[0].clientX;
        const clientY = touchEvent?.touches == null ? mouseEvent.clientY : touchEvent.touches[0].clientY;

        const cardColumnSize = 2; // TODO: Get this from the card itself
        const cardRowSize = 2; // TODO: Get this from the card itself

        // Calculate the center of the card relative to the mouse position
        const centerPositionX = clientX - currentDraggingCardMousePositionDiff.value.x;
        const centerPositionY = clientY - currentDraggingCardMousePositionDiff.value.y;

        // Set the calculated cell position css
        target.style.gridColumn = calculateCellPosition(centerPositionX, dashboardElement.value.clientWidth, cardColumnSize);
        target.style.gridRow = calculateCellPosition(centerPositionY, dashboardElement.value.clientHeight, cardRowSize);
    }
}

const onMouseUp = (e: MouseEvent | TouchEvent) => {
    if (props.editMode === false) { return; }

    if (currentDraggingCard.value != null) {
        currentDraggingCard.value.classList.remove('dragging');
    }
    currentDraggingCard.value = undefined;
}

const calculateCellPosition = (centerPosition: number, parentSize: number, cellSize: number) => {
    // Calculate the number of columns on document.body.clientWidth (with tableGapPixelWidth gap in between)
    const cellCount = Math.floor((parentSize + gridGapPixelWidth) / (minimumColumnWidth + gridGapPixelWidth));

    // Calculate the nearest column to the center of the card
    let startColumn = Math.round((centerPosition / (parentSize / cellCount)) + 1);
    startColumn = Math.min(cellCount - cellSize + 1, startColumn);
    startColumn = Math.max(1, startColumn);

    // Return the value as css
    return `${startColumn} / ${startColumn + cellSize}`;
}

const loadSettingsTest = async() => {
    // if (await window.settings.has('test.name')) {
    //     const name = await window.settings.get('test.name');
    //     console.log(`Settings loaded: ${name}`);
    // } else {
    //     await window.settings.set('test.name', 'This is a test');
    //     console.log('Settings saved');
    // }
}

onMounted(async() => {
    await loadSettingsTest();
});    
</script>

<style lang="scss" scoped>
.dashboard {
    // Dynamic grid depending on page size
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(v-bind(minimumColumnWidthStyle), 1fr));
    grid-template-rows: repeat(auto-fill, minmax(100px, 1fr));
    gap: v-bind(gridGapPixelWidthStyle);
    position: relative;
    height: 100%;
    width: 100%;
}
</style>