<template>
    <div class="l-sidebar">
        <div class="l-sidebar__avatar">
            <div class="l-sidebar__avatar--image"></div>
            <!-- TODO: on collaps: show initials-->
            <div class="l-sidebar__avatar--name">Gatej Andrei</div>
        </div>
        <div class="l-sidebar__links">
            <ul class="c-list">
                <li
                    class="c-list__wrapper"
                    v-for="link in links"
                    :key="link.id"
                >
                    <span class="c-list__icon">
                        <font-awesome-icon :icon="link.icon" />
                    </span>
                    <span class="c-list__title">
                        {{ link.title }}
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'sidebar',
    data: () => ({
        links: [
            { id: 5, title: 'Dashboard', icon: 'coffee' },
            { id: 1, title: 'Products', icon: 'address-book' },
            { id: 2, title: 'Providers', icon: 'coffee' },
            { id: 3, title: 'Documents', icon: 'coffee' },
            { id: 4, title: 'Settings', icon: 'coffee' },
        ]
    }),
}
</script>

<style lang="scss" scoped>
    @import '@/styles/components/sidebar/main.scss';
</style>