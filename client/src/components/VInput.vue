<template>
    <input 
        type="text"
        :value="theValue"
        :style="{ 'width': widthValue }"
        :placeholder="placeholder" 
        @input="sendContent($event)"
    >
</template>

<script>
export default {
    props: {
        placeholder: String,
        value: {
            type: [String, Number],
            default: ''
        }
    },
    
    data () {
        return {
            widthValue: null,
            theValue: this.value
        }
    },

    watch: {
        theValue (newVal) {
            this.widthValue = `${((newVal.trim().length || this.placeholder.length) + 1) * 8}px`
        }
    },

    methods: {

        sendContent (ev) {
            this.theValue = ev.target.value;

            this.$emit(
                'input', this.theValue !== '' 
                    ? this.$el.getBoundingClientRect().width + 1
                    : false
            )
        }, 
    },

    mounted () {
        this.widthValue = ((`${this.theValue}`.trim().length || this.placeholder.length) + 1) * 8 + 'px'; 
    },

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