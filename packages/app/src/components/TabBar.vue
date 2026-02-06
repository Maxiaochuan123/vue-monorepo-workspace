<script setup lang="ts">
const active = ref(0)
</script>

<template>
  <van-tabbar v-model="active" route placeholder>
    <van-tabbar-item replace to="/">
      home
      <template #icon>
        <div class="i-carbon:home" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/profile">
      profile
      <template #icon>
        <div class="i-carbon:user" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
