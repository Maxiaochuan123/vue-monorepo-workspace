<script setup lang="ts">
const router = useRouter()

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
</script>

<template>
  <div class="px-4 bg-gray-50 flex flex-col min-h-screen items-center justify-center dark:bg-gray-950">
    <div class="i-carbon-warning-alt text-6xl text-orange-500 mb-6 animate-bounce" />

    <h1 class="text-3xl text-gray-900 font-bold mb-2 dark:text-white">
      404 Not Found
    </h1>

    <p class="text-gray-500 mb-8 text-center max-w-xs dark:text-gray-400">
      Oops! The page you are looking for doesn't exist or has been moved.
    </p>

    <button
      class="text-white font-medium px-6 py-2.5 rounded-xl bg-indigo-500 shadow-indigo-500/30 shadow-lg transition-transform hover:bg-indigo-600 active:scale-95"
      @click="onBack"
    >
      Go Back Home
    </button>
  </div>
</template>

<route lang="json5">
{
  name: '404'
}
</route>
