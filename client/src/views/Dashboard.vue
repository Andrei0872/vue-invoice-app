<template>
  <div class="container">
    <div class="c-overview">
      <VCard 
        :card-info="{ icon: 'file', title: 'products', value: 123 }"
      />
      <VCard 
        :card-info="{ icon: 'file', title: 'products', value: 123 }"
      />
      <VCard 
        :card-info="{ icon: 'clipboard-list', title: 'products', value: 123 }"
      />
      <VCard 
        :card-info="{ icon: 'file', title: 'products', value: 123 }"
      />
    </div>
    <div class="main-cards">
      <div>
        <div class="c-card c-history">
          <div class="c-card__title">
            <div class="c-card__arrow"><font-awesome-icon icon="arrow-left" /></div>
            <div>History</div>
            <div class="c-card__arrow"><font-awesome-icon icon="arrow-right" /></div>
          </div>
          <div class="c-card__content">
            <div class="c-row">
              <div class="c-row__title">titlu</div>
              <div class="c-row__icon"><font-awesome-icon icon="industry" /></div>
              <div class="c-row__content">Lorem <!-- ipsum dolor sit amet, consectetur adipisicing elit. Itaque fuga, aperiam non saepe, et vel atque cumque voluptatum dignissimos odit quae fugiat ipsam id sapiente doloremque minus temporibus quibusdam ad. --></div>
            </div>
            <div class="c-row">
              <div class="c-row__title">titlu</div>
              <div class="c-row__icon"><font-awesome-icon icon="industry" /></div>
              <div class="c-row__content">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore, distinctio.</div>
            </div>
            <div class="c-row">
              <div class="c-row__title">titlu</div>
              <div class="c-row__icon"><font-awesome-icon icon="industry" /></div>
              <div class="c-row__content">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore, distinctio.</div>
            </div>
            <div class="c-row">
              <div class="c-row__title">titlu</div>
              <div class="c-row__icon"><font-awesome-icon icon="industry" /></div>
              <div class="c-row__content">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore, distinctio.</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="c-card c-card--small-half c-vat">
          <div class="c-card__title">VAT</div>
          <div class="c-card__content">
            <div class="c-vat__item">
              <div class="c-vat__item--title">non-food VAT</div>
              <div class="c-vat__item--content">
                <input class="c-vat__input" type="text" placeholder="non-food VAT">
                <button class="c-vat__button">OK</button>
              </div>
              <div class="c-vat__current">Current: </div>
            </div>
            <div class="c-vat__item">
              <div class="c-vat__item--title">food VAT</div>
                <div class="c-vat__item--content">
                  <input class="c-vat__input" type="text" placeholder="food VAT">
                  <button class="c-vat__button">OK</button>
                </div>
              <div class="c-vat__current">Current: </div>
            </div>
          </div>
        </div>
        <div class="c-card c-card--big-half c-document">
          <div class="c-card__title">Documents</div>
          <div class="c-card__content">content</div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import VCard from '../components/VCard';

export default {
  name: 'home',

  components: { VCard },

  data: () => ({
    icons: ['cart-plus', 'industry', 'file', 'clipboard-list'],
  })
}
</script>


<style lang="scss" scoped>
  $row-title-length: 15rem;
  $main-blue: #394263;
  $main-blue-border: rgba($color: $main-blue, $alpha: .4);

  %title-style {
    color: #fff;
    background-color: lighten($color: $main-blue, $amount: 8%);
  }

  .container {
    width: 100%;
    height: 100%;
    padding: 2rem;
  }

  .c-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(246px, 1fr));
    grid-gap: 30px;
    grid-auto-rows: 94px;
  }

  .main-cards {
    padding-right: 2rem;
    margin-top: 2.5rem;
    width: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-gap: 30px;
    grid-template-rows: 600px;

    .c-card {
      background-color: #fff;
      display: flex;
      flex-direction: column;
      height: 100%;

      &__title {
        @extend %title-style;
        flex-basis: 2rem;
        padding: 7px;
        text-align: center;
        letter-spacing: 1px;
        font-size: 1.3rem;
      }

      &__content {
        flex: 1;
        height: 100%;
      }

      &--small-half {
        height: 120px;
      }

      &--big-half {
        margin-top: 50px;
        height: calc(100% - 170px);
      }
    }
  }

  .c-history {
    
    .c-card {

      &__title {
        max-height: 2.3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      &__arrow {
        width: 2.2rem;
        height: 2.2rem;
        background-color: darken($color: $main-blue, $amount: 20%);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: #DADAE3;
      }

      &__content {
        position: relative;

        &::before {
          position: absolute;
          content: "";
          width: 1px;
          background-color: darken(#f3f3f3, 10%);
          left: $row-title-length;
          top: 0;
          bottom: 0;
        }
      }
    }
  }

  .c-row {
    display: flex;
    width: 100%;
    position: relative;
    margin-top: 2rem;

    &:first-of-type {
      margin-top: .6rem;
    }

    &__title {
      padding-left: 1rem;
      flex-basis: $row-title-length;
      max-height: 1.9rem;
    }

    &__icon {
      position: absolute;
      left: $row-title-length;
      transform: translateX(-50%);
      width: 2.2rem;
      height: 2.2rem;
      border: 1px solid $main-blue;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $main-blue;
      color: #fff;
    }

    &__content {
      margin-left: 2rem;
      padding-top: 10px;
      width: calc(100% - #{$row-title-length + 2rem});
    }
  }

  .c-vat {
    
    .c-card__content {
      display: flex;
      justify-content: flex-start;
    }

    &__item {
      flex: 1;
      text-align: center;
      padding-top: 3px;

      &:first-child {
        border-right: 1px solid $main-blue-border;
      }

      &--title {
        color: darken($color: $main-blue, $amount: 30%);
        margin-bottom: 6px;
        border-bottom: 1px solid $main-blue-border;
      }

      &--content {
        padding-bottom: 4px;
        border-bottom: 1px solid $main-blue-border;

        .c-vat__input {
          margin-right: 1rem;
          padding: 2px;
          border-radius: 10px;
          border: 1px solid $main-blue-border;
        }

        .c-vat__button {
          border-radius: 3px;
          color: #fff;
          background-color: $main-blue;
          border: none;
          padding: 3px;
          cursor: pointer;
        }
      }
    }

    &__current {
      @extend %title-style;
      letter-spacing: 1px;
      padding: 5px;
      font-size: 1.12rem;
    }
  }
</style>