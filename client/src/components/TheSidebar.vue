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
    @import '@/styles/variables.scss';
    @import '@/styles/mixins.scss';
    
    
.l-sidebar {
    width: 100%;
    height: 100%;
    background-color: $sidebar-color;
    display: flex;
    flex-direction: column;

    &__avatar {
        border: none;
        flex-basis: 12%;
        display: flex;
        align-items: center;
        min-height: 90px;
        background-color: rgba(255, 255, 255, .1);
        
        &--image {
            @include profile-avatar;
            width: 4.6rem;
            height: 4.6rem;
            margin: 0 15px;
            flex-shrink: 0;
        }

        &--name {
            font-size: 1.2rem;
            color: $link-color;
            word-break: break-word;
        }
    }

    &__links {
        flex-basis: 88%;
        height: 100%;
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
    }
}

.c-list {
    color: lighten($link-color, 30%);
    display: block;
    text-align: center;
    margin-top: -80%;
    list-style: none;

    @media only screen and (max-width: 1150px) {
        margin-top: -175%;
    }

    &__wrapper {
        &:not(:last-child) {
            margin-bottom: 1%;
        }

        font-size: 1.2rem;
        transition: transform .3s;
        padding: 10px 15px;
        position: relative;

        &:hover {
            cursor: pointer;
            background-color: darken($sidebar-color, 10%);
        } 
    }

    &__icon {
        font-size: .9rem;
        display: inline-block;
        position: absolute;
        left: 20%;
        bottom: .7rem;
        color: darken($link-color, 20%);
    }

    &__title {
        display: inline-block;
    }
}

    .active {
        background-color: darken($sidebar-color, 10%);
    }
</style>