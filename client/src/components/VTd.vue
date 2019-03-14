<template>
    <td 
        v-on="$listeners" 
        :contenteditable="contentEditable" 
        @blur="updateState($event)"
        @focus="checkPlaceholder($event)"
    >
        <slot></slot>
        <VList 
            v-if="showProducts" 
            @ready="getCoords"
            :style="listStyles"
        >

        </VList>

    </td>
</template>

<script>
import VList from './VList';

export default {
    props: {
        contentEditable: {
            type: Boolean,
            default: false
        },
        isPlaceholder: {
            type: Boolean,
            default: false
        },
        showProducts: {
            type: Boolean,
            default: false
        }
    },
    
    components: { VList },

    // Avoided using the arrow fn in order to get access to `this.isPlaceholder`
    data () {
        return {
            isPlaceholderCopy: this.isPlaceholder,
            listStyles: {}
        }
    },

    methods: {
        updateState (ev) {
            const content = ev.target.textContent.trim();

            this.$emit('update', content);
        },

        checkPlaceholder (ev) {

            // setTimeout() - make the placeholder disappear and focus the current td
            this.isPlaceholderCopy 
                && (
                    setTimeout(() => {ev.target.textContent = ''}, 0), this.isPlaceholderCopy = false
                );
        },

        getCoords (list_coords) {
            const { left: td_left, x: td_x, width: td_width } = this.$el.getBoundingClientRect();
            const { left: list_left, x: list_x } = list_coords;

            this.listStyles = {
                'width': `${td_width}px`,
                'transform': `translateX(-${Math.abs(td_x - list_x)}px) translateY(${Math.abs(td_left - list_left)}px)`
            }
        }
    },
}
</script>
