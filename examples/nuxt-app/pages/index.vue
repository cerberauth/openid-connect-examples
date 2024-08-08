<script setup>
const { loggedIn, user, session, fetch, clear } = useUserSession()
</script>

<template>
  <div class="bg-slate-100 min-h-screen">
    <main role="main"
      class="flex flex-col items-center justify-center h-5/6 space-y-8 text-center px-4 py-16 lg:pt-32 md:pt-16 sm:pt-8">
      <h1 class="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:max-w-[43.5rem]">
        Nuxt Application Example using OpenID Connect
      </h1>
      <p class="mt-4 max-w-lg text-lg text-slate-700">
        This example demonstrates how to authenticate users in a Nuxt Application using OpenID Connect Protocol.
      </p>
      <Button v-if="loggedIn" @click="clear">
        Logout
      </Button>
      <Button v-else>
        <a href="/auth/testid">
          Login with TestID
        </a>
      </Button>
      <p class="mt-4 max-w-lg text-slate-700">
        If you want to checkout out how to implement OpenID Connect in your Nuxt Application, take a look at the <a
          class="text-indigo-600"
          href="https://github.com/cerberauth/openid-connect-examples/tree/main/examples/nuxt-app">source code</a>.
      </p>
    </main>

    <footer class="text-center py-4">
      <p class="text-sm text-gray-500">
        Proudly part of <a class="text-indigo-600" href="https://www.cerberauth.com">CerberAuth</a> community.
      </p>
    </footer>
  </div>
</template>