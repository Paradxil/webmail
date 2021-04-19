<template>
    <div>
        <p>{{message}}</p>
    </div>
</template>

<script>
const utils = require('../utils');

export default {
    name: "Logout",
    data() {
        return {
            message: "Logging out...",
            maxAttempts: 10,
            attempts: 0
        }
    },
    async created() {
        await this.logout();
    },
    methods: {
        async logout() {
            let response = await utils.post("/api/logout");

            if(response.sucess) {
                this.$root.loggedin = false;
                this.$router.push({ name: 'Home'});
            }
            else {
                //Try to logout again.
                if(this.attempts < this.maxAttempts) {
                    this.attempts += 1;
                    this.logout();
                }
                this.message = "Unable to logout, try reloading the page."
            }
        }
    }
}
</script>