<template>
 <VModal :showModal="showModal" @closeModal="closeModal" v-bind="{ 'background-color': '#DCE4F2', 'max-height': '45rem', 'max-width': '70rem' }">
    <template v-slot:header v-if="selectedHistoryRow">
      {{ selectedHistoryRow.message }}
    </template>
      
    <template v-slot:body v-if="selectedHistoryRow">
      
      <router-link class="redirect-link" :to="selectedHistoryRow.entity" v-if="selectedHistoryRow.entity.includes('documents/edit')">
        Read more about this document
      </router-link>
      
      <div v-else-if="selectedHistoryRow.entity.includes('empty')">
        <template v-if="getEmptyEntityName === 'document'">
          This document does not exist anymore. <br>
        </template>
        <template>
          There are no more {{ getEmptyEntityName }}s
        </template>
      </div>
      
      <!-- If a product / provider / document has been updated -->
      <template v-if="multipleRowsUpdated === false">
        <div v-if="selectedHistoryRow.additional_info">{{ getHistoryProductNames[0] }}</div>

        <div class="c-table">
          <VTableSimple :columns="['Field', 'From', 'To']">
            <template v-slot:tbody>
              <tr
                  v-for="(values, field) in getHistoryStateInformation"
                  :key="field"
                >
                  <td>{{ field }}</td>
                  <td>{{ values[0] }}</td>
                  <td>{{ values[1] }}</td>
              </tr>
            </template>
          </VTableSimple>
        </div>
      </template>

      <!-- If products in a document have been updated-->
      <template v-else-if="multipleRowsUpdated === true">
        <template v-for="(product, productIndex) in computeProductRows">
          <div :key="product.id">{{ getHistoryProductNames[productIndex] }}</div>
          
          <div :key="product.id + productIndex" class="c-table">
            <VTableSimple  :columns="['Field', 'From', 'To']">
              <template v-slot:tbody>
                <tr
                  v-for="(field) in Object.keys(getRidOfObjProp(product, 'id'))"
                  :key="product.id + field"
                >
                  <td>{{ field }}</td>
                  <td>{{ product[field][0] }}</td>
                  <td>{{ product[field][1] }}</td>
                </tr>
              </template>
            </VTableSimple>
        </div>
        </template>
      </template>

      <!-- If multiple products (not in a document) / providers have been inserted -->
      <!-- or (at list for now) if a product / document / provider has been deleted -->
      <template v-else>
        <div class="c-table" v-if="displayDeletedOrAdded">
          <VTableSimple :columns="Object.keys(getRidOfObjProp((displayDeletedOrAdded[0] || displayDeletedOrAdded), 'id'))">
            <template v-slot:tbody>
              <tr v-for="item in displayDeletedOrAdded" :key="item.id">
                <template v-for="k in Object.keys(item)">
                  <!-- 'Not Specified' - in case a product doesn't have an expiration date -->
                  <td v-if="k !== 'id'" :key="item.id + item[k]">{{ item[k] ? item[k] : item[k] === 0 ? item[k] : 'Not specified' }}</td>
                </template>
              </tr>
            </template>
          </VTableSimple>
        </div>
      </template>

      <div align="right">
        {{ formatDate(selectedHistoryRow.inserted_date) }}
      </div>
    </template>
  </VModal>
</template>

<script>
import VModal from '../VModal';
import VTableSimple from '../VTableSimple';

import uuidv1 from 'uuid/v1'

import modalMixin from '../../mixins/modalMixin';

import { separateValues, formatDate, getRidOfObjProp } from '../../utils/index';

import historySharedData from '../../observables/history';

export default {
    name: 'history-modal',

    components: { VModal, VTableSimple },

    data: () => ({
      multipleRowsUpdated: null,
      displayDeletedOrAdded: null
    }),

    mixins: [modalMixin],

    watch: {
        showModal (shouldDisplayModal) {
            shouldDisplayModal
                ?
                window.addEventListener("keyup", this.modalHandler) :
                window.removeEventListener("keyup", this.modalHandler)
        },

        selectedHistoryRow (row) {
          if (row !== null) {
            if (row.current_state !== null) {
              const hasLineBreaks = (row.current_state).includes('\n');
              const isArray = /^\[(.*)\]$/.test(row.current_state)

              console.log(hasLineBreaks)
              console.log(isArray)
              this.multipleRowsUpdated = hasLineBreaks && !isArray ? true : !hasLineBreaks && !isArray ? false : null;
              
              if (isArray) {
                this.displayDeletedOrAdded = JSON.parse(row.current_state)
              }
            } else if (row.prev_state !== null) {
              console.log('deleted')
              this.multipleRowsUpdated = null;
              this.displayDeletedOrAdded = [JSON.parse(row.prev_state)]
              this.displayDeletedOrAdded[0]['id'] = uuidv1();
            }
          }
        }
    },

    computed: {
        // Decided to name this way because the `modalMixin` already contains a property `showDetails`
        showModal () { return historySharedData.showModal },

        getEmptyEntityName () {
          return this.selectedHistoryRow.entity.slice(0, this.selectedHistoryRow.entity.indexOf('/'))
        },

        selectedHistoryRow () { return historySharedData.selectedHistoryRow },

        computeProductRows () {
            const currentStateRows = this.selectedHistoryRow.current_state.split('\n');
            const prevValuesRows = this.selectedHistoryRow.prev_state.split('\n');

            return prevValuesRows.map((items, index) => {
                const row = {};
                const currentStateRow = currentStateRows[index].split('|');

                items.split('|').forEach((kvPair, kvPairIndex) => {
                const [key, value] = separateValues(kvPair, ':');

                // row[field] = [prevValue, currentValue]
                row[key] = [value, currentStateRow[kvPairIndex]]
                });

                row['id'] = uuidv1()

                return row;
            })
        },

        getHistoryProductNames () {
            return this.selectedHistoryRow.additional_info.split('|')
        },

        getHistoryStateInformation () {

            const { current_state: currentState, prev_state: prevState } = this.selectedHistoryRow;

            // result[field] = [prevValue, currentValue]
            const result = {};

            if (~prevState.indexOf('|')) {
                // Multiple fields have been updated
                const valuesArr = currentState.split('|');

                prevState.split('|').forEach((kvPair, index) => {
                const [key, value] = separateValues(kvPair, ':');

                result[key] = [value, valuesArr[index]];
                })

            } else {
                // Only one field has been updated
                const [key, value] = separateValues(prevState, ':');

                result[key] = [value, currentState];
            }

            return result
        },
    },

    methods: {

        formatDate (date) { return formatDate(date) },

        getRidOfObjProp (obj, prop) { return getRidOfObjProp(obj, prop) },

        closeModal () {
            historySharedData.showModal = false
            historySharedData.selectedHistoryRow = null
        },
    },
}
</script>

<style lang="scss">
    $main-blue: #394263;

    .c-table {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }

    .redirect-link {
    color: darken($color: $main-blue, $amount: 15%);
    font-style: italic;

    &:hover {
      font-weight: bold;
    }
  }
</style>
