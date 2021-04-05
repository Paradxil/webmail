<template>
    <div class="account-settings-wrapper">
        <div class="sidebar-wrapper">
            <div class="sidebar">
                <div class="sidebar-item" :class="{'current':selectedItem==='newAccount'}" @click="selectItem('newAccount')">
                    <p>Add New Account</p>
                </div>
                <div class="sidebar-item" :class="{'current':selectedItem===account._id}" v-for="account in accountsList" :key="account._id" @click="selectItem(account._id)">
                    <p>{{account.name||account.email}}</p>
                </div>
            </div>
        </div>
        <div class="content-wrapper">
            <h2>Email Account Settings</h2>
            <div class="imap-form" @submit.prevent="">
                <form>
                    <input type="text" v-model="currentAccount.name" placeholder="name">
                    <input type="text" v-model="currentAccount.email" placeholder="email">
                    <div class="form-sections">
                        <div class="form-section">
                            <label>IMAP</label>
                            <input type="text" v-model="currentAccount.imap.host" placeholder="host">
                            <input type="number" v-model="currentAccount.imap.port" placeholder="port">
                            <div class="control-wrapper">
                                <label>Secure: </label>
                                <input type="checkbox" v-model="currentAccount.imap.secure" placeholder="secure">
                            </div>
                            <input type="text" v-model="currentAccount.imap.user" placeholder="username">
                            <input type="password" v-model="currentAccount.imap.password" placeholder="password">
                        </div>
                        <div class="form-section">
                            <label>SMTP</label>
                            <input type="text" v-model="currentAccount.smtp.host" placeholder="host">
                            <input type="number" v-model="currentAccount.smtp.port" placeholder="port">
                            <div class="control-wrapper">
                                <label>Secure: </label>
                                <input type="checkbox" v-model="currentAccount.smtp.secure" placeholder="secure">
                            </div>
                            <input type="text" v-model="currentAccount.smtp.user" placeholder="username">
                            <input type="password" v-model="currentAccount.smtp.password" placeholder="password">
                        </div>
                    </div>
                    <input type="submit" v-if="buttonState === 0" value="Add Account" @click="addAccount">
                    <input type="submit" v-if="buttonState !== 0" value="Update Account" @click="updateAccount">
                    <input type="submit" v-if="buttonState !== 0" value="Delete Account" @click="deleteAccount">
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
            buttonText: ["Add Account", "Update Account"],
            buttonState: 0,
            currentAccount: {
                email: null,
                name: null,
                imap: {},
                smtp: {}
            },
            accountsList: {}
        }
    },
    async created() {
        await this.getAccounts();
    },
    methods: {
        async getAccounts() {
            let result = await axios.get("/api/accounts");
            this.accountsList = {};
            for(let account of result.data) {
                this.accountsList[account._id] = account;
            }
        },
        async updateAccount() {
            await axios.post("/api/account/update", this.currentAccount);
            await this.getAccounts();
        },
        async addAccount() {
            let result = await axios.post("/api/account", this.currentAccount);
            if(result.status === 200) {
                this.selectItem("newAccount");
            }
            await this.getAccounts();
        },
        async deleteAccount() {
            let result = await axios.delete("/api/account/" + this.currentAccount._id);
            if(result.status === 200) {
                this.selectItem("newAccount");
            }
            await this.getAccounts();
        },
        selectItem(item) {
            this.selectedItem = item;
            if(item !== "newAccount") {
                this.currentAccount = this.accountsList[item];
                this.buttonState = 1;
            }
            else {
                this.buttonState = 0;
                this.currentAccount = {
                    email: null,
                    name: null,
                    imap: {},
                    smtp: {}
                };
            }
        }
    }
}
</script>

<style scoped>

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
    width: 100%;
}

.form-sections {
    margin-top: 10px;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
}

.form-section {
    flex: 1;
    display: flex;
    flex-direction: column;
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