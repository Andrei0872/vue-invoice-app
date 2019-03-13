<template>
    <td 
        v-on="$listeners" 
        :contenteditable="contentEditable" 
        @blur="updateState($event)"
        @focus="checkPlaceholder($event)"
    >
        <slot></slot>
    </td>
</template>

<script>
export default {
    props: {
        contentEditable: {
            type: Boolean,
            default: false
        },
        isPlaceholder: {
            type: Boolean,
            default: false
        }
    },
    
    // Avoided using the arrow fn in order to get access to `this.isPlaceholder`
    data () {
        return {
            isPlaceholderCopy: this.isPlaceholder
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
    },
}
</script>
