<template>
    <div class="login-wrapper">
        <div class="header">
            <h2>Register</h2>
        </div>
        <div class="register-form">
            <div class="message">{{message}}</div>
            <form @submit.prevent="register">
                <input type="text" v-model="username" id="username" placeholder="username"/>
                <input type="text" v-model="recoveryEmail" id="recovery" placeholder="recovery email"/>
                <input type="password" v-model="password" id="password" placeholder="password"/>
                <div class="icon-captcha"></div>
                <input type="submit" value="Register">
            </form>
        </div>
    </div>
</template>

<script>
const utils = require('../utils');

export default {
    name: "Register",
    data() {
        return {
            password: null,
            recoveryEmail: null,
            username: null,
            message: null
        }
    },
    mounted() {
        if(window.loadCaptcha)
            window.loadCaptcha();
    },
    methods: {
        async register() {
            let response = await utils.post("/api/register", {
                username: this.username,
                email: this.recoveryEmail,
                password: this.password,
                captchaid: window.getCaptchaID()
            });

            if(response.success) {
                this.$router.push({ name: 'Login'});
            }
            else {
                this.message = "Unable to register, try again."
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
}

input {
    margin: 4px;
    font-family: inherit;
    padding: 8px;
    outline: none;
    flex: 1;
}

</style>