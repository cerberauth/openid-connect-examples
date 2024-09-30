<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth } from '@/lib/auth'

const { handleLoginRedirect } = useAuth()

onMounted(async () => {
  try {
    await handleLoginRedirect()
  } catch (error) {
    console.error('OIDC callback error:', error)
  }
})
</script>

<template>
  <RouterView />
</template>
