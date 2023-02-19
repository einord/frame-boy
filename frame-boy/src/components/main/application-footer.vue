<template>
<div class="application-footer">
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
import NormalButton from "@/components/common/normal-button.vue";

</script>

<style lang="scss" scoped>
.application-footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: auto;
    gap: 1rem;
    margin: 0 $spacing-small;
    font-size: $font-size-normal;

    > .left-space {
        text-align: left;
    }

    > nav {
        display: flex;
        flex-direction: row;
        gap: 0.5em;

        > a {
        //     color: $text-color;
        //     text-decoration: none;
        //     transition: color 0.2s ease-in-out;
        //     border-radius: $border-radius;
        //     padding: 0.25em 0.5em;

        //     &:hover {
        //         color: $text-color-hover;
        //         background-color: $hover-background;
        //     }
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