<template>
<div class="settings">
    <h1>Settings</h1>
    <div class="items">
        <large-button icon="gear" title="General" to="/settings/general">
            General settings of the application
        </large-button>
        <large-button icon="table-columns" title="Dashboard">
            Dashboard widgets, their locations and sizes
        </large-button>
        <large-button icon="shield-halved" title="Security">
            Select the security level of the application
        </large-button>
    </div>
</div>
</template>

<script setup lang="ts">
import LargeButton from '../components/common/large-button.vue';

</script>

<style lang="scss" scoped>
.settings {
    text-align: center;

    > .items {
        // display: flex;
        // justify-content: center;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(20rem, auto));
        justify-content: center;
        
        margin: $spacing-large;
        gap: $spacing-medium;

       > .large-button {
            width: 100%;
        }
    }
}
</style>