<template>
    <div id="mailbox-wrapper">
        <div id="sidebar-wrapper">
            <div class="sidebar">
                <div class="sidebar-section accounts-list" v-for="account in accountsList" :key="account._id">
                    <div class="sidebar-section-header" :class="{'current':currentAccountID===account._id}">
                        <p>{{account.user}}</p>
                    </div>
                    <div class="sidebar-item" v-for="folder in account.folders" :class="{'current':currentFolder===folder&&currentAccountID===account._id}" :key="folder" @click="selectFolder(folder, account._id)">
                        <p>{{folder}}</p>
                    </div>
                </div>
            </div>
            <div class="sidebar secondary">
                <div class="sidebar-section sidebar-header">
                    <div class="sidebar-item email-search">
                       <icon-base name="search" />
                       <input type="text" />
                    </div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-item email-preview" :class="{'current':currentEmail!==null&&currentEmail.uid===email.uid}" v-for="email of currentEmails" :key="email._id" @click="selectEmail(email)">
                        <div class="email-from"><p>{{email.from.name}}</p></div>
                        <div class="email-subject"><p>{{email.subject}}</p></div>
                        <div class="email-date"><date-view :date="new Date(email.date)" time/></div>
                        <div class="email-message-preview"><p>{{getMessagePreview(email)}}</p></div>
                    </div>
                    <div class="empty-folder sidebar-item" v-if="currentEmails===null || currentEmails.length === 0"> 
                        <p>This folder is empty</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="pane">
            <div class="message-wrapper">
                <div class="message-header" v-if="currentEmail!==null">
                    <div class="header-subject"><p>{{currentEmail.subject}}</p></div>
                    <div class="header-from"><p>{{currentEmail.from.name}} - {{currentEmail.from.address}} </p></div>
                    <div class="header-date"><date-view :date="new Date(currentEmail.date)"/></div>
                </div>
                <iframe id="iframe" :src="currentMessage" sandbox="allow-same-origin" @load="iframeLoaded" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import DateView from '../components/DateView.vue';

export default {
    name: "Mailbox",
    components: {
        DateView
    },
    data() {
        return {
            currentEmails: [],
            currentMessage: "No message selected.",
            currentEmail: null,
            iframeHeight: "100px",
            accountsList: {},
            currentAccountID: null,
            currentFolder: null
        }
    },
    async created() {
        const blob = new Blob([""], { type:'text/html' });
        this.currentMessage = URL.createObjectURL(blob);
        await this.getAll();
        this.getAll(true);
    },
    methods: {
        async getAll(sync = false) {
            await this.getAccounts();
            for(let accountid in this.accountsList) {
                let account = this.accountsList[accountid];
                if(sync) {
                    await this.syncMail(account._id);
                }
                for(let folder of account.folders) {
                    this.getMail(folder, account._id);  
                }
            }
        },
        async getAccounts() {
            let result = await axios.get("api/accounts");
            this.accountsList = {};
            for(let account of result.data) {
                this.accountsList[account._id] = account;
                this.accountsList[account._id].emails = {};
            }
        },
        async syncMail(accountid=null) {
            try {
                await axios.post("/api/sync", {
                    accountid: accountid||this.currentAccountID
                });
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        async getMail(folder=null, accountid=null) {
            if(this.currentFolder === null && folder === null) {
                return;
            }

            try {
                let response = await axios.post("/api/mail", {
                    id: (accountid||this.currentAccountID),
                    folder: (folder||this.currentFolder)
                });
                this.accountsList[(accountid||this.currentAccountID)].emails[folder] = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        getMessagePreview(email) {
            return email.message.substr(0,150);
        },
        selectEmail(email) {
            const blob = new Blob([email.html], { type:'text/html' });
            this.currentMessage = URL.createObjectURL(blob);
            this.currentEmail = email;
            let iframe = document.querySelector("#iframe");
            iframe.style.height = 0;
        },
        iframeLoaded() {
            let iframe = document.querySelector("#iframe");
            iframe.style.height = (iframe.contentWindow.document.body.scrollHeight + 25) + 'px';
        },
        async selectFolder(folder, id) {
            this.currentAccountID = id;
            this.currentEmails = this.accountsList[this.currentAccountID].emails[folder];
            this.currentFolder = folder;
        }
    }
}
</script>

<style scoped>
#mailbox-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;
}

#sidebar-wrapper {
    display: flex;
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
    width: 250px;
    overflow-y: auto;
    position: relative;
    overflow-x: hidden;
    background-color: var(--background-2);
    color: var(--font-2);
}

.sidebar.secondary {
    background-color: var(--background-1);
    color: var(--font-1);
    border-left: 1px solid #f1f1f1;
    width: 350px;
}

.sidebar-section {
    border-bottom: 1px solid #f1f1f1;
}

.sidebar-item {
    text-align: center;
    padding: 8px 5px;
}

.current {
    background-color: var(--accent-2) !important;
}


.sidebar-item:hover{
    background-color: var(--accent-2);
}

.accounts-list .sidebar-item, .accounts-list .sidebar-section-header {
    text-align: left;
    padding: 8px 16px;
}

.email-preview {
    padding: 16px;
    cursor: pointer;
}

.email-preview p {
    text-align: left;
}

.email-from {
    font-size: 14px;
}

.email-subject {
    color: var(--accent-1);
}

.email-subject, .email-message-preview, .email-date {
   font-size: 12px;
}

.email-message-preview {
    opacity: 0.75;
    white-space: nowrap;
    overflow: hidden;
}

.sidebar-header {
    position: sticky;
    top:0px;
    left: 0px;
    z-index: 10;
    background-color: #fff;
}

.email-search {
    background-color: #fff !important;
    display: flex;
    align-items: center;
    padding: 8px 16px;
}

.email-search input {
    font-family: inherit;
    border: none;
    outline: none;
    flex: 1;
    padding: 8px;
    margin-left: 6px;
}

#pane {
    background-color: #fff;
    flex: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.message-wrapper {
    background-color: #fff;
    padding: 32px;
    width: 100%;
}

.message-header {
    width: 100%;
    text-align: left;
    color: #000;
    padding-bottom: 16px;
}

.header-subject {
    font-size: 18px;
}

.header-date, .header-from {
    font-weight: 200;
}

#iframe {
    width: 100%;
    border: none;
    height: 100%;
}

/* width */
::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #fff;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #aaa;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #888;
}

</style>