<template>
    <div class="l-sidebar">
        <div class="l-sidebar__avatar">
            <div class="l-sidebar__avatar--image"></div>
            <!-- TODO: on collapse: show initials-->
            <div class="l-sidebar__avatar--name">Gatej Andrei</div>
        </div>
        <div class="l-sidebar__links">
            <ul class="c-list">
                <router-link
                    tag="li"
                    :to="link.route"
                    exact
                    :class="{'c-list__wrapper': true, 'active': isActive(link.route)}"
                    v-for="link in links"
                    :key="link.id"
                >
                    <span class="c-list__icon">
                        <font-awesome-icon :icon="link.icon" />
                    </span>
                    <span class="c-list__title">
                        {{ link.title }}
                    </span>
                </router-link>
            </ul>
        </div>
    </div>
</template>

<script>
import links from '../sidebarLinks';

export default {
    name: 'sidebar',
    data: () => ({
        links
    }),

    methods: {
        isActive (input) {
            return this.$route.matched.some(({ path }) => path.includes(input)) 
                && input !== '/'
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/styles/components/sidebar/main.scss';


    .active {
        background-color: darken($sidebar-color, 10%);
    }
</style>