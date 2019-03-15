<template>
    <input 
        type="text" 
        @focus="hidePlaceholder" 
        :value="theValue" 
        :placeholder="placeholder" 
        @input="sendContent($event)"
        @blur="updateContent"
    >
</template>

<script>
export default {
    props: {
        placeholder: String,
        value: [String, Number]
    },
    
    data () {
        return {
            theValue: this.value.toString().trim()
        }
    },

    methods: {

        hidePlaceholder () {
            // this.placeholder = '';
        },

        sendContent (ev) {
            this.theValue = ev.target.value;
            this.$emit(
                'input', this.theValue !== '' 
                    ? this.$el.getBoundingClientRect()
                    : false
            )
        },

        updateContent () {
            console.log(this.theValue)
            this.$emit('update', this.theValue);
        }
    }
}
</script>

<style lang="scss" scoped>
    $text-color: #303753;

    input {
        width: 100%;
        border: none;
        outline: none;
        text-align: center;
        font-size: .95rem;
        color: $text-color;

        &:hover {
            border: none;
            outline: none;      
        }
    }

    ::-webkit-input-placeholder {
        text-align: center;
    }

    :-moz-placeholder { /* Firefox 18- */
        text-align: center;  
    }

    ::-moz-placeholder {  /* Firefox 19+ */
        text-align: center;  
    }

    :-ms-input-placeholder {  
        text-align: center; 
    }
</style>