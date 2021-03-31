<template>
    <div class="login-wrapper">
        <div class="header">
            <h2>Register</h2>
        </div>
        <div class="register-form">
            <form @submit.prevent="register">
                <input type="text" v-model="username" id="username" placeholder="username"/>
                <input type="password" v-model="password" id="password" placeholder="password"/>
                <input type="submit" value="Register">
            </form>
        </div>
    </div>
</template>

<script>
const axios = require('axios');

export default {
    name: "Register",
    data() {
        return {
            password: null,
            username: null
        }
    },
    methods: {
        async register() {
            await axios.post("/api/register", {
                username: this.username,
                password: this.password
            });
        }
    }
}
</script>

<style scoped>

.login-wrapper {
    padding: 35px;
    text-align: center;
}

.register-form {
    margin-top: 25px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.register-form form {
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