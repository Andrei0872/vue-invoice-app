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
            <tbody :class="{ 'h-has-hover': !willCreate }">
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
    </div>    
</template>

<script>

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

    data: () => ({
        itemsCopy: []
    }),

    watch: {
        // If the value is changed from true to false
        // It meanse the `Create` btn has been pressed
        willCreate (newVal) {
            if (!newVal) {
                // this.$root.$emit('createItem', [1, 2, 3])
                this.itemsCopy = [[]]
                this.$parent.toggleState();
                console.log('send data')
            }
        },

        // Update when new rows are added
        items (newVal) {
            this.createCopy();
        }
    },

    methods: {
        sendData () {
            console.log('sending data')

        },

        createCopy () {
            this.itemsCopy = JSON.parse(JSON.stringify(this.items))
        }
    },

    created () {
        this.createCopy();
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