<template>
  <div class="container">
    <div class="container__top">
      <p class="container__menu">
        <router-link to="/">Home</router-link>
        <router-link to="/homework">Homework</router-link>
        <router-link to="/matching-blocks">Matching Blocks</router-link>
      </p>
    </div>
    <div class="container__content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import MatchingBlocks from "@/components/scripts_works/MatchingBlocks.vue";

export default defineComponent({
  components: {MatchingBlocks}
});
</script>

<style scoped lang="stylus">
.container
  display flex
  flex-direction column
  gap 20px

  &__top
    width 100%
    height 100px

  &__content
    width 100%
    height calc(100vh - 100px - 20px)

  &__menu
    display flex
    gap 16px
    justify-content center
</style>
