<template>
    <div class="table-responsive">
        {{ items }}
        <!-- {{ fields }} -->
        <table class="table">
            <thead>
                <tr>
                    <th
                        v-for="field in fields"
                        :key="field"
                    >
                        {{ field }}
                    </th>
                </tr>
            </thead>
            <tbody ref="tbody" :class="{ 'h-has-hover': !willCreate }">
                <tr
                    v-for="row in itemsCopy"
                    :key="row.id"
                >
                    <td
                        v-on="{ click: !willCreate ? $parent.showInfo.bind(null, row.id) : () => {} }"
                        v-for="field in fields"
                        :key="field + row.id"
                        :contenteditable="willCreate"
                    >
                        {{ row[field] }}
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- {{ getSanitizedData() }} -->

        {{ test }}
        <VTd @update="testUpdate(0, testField, $event)" :contentEditable="true">
            test
        </VTd>
        <br>
        <VTd @update="testUpdate(1, testField, $event)" :contentEditable="true">
            test3
        </VTd>
        {{ arr }}
    </div>    
</template>

<script>
import VTd from '../components/VTd';

export default {
    name: 'table-comp',

    props: {
        items: Array,
        fields: Array,
        willCreate: {
            type: Boolean,
            default: false
        }
    },

    components: {
        VTd,
    },

    data: () => ({
        itemsCopy: [],
        test: {},
        arr: [],
        testField: 'name'
    }),

    watch: {
        // If the value is changed from true to false
        // it means the `Create` btn has been pressed
        willCreate (newVal) {
            if (!newVal) {
                // TODO: sanitize data first !!!
                this.$root.$emit('createItems', [1, 2, 3])
                this.itemsCopy = [[]]
                this.$parent.toggleState();
            }
        },

        // Update when new rows are added
        items (newVal) {
            this.createCopy();
        },

        // arr (val) {
        //     console.log('new', val)
        // } 
    },

    computed: {
        fieldsAsObject () {
            return { ...this.fields }
        }
    },

    methods: {
        testUpdate (index, field, val) {
            console.log('val', val)
            console.log('field', field)

            // this.arr[0] = val
            this.$set(this.arr, index, val);
        },

        sendData () {
            console.log('sending data')

        },

        createCopy () {
            this.itemsCopy = JSON.parse(JSON.stringify(this.items))
        },

        async getSanitizedData () {
            await this.$nextTick();

            const { tbody } = this.$refs;
            const result = {};
            
            [...tbody.children].forEach(tr => {

            })
            console.log(tbody.children)
            console.log(this.fieldsAsObject)
        }
    },

    created () {
        this.createCopy();
        this.fields.forEach(field => {
            this.test[field] = [];
        })
    }
}

</script>

<style lang="scss"scoped>
.table {
    border-collapse: collapse;
    background-color: #FFF;
    border-radius: 13px;
    width: 100%;

    td, th {
        padding: 15px;
        text-align: center;
    }

    thead {
        background-color: darken($color: #394263, $amount: 5%);
        color: #fff;
        font-weight: 300;

        tr {            

            th:not(:last-child) {
                border-right: 1px solid #ccc;
            }

            th:first-child {
                border-top-left-radius: 13px;
            }

            th:last-child {
                border-top-right-radius: 13px;
            }
        }
    }

    tbody {
        tr > td:not(:last-child) {
            border-right: 1px solid #ccc;
        }

        tr:last-child {

            td:first-child {
                border-bottom-left-radius: 13px;
            }

            td:last-child {
                border-bottom-right-radius: 13px;
            }
        }

        tr:not(:last-child) {
            border-bottom: 1px solid #ccc;
        }

        tr td {
            outline: 0;
            border: none;
        }
    }

}

.table-responsive {
    overflow-x: auto;
    padding: .9rem;
}

.h-has-hover {
    tr:hover {
        background-color: rgba($color: #394263, $alpha: .5);
        cursor: pointer;
    }
}

</style>