<template>
  <div id="app">
    <div id="nav" :key="$root.loggedIn">
      <router-link class="logo" :to="$root.loggedIn?'/mailbox':'/'"><img src="./assets/logo2.png"/></router-link>
      <router-link v-if="$root.loggedIn" to="/mailbox">Mailbox<icon-base class="icon" name="mail"/></router-link>
      <router-link v-if="$root.loggedIn" to="/compose">Compose<icon-base class="icon" name="edit-2"/></router-link>
      <div class="nav-spacer"></div>
      <router-link v-if="$root.loggedIn" to="/settings" title="Settings"><icon-base name="settings"/></router-link>
      <router-link v-if="!$root.loggedIn" to="/login">Login</router-link>
      <router-link v-if="!$root.loggedIn" to="/register">Register</router-link>
      <router-link v-if="$root.loggedIn" to="/logout" title="Logout"><icon-base name="log-out"/></router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loggedin: false
    }
  }
}
</script>

<style>
:root {
  /*https://coolors.co/ffcdb2-ffb4a2-e5989b-b5838d-6d6875*/
  --background-1: #fff;
  --background-2: #6d6875;
  --background-3: #b5838d;
  --font-1: #333;
  --font-2: #fff;
  --accent-1: #b5838d;
  --accent-2: rgba(0,0,0,0.1);
  --accent-3: rgba(255,255,255,1);
  --accent-4: #FFB4A2;
}

* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
}

#app {
  font-family: 'Dosis', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #222;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  min-height: 100vh;
}

#nav {
  background-color: var(--background-2);
  color: var(--font-2);
  z-index: 30;
  display: flex;
  align-items: center;
  padding: 10px;
}

#nav a {
  color: var(--font-2);
  text-decoration: none;
  margin-right: 5px;
  padding: 6px 10px;
  border-radius: 3px;
  display: flex;
  align-items: center;
}

#nav a .icon {
  margin-left: 5px;
}

#nav a:hover {
  background-color: var(--accent-2);
}

#nav a.router-link-exact-active {
  color: var(--accent-1);
  background-color: var(--accent-3);
}

.logo {
  background-color: initial !important;
  margin-right: 10px;
}

.logo img{
  max-height: 40px;
}

.nav-spacer {
  flex: 1;
}

h1, h2, h3, h4 {
  font-weight: 200;
}

h1 {
  font-size: 42px;
}

img {
  max-width: 100%;
}

</style>
