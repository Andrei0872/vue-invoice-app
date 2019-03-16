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
            <tbody :class="{ 'h-has-hover': !isUpdating }">
                <template v-for="row in items">
                    <div :key="row.id" class="icon h-has-two-buttons">
                        <template v-if="!isUpdating || isUpdating && selectedRowId !== row.id">
                            <font-awesome-icon 
                                icon="pencil-alt" 
                                class="pencil-alt" 
                                @click="updateRow(row)"
                            />
                            <font-awesome-icon 
                                icon="minus-circle" 
                                class="minus-circle" 
                                @click="deleteRow(row.id)"    
                            />
                        </template>
                        <template v-else-if="isUpdating && selectedRowId === row.id">
                            <font-awesome-icon 
                                icon="times" 
                                class="times"
                                @click="cancelChanges(row.id)"
                            />
                            <font-awesome-icon 
                                icon="check" 
                                class="check" 
                                @click="confirmChanges(row)"
                            />
                        </template>
                    </div>
                    <tr 
                        :key="row.id + 'row'"
                        :class="isUpdating && selectedRowId === row.id ? 'selected' : isUpdating ? 'blurred' : null"
                    >
                        <td v-for="field in fields" :key="field + 'td'">
                            <VInput 
                                :key="row[field]"
                                class="the-input"
                                :placeholder="field"
                                :value="row[field] || row[field] === 0 ? row[field] : ''"
                                @focus.native="handleFocus(row.id, $event)"
                                @blur.native="addFieldValue(field, $event)"
                            />
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import VInput from '../components/VInput';


export default {
    props: {
        fields: Array,
        items: Array
    },

    components: { VInput },

    data () {
        return {
            isUpdating: false,
            selectedRowId: null,
            selectedRow: null,
        }
    },

    computed: {
        itemsFromProps () {
            return this.items
        }
    },

    methods: {
        handleFocus (rowId, ev) {
            (!this.isUpdating || this.isUpdating && this.selectedRowId !== rowId) && ev.target.blur();
        },

        updateRow (row) {
            this.isUpdating = true;
            this.selectedRowId = row.id;
            this.selectedRow = { ...row };
        },

        resetData (rowId) {
            this.isUpdating = false;
            this.selectedRowId = this.selectedRow = null;
        },

        compareChanges (rowBeforeChanges, rowAfterChange) {

            return Object.entries(rowAfterChange)
                .reduce((changes, [key, value]) => {
                    return rowBeforeChanges[key] !== value 
                        ? (changes[key] = value, changes) 
                        : changes

                }, {})
        },

        // TODO: add this to utils
        isObjectEmpty (obj) {
            return Object.keys(obj).length === 0
        },        

        confirmChanges (row) {
            const changes = this.compareChanges(row, this.selectedRow);
            
            !(this.isObjectEmpty(changes)) && this.$emit('update', [row.id, changes])

            this.resetData();
        },

        addFieldValue (fieldName, ev) {
            if (!this.selectedRowId)
                return;
            
            this.selectedRow[fieldName] = ev.target.value;
        },
    },
}
</script>

<style lang="scss" scoped>

.selected {
    // & .the-input {
    //     font-size: 1.02em;
    // }
}

.blurred {
    cursor: default;
    filter: blur(2px);
    user-select: none;
    background-color: lighten($color: #394263, $amount: 50%);

    & .the-input {
        background-color: lighten($color: #394263, $amount: 50%);
        cursor: default;
    }
}

.placeholder {
    color: #ccc;
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

        &.check {
            color: #4caf50;
        }

        &.times {
            color: darken(tomato, 10%);
        }
    }
}

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
            padding: 15px 1px;
        }
    }

}

.table-responsive {
    overflow: auto;
    padding: 1.5rem;
    width: 80vw;
}

.h-has-hover {
    tr:hover {
        background-color: rgba($color: #394263, $alpha: .5);
        cursor: pointer;

        input {
            background: transparent;
            cursor: pointer;
        }
    }
}

</style>
