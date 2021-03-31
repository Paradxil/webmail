<template>
    <div class="account-settings-wrapper">
        <div class="sidebar-wrapper">
            <div class="sidebar">
                <div class="sidebar-item" :class="{'current':selectedItem==='newAccount'}" @click="selectItem('newAccount')">
                    <p>Add New Account</p>
                </div>
                <div class="sidebar-item" :class="{'current':selectedItem===account._id}" v-for="account in accountsList" :key="account._id" @click="selectItem(account._id)">
                    <p>{{account.user}}</p>
                </div>
            </div>
        </div>
        <div class="content-wrapper">
            <h2>Email Account Settings</h2>
            <div class="imap-form" @submit.prevent="addAccount">
                <form>
                    <input type="text" v-model="currentAccount.email" placeholder="email">
                    <input type="text" v-model="currentAccount.host" placeholder="host">
                    <input type="number" v-model="currentAccount.port" placeholder="port">
                    <div class="control-wrapper">
                        <label>Secure: </label>
                        <input type="checkbox" v-model="currentAccount.secure" placeholder="secure">
                    </div>
                    <input type="text" v-model="currentAccount.user" placeholder="username" :disabled="!currentAccount.secure">
                    <input type="password" v-model="currentAccount.password" placeholder="password" :disabled="!currentAccount.secure">
                    <input type="submit" value="Add Account">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
const axios = require('axios');

export default {
    name: "AccountSettings",
    data() {
        return {
            selectedItem: "newAccount",
            currentAccount: {},
            accountsList: {}
        }
    },
    async created() {
        await this.getAccounts();
    },
    methods: {
        async getAccounts() {
            let result = await axios.get("api/accounts");
            this.accountsList = {};
            for(let account of result.data) {
                this.accountsList[account._id] = account;
            }
        },
        addAccount() {
            axios.post("/api/account", this.currentAccount);
        },
        selectItem(item) {
            this.selectedItem = item;
            if(item !== "newAccount") {
                this.currentAccount = this.accountsList[item];
            }
            else {
                this.currentAccount = {};
            }
        }
    }
}
</script>

<style scoped>

h2 {
    font-weight: normal;
}

.account-settings-wrapper {
    width: 100%;
    display: flex;
    flex: 1;
    overflow:hidden;
    height: 100%;
}

.sidebar-wrapper {
    display: flex;
    flex: 1 10%;
    box-shadow: 0px 0px 15px rgb(0 0 0 / 10%);
    z-index: 10;
    position: sticky;
    top: 0px;
    left: 0px;
    user-select: none;
}

.sidebar {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    position: relative;
}

.sidebar-item {
    padding: 8px 5px;
}

.current {
    background-color: aliceblue !important;
}

.sidebar-item:hover{
    background-color: #fafafa;
}

.content-wrapper {
    flex: 9;
    padding: 32px;
}

.imap-form {
    margin-top: 25px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.imap-form form {
    display: flex;
    flex-direction: column;
    max-width: 200px;
    width: 100%;
}

input, .control-wrapper{
    margin: 4px;
    font-family: inherit;
    padding: 8px;
    outline: none;
    flex: 1;
}

.control-wrapper {
    flex: 1;
    width: 100%;
    text-align: left;
}
</style>