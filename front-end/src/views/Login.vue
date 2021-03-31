<template>
    <div class="login-wrapper">
        <div class="header">
            <h2>Login</h2>
        </div>
        <div class="login-form">
            <div class="message">{{message}}</div>
            <form @submit.prevent="login">
                <input type="text" v-model="username" id="username" placeholder="username"/>
                <input type="password" v-model="password" id="password" placeholder="password"/>
                <input type="submit">
            </form>
            <a>forgot password</a>
        </div>
    </div>
</template>

<script>
const axios = require('axios');
const utils = require('../utils');

export default {
    name: "Login",
    data() {
        return {
            message: "",
            password: null,
            username: null
        }
    },
    methods: {
        async login() {
            try {
                await axios.post("/api/login", {
                    username: this.username,
                    password: this.password
                });
            }
            catch(err) {
                console.log(err);
            }
            
            this.$root.loggedIn = await utils.isLoggedIn();
            if(this.$root.loggedIn === true) {
                this.$router.push({ name: 'Mailbox'});
            }
            else {
                this.message = "Unable to login, try again."
            }
        }
    }
}
</script>

<style scoped>

.login-wrapper {
    padding: 35px;
    text-align: center;
}

.login-form {
    margin-top: 25px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login-form form {
    display: flex;
    flex-direction: column;
    max-width: 200px;
    width: 100%;
}

input {
    margin: 4px;
    font-family: inherit;
    padding: 8px;
    outline: none;
    flex: 1;
}

</style>