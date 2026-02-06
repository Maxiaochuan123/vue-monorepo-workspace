<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const title = computed(() => {
  return (route.name as string) || 'My App'
})

function onBack() {
  if (window.history.state.back) {
    history.back()
  }
  else {
    router.replace('/')
  }
}
</script>

<template>
  <VanNavBar
    :title="title"
    :fixed="true"
    :left-arrow="true"
    placeholder clickable
    @click-left="onBack"
  />
</template>
