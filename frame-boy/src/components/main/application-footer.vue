<template>
<div class="application-footer">
    <div class="space left-space"></div>
    <nav>
        <router-link to="/settings">Settings</router-link>
        <router-link to="/">Home</router-link>
    </nav>
    <div class="space right-space">Frame Boy @ {{ new Date().getFullYear() }}</div>
</div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.application-footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: auto;
    gap: 1rem;
    margin: 0 0.5rem;
    font-size: $font-size-small;

    > .left-space {
        text-align: left;
    }

    > nav {
        display: flex;
        flex-direction: row;
        gap: 0.5em;

        > a {
            color: $text-color;
            text-decoration: none;
            transition: color 0.2s ease-in-out;
            border-radius: $border-radius;
            padding: 0.25em 0.5em;

            &:hover {
                color: $text-color-hover;
                background-color: $hover-background;
            }
        }
    }

    > .right-space {
        text-align: right;
    }
}
</style>