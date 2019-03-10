<template>
    <div class="table-responsive">
        <!-- {{ items }}
        <br>
        {{ newItems }} -->
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
            <tbody :class="{ 'h-has-hover': !willCreate }">
                <tr
                    v-for="(row, indexRow) in itemsCopy"
                    :key="row.id"
                >
                    <VTd
                        v-on="{ click: !willCreate ? $parent.showInfo.bind(null, row.id) : () => {} }"
                        v-for="field in fields"
                        :key="field + row.id"
                        :contentEditable="willCreate"
                        @update="updateContent(indexRow, field, $event)"
                    >
                        {{ row[field] }}
                    </VTd>
                </tr>
            </tbody>
        </table>
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

    components: { VTd },

    data: () => ({
        itemsCopy: [],
        newItems: {},
    }),

    watch: {
        // If the value is changed from true to false
        // it means the `Create` btn has been pressed
        willCreate (newVal) {
            if (!newVal) {
                this.$root.$emit('createItems', this.newItems)
                this.itemsCopy = [[]]
                this.$parent.toggleState();
            }
        },

        // Update when new rows are added
        items (newVal) {
            this.createCopy();
        },
    },

    methods: {
        updateContent (rowIndex, field, val) {
            // Get the field array and add the new item
            const arr = this.newItems[field];
            const updatedArr = this.$set(arr, rowIndex, val);
            
            // Get the entire object and set the new array
            const currentObj = this.newItems;
            this.$set(currentObj, `${field}`, arr);

            // Update the changes
            this.newItems = {... this.newItems, ...currentObj}
        },

        createCopy () {
            this.itemsCopy = JSON.parse(JSON.stringify(this.items))
        },
    },

    created () {
        this.createCopy();
        this.fields.forEach(field => {
            this.newItems[field] = [];
        });
        /* 
        --> this.newFields = {
            field1: [],
            field2: [],
            ...
        }
        */
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