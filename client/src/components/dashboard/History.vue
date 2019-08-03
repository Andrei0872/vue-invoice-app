<template>
    <div class="c-history">
          <div class="c-card__title">
            <div 
              :class="{'c-card__arrow': 1, 'disabled': historyPageIndex === 0}" 
              @click="historyPageIndex - 1 >= 0 ? historyPageIndex-- : null">
              <font-awesome-icon icon="arrow-left" />
            </div>
            
            <div>History</div>
            
            <div 
              :class="{'c-card__arrow': 1, 'disabled': historyPageIndex + 1 === historyPages || historyPages === 0}" 
              @click="historyPageIndex + 1 < historyPages ? historyPageIndex++ : null">
                <font-awesome-icon icon="arrow-right" />
            </div>
          </div>
          
          <div :class="{'c-card__content': true, 'vertical-line': historyData.length !== 0}">
            <template v-if="historyData.length">
              <div 
                class="c-row"
                v-for="item in historyDataShown"
                :key="item.id"
                @click="historySharedData.selectedHistoryRow = item; historySharedData.showModal = true"
              >
                <div class="c-row__title">{{ item.entity.includes('/') ? item.entity.slice(0, item.entity.indexOf('/')) : item.entity }}</div>
                <div :class="['c-row__icon', `c-row__icon--${item.action_type}`]"><font-awesome-icon :icon="getHistoryIcon(item.action_type)" /></div>
                <div class="c-row__content">
                  <div class="c-row__message">{{ item.message }} </div>
                  <div class="c-row__date">{{ formatDate(item.inserted_date) }}</div>
                </div>
              </div>
            </template>

            <template v-else-if="!historyDataShown.length && componentLoaded">
              <div class="h-centered">
                <p>No history</p>
              </div>
            </template>
          </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { formatDate } from '../../utils/';

import historySharedData from '../../observables/history';

export default {

    data: () => ({
        historyItemsPerPage: 11,
        historyPageIndex: 0,
        // In order to access it more easily through the template
        historySharedData,
    }),

    props: {
        componentLoaded: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        ...mapState('dashboard', { historyData: 'history' }),


        historyPages () {
            return Math.ceil(this.historyData.length / this.historyItemsPerPage)
        },

        historyDataShown () {
            const currentPage = this.historyPageIndex * this.historyPages;
            return this.historyData.slice(currentPage, currentPage + this.historyItemsPerPage);
        },
    },

    methods: {
        formatDate (date) { return formatDate(date) },

        getHistoryIcon (actionType) {
            return { insert: 'plus', delete: 'minus', update: 'pencil-alt' }[actionType]
        },
    },

    inheritAttrs: true,

    mounted () {
        console.log(this)
    },
}
</script>

<style lang="scss">

    $row-title-length: 8rem;
    $main-blue: #394263;

    %icon-dark-bg {
        background-color: darken($color: $main-blue, $amount: 20%);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: #DADAE3;
    }


    .c-history {
        // Instead of prefixing everything with .c-card__<section>
        .c-card {

            &__title {
                max-height: 2.3rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            &__arrow {
                width: 2.2rem;
                height: 2.2rem;
                @extend %icon-dark-bg;

                &.disabled {
                cursor: not-allowed;
                opacity: .4;
                }
            }

            &__content {
                position: relative;

                &.vertical-line::before {
                position: absolute;
                content: "";
                width: 1px;
                background-color: darken(#f3f3f3, 10%);
                left: $row-title-length;
                top: 0;
                bottom: 0;
                }
            }
        }
    }

    .c-row {
        display: flex;
        width: 100%;
        position: relative;
        margin-top: 1rem;
        height: 2.3rem;

        &:hover {   
            background-color: rgba($color: $main-blue, $alpha: .3);
            cursor: pointer;
        }

        &:first-of-type {
            margin-top: .6rem;
        }

        &__title {
            padding-left: 1rem;
            padding-top: 10px;
            flex-basis: $row-title-length;
            max-height: 1.9rem;
        }

        &__icon {
            position: absolute;
            left: $row-title-length;
            transform: translateX(-50%);
            width: 2.2rem;
            height: 2.2rem;
            @extend %icon-dark-bg;
            background-color: $main-blue;
            color: #fff;
            cursor: default;

            &--insert {
                background-color: green;
            }
        
            &--delete {
                background-color: red;
            }

            &--update {
                background-color: orange;
            }
        }

        &__content {
            margin-left: 2rem;
            padding-top: 10px;
            width: calc(100% - #{$row-title-length + 2rem});
            display: flex;
            justify-content: space-between;
        }

        &__date {
            margin-right: .7rem;
            font-weight: bold;
            color: $main-blue;
        }
    }
</style>
