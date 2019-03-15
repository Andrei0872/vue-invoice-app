<template>
    <div class="table-responsive">
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
            <tbody>
                <template v-for="row in items">
                    <!-- TODO: if row.id === selectedId -->
                    <div :key="row.id" class="icon">
                        <font-awesome-icon 
                            icon="minus-circle" 
                            class="minus-circle" 
                            @click="deleteRow(row.id)"    
                        />
                    </div>
                    <tr :key="row.id + 'row'">
                        <td v-for="field in fields" :key="field + 'td'">
                            <VInput 
                                :key="row.id + 'input'"
                                class="the-input"
                                :placeholder="field"
                                @blur.native="addFieldValue(row.id, field, $event)"
                            />
                            <!-- {{ row[field] || '' }} -->
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import VInput from './VInput';

export default {
    props: {
        fields: Array,
        items: Array
    },

    components: { VInput },

    data: () => ({
        inputValue: null
    }),

    methods: {
        addFieldValue (rowId, fieldName, ev) {
            this.$emit('addFieldValue', [rowId, fieldName, ev.target.value]);
        },

        deleteRow (rowId) {
            this.$emit('deleteRow', rowId);
        }
    },
}
</script>

<style lang="scss" scoped>

.table-responsive {
    overflow: auto;
    padding: 1.5rem;
    width: 80vw;
    // position: relative;
}

.table {
    border-collapse: collapse;
    background-color: #FFF;
    border-radius: 13px;
    width: 100%;
    // table-layout: fixed;

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
            padding: 15px 1px;
        }
    }
}

.icon {
    position: absolute;
    transform: translateY(60%) translateX(-120%);
    cursor: pointer;

    &.h-has-two-buttons {
        transform: translateY(10%) translateX(-120%);
        display: flex;
        flex-direction: column;

        svg:first-child {
            margin-bottom: 3px;
        }
    }

    svg {
        width: 20px;
        height: 20px;
        border-radius: 50%;

        &:hover {
            transform: scale(1.1);
        }

        &.minus-circle {
            color: tomato;
            background-color: #fff;
        }

        &.pencil-alt {
            color: rgb(51, 72, 99);
        }

        &.save-changes {
            color: #4caf50;
        }

        &.times {
            color: darken(tomato, 10%);
        }
    }
}


</style>
