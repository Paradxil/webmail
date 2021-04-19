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
                <div class="icon-captcha"></div>
                <input type="submit" value="Login">
            </form>
            <a>forgot password</a>
        </div>
    </div>
</template>

<script>
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
    mounted() {
        if(window.loadCaptcha)
            window.loadCaptcha();
    },
    methods: {
        async login() {
            try {
                let response = await utils.post("/api/login", {
                    captchaid: window.getCaptchaID(),
                    username: this.username,
                    password: this.password
                });

                if(response.success) {
                    this.$root.user = response.data.user;
                    this.$root.loggedIn = true;
                    this.$router.push({ name: 'Mailbox'});
                }
                else {
                    this.message = response.message;
                }
            }
            catch(err) {
                console.log(err);
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