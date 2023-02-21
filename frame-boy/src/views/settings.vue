<template>
<div class="settings">
    <h1>Settings</h1>
    <div class="items">
        <large-button icon="gear" title="General" to="/settings/general">
            General settings of the Frame Boy.
        </large-button>
        <large-button icon="table-columns" title="Dashboard" to="/settings/dashboard">
            Dashboard widgets, their locations and sizes.
        </large-button>
        <large-button icon="shield-halved" title="Security">
            Select the security level such as locking the settings with a key code.
        </large-button>
        <large-button icon="bolt" title="Energy">
            Tweak the power consumption to prolong its life and your electricity bill.
        </large-button>
        <large-button icon="book-medical" title="Logs">
            Read all the fancy and useful logs from the Frame Boy and its components.
        </large-button>
    </div>
</div>
</template>

<script setup lang="ts">
import LargeButton from '@/components/common/large-button.vue';

</script>

<style lang="scss" scoped>
.settings {
    text-align: center;

    > .items {
        display: grid;
        grid-template-columns: repeat(auto-fit, 20rem);
        justify-content: center;
        
        margin: $spacing-large;
        gap: $spacing-medium;

       > .large-button {
            width: 100%;
        }
    }
}
</style>