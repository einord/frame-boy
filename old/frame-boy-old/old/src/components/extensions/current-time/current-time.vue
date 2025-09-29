<template>
<div v-if="editMode" class="current-time">
    EDIT THE CURRENT TIME
</div>
<div v-else class="current-time">
    I'm not in edit mode
</div>
</template>

<script setup lang="ts">
 withDefaults(defineProps<{
    editMode?: boolean;
}>(), {
    editMode: false
});
</script>

<style lang="scss" scoped>
.current-time {
}
</style>