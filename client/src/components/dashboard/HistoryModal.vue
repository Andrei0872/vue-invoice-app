<template>
 <VModal :showModal="showModal" @closeModal="closeModal" v-bind="{ 'background-color': '#DCE4F2', 'max-height': '45rem', 'max-width': '70rem' }">
    <template v-slot:header v-if="selectedHistoryRow">
      {{ selectedHistoryRow.message }}
    </template>
      
    <template v-slot:body v-if="selectedHistoryRow">
      
      <template v-if="selectedHistoryRow.entity.includes('documents/edit')">
        <router-link  
          class="redirect-link" 
          :to="selectedHistoryRow.entity"
          v-if="documentIds !== null && documentIds.get(+selectedHistoryRow.entity.slice(selectedHistoryRow.entity.lastIndexOf('/') + 1)) === true"
        >
          Read more about this document
        </router-link>
        <p v-else>This document no longer exists</p>
      </template>
      
      <div v-else-if="selectedHistoryRow.entity.includes('empty')">
        <p v-if="getEmptyEntityName === 'document'">
          This document does not exist anymore. <br>
        </p>
        <p>
          There are no more {{ getEmptyEntityName }}s
        </p>
      </div>

      <!-- Show when a document has been deleted because its provider has been removed -->
      <template v-else-if="selectedHistoryRow.entity.includes('indirectProvider')">
        <p>Removed because the provider <b>{{ selectedHistoryRow.additional_info }}</b> has been deleted</p>
      </template>
      
      <!-- If a product / provider / document has been updated -->
      <template v-else-if="multipleRowsUpdated === false">
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

      <!-- If products have been added / removed from a document -->
      <template v-else-if="displayDeletedOrAddedProductsInDoc">
        <div>
          {{ selectedHistoryRow.action_type === 'insert' ? 'Added' : 'Removed' }} {{ displayDeletedOrAddedProductsInDoc.length === 1 ? 'product' : 'products' }}
        </div>

        <div class="c-table">
          <VTableSimple :columns="Object.keys(getRidOfObjProp(displayDeletedOrAddedProductsInDoc[0], 'id'))">
            <template v-slot:tbody>
              <tr
                  v-for="item in displayDeletedOrAddedProductsInDoc"
                  :key="item.id"
                >
                  <template v-for="(k, kIndex) in Object.keys(item)">
                    <td
                      :key="item.id + item[k] + kIndex"
                      v-if="k !== 'id'"
                    >
                      {{ typeof item[k] === 'object' && k === 'product_name' ? item[k]['name'] : item[k] }}
                    </td>
                  </template>
              </tr>
            </template>
          </VTableSimple>
        </div>
      </template>

      <!-- If multiple products (not in a document) / providers have been inserted -->
      <!-- or (at least for now) if a product / document / provider has been deleted / added-->
      <template v-else>
        <div class="c-table" v-if="displayDeletedOrAdded">
          <VTableSimple :columns="Object.keys(getRidOfObjProp((displayDeletedOrAdded[0] || displayDeletedOrAdded), 'id'))">
            <template v-slot:tbody>
              <!-- Decided to use the index for key's computation in order to reduce -->
              <!-- the possibility of key duplication -->
              <tr v-for="(item, rowIndex) in displayDeletedOrAdded" :key="item.id + rowIndex">
                <template v-for="(k, kIndex) in Object.keys(item)">
                  <!-- 'Not Specified' - in case a product doesn't have an expiration date -->
                  <td v-if="k !== 'id'" :key="item.id + item[k] + kIndex + rowIndex">{{ item[k] ? k === 'product_name' ? item[k]['name'] : item[k] : item[k] === 0 ? item[k] : 'Not specified' }}</td>
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

import { mapState } from 'vuex'

import uuidv1 from 'uuid/v1'

import modalMixin from '../../mixins/modalMixin';

import { separateValues, formatDate, getRidOfObjProp } from '../../utils/index';

import historySharedData from '../../observables/history';

export default {
    name: 'history-modal',

    components: { VModal, VTableSimple },

    data: () => ({
      multipleRowsUpdated: null,
      displayDeletedOrAdded: null,
      // Couldn't think of a better name...
      displayDeletedOrAddedProductsInDoc: null,
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
              // Products / Providers have been added
              const hasLineBreaks = (row.current_state).includes('\n');
              const isArray = /^\[(.*)\]$/.test(row.current_state)

              console.log(hasLineBreaks)
              console.log(isArray)
              this.multipleRowsUpdated = hasLineBreaks && !isArray ? true : !hasLineBreaks && !isArray ? false : null;
              
              if (isArray) {
                this.displayDeletedOrAdded = JSON.parse(row.current_state)
              }
            } else if (row.prev_state !== null) {
              // Products / Providers have been deleted
              this.multipleRowsUpdated = null;
              this.displayDeletedOrAdded = [JSON.parse(row.prev_state)]
              this.displayDeletedOrAdded[0]['id'] = uuidv1();
            } else if (row.additional_info !== null) {
              // Products have been added / deleted from a DOCUMENT
              this.displayDeletedOrAddedProductsInDoc = JSON.parse(row.additional_info);
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

        ...mapState('dashboard', ['documentIds'])
    },

    methods: {

        formatDate (date) { return formatDate(date) },

        getRidOfObjProp (obj, prop) { return getRidOfObjProp(obj, prop) },

        closeModal () {
            historySharedData.showModal = false
            historySharedData.selectedHistoryRow = null
            this.multipleRowsUpdated = null;
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
