<template>
<div class="application-footer" v-if="customMenu == null">
    <div class="space left-space">
        <router-link to="/settings">
            <normal-button icon="gear" transparent />
        </router-link>
    </div>
    <nav>
        <router-link to="/">
            <normal-button class="default" icon="home" transparent />
        </router-link>
    </nav>
    <div class="space right-space">
        <!-- Frame Boy &copy; {{ new Date().getFullYear() }} -->
    </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NormalButton from "@/components/common/normal-button.vue";

const customMenu = ref<any[]>();
</script>

<style lang="scss" scoped>
.application-footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: auto;
    gap: 1rem;
    margin: 0;
    padding-bottom: 0.25em;
    font-size: $font-size-normal;
    height: $footer-height;
    overflow: hidden;

    > .left-space {
        text-align: left;
    }

    > nav {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
        
        > a {
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