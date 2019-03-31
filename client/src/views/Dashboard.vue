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
          <div class="c-card__title">history</div>
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
          <div class="c-card__title">vat</div>
          <div class="c-card__content">content</div>
        </div>
        <div class="c-card c-card--big-half c-document">
          <div class="c-card__title">documents</div>
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
        flex-basis: 2rem;
        color: #fff;
        background-color: lighten($color: $main-blue, $amount: 8%);
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
        height: 100px;
      }

      &--big-half {
        margin-top: 70px;
        height: calc(100% - 170px);
      }
    }
  }

  .c-history {
    .c-card__content {
      position: relative;
    }

    .c-card__content::before {
      position: absolute;
      content: "";
      width: 1px;
      background-color: darken(#f3f3f3, 10%);
      left: $row-title-length;
      top: 0;
      bottom: 0;
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

</style>