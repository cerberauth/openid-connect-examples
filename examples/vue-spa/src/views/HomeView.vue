<script setup lang="ts">
import { useAuth } from '@/lib/auth'

const { isAuthenticated, login, logout } = useAuth()
</script>

<template>
  <div class="bg-slate-100 min-h-screen">
    <main role="main"
      class="flex flex-col items-center justify-center h-5/6 space-y-8 text-center px-4 py-16 lg:pt-32 md:pt-16 sm:pt-8">
      <h1 class="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:max-w-[43.5rem]">
        Vue.js Application Example using OpenID Connect
      </h1>
      <p class="mt-4 max-w-lg text-lg text-slate-700">
        This example demonstrates how to authenticate users in a Vue Application using OpenID Connect Protocol.
      </p>
      <button class="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700" v-if="isAuthenticated" @click="logout">
        Logout
      </button>
      <button class="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700" v-else @click="login">
        Login with TestID
      </button>
      <p class="mt-4 max-w-lg text-slate-700">
        If you want to checkout out how to implement OpenID Connect in your Vue Application, take a look at the <a
          class="text-indigo-600"
          href="https://github.com/cerberauth/openid-connect-examples/tree/main/examples/vue-app">source code</a>.
      </p>
    </main>

    <footer class="text-center py-4">
      <p class="text-sm text-gray-500">
        Proudly part of <a class="text-indigo-600" href="https://www.cerberauth.com">CerberAuth</a> community.
      </p>
    </footer>
  </div>
</template>
