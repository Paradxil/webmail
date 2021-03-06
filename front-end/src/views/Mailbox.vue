<template>
    <div id="mailbox-wrapper">
        <div id="sidebar-wrapper">
            <div class="sidebar" :class="{'collapsed':collapsed,'shown':!collapsed}" > 
                <div class="sidebar-section accounts-list" v-for="account in accountsList" :key="account.account._id">
                    <div class="sidebar-section-header" :class="{'current':currentAccountID === account.account._id}">
                        <p>{{account.account.email}}</p>
                    </div>
                    <div class="sidebar-item" v-for="folder in account.account.folders" :class="{'current':currentFolder===folder&&currentAccountID===account.account._id}" :key="folder.path" @click="selectFolder(folder, account.account._id)">
                        <div class="folder-item">
                            <p class="folder-icon"><icon-base :name="folderIcons[folder.use]"/></p>
                            <p>{{folder.nicename}}</p>
                            <p class="folder-unread-count" title="Number of unread emails">{{unreadCounts[folder.path+account.account._id]>0?unreadCounts[folder.path+account.account._id]:''}}</p>
                        </div>
                    </div>
                </div>
                <div class="sidebar-item no-accounts" v-if="accountsList === null || Object.keys(accountsList).length === 0" @click="addNewAccount()">
                    <p>No accounts found.</p>
                    <p>Click to add a new account.</p>
                </div>
            </div>
            <div class="sidebar narrow" @click="toggleSidebar()">
                <div class="sidebar-item tall">
                    <icon-base :name="collapsed?'chevron-right':'chevron-left'"/>
                </div>
            </div>
            <div class="sidebar secondary">
                <div class="sidebar-section sidebar-header">
                    <div class="sidebar-item email-search">
                       <icon-base name="search" />
                       <input type="text" />
                    </div>
                </div>
                <div class="sidebar-section sidebar-loading">
                    <div class="sidebar-item" v-if="!ready">
                        <Loading />
                    </div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-item email-preview" :class="{'current':currentEmail!==null&&currentEmail.uid===email.uid}" v-for="email of Object.values(currentEmails).reverse()" :key="email._id" @click="selectEmail(email)">
                        <div class="email-controls">
                            <div class="starred" :title="email.flags.includes('Starred')?'Starred':'Star email'" @click.stop="email.flags.includes('Starred')?unmarkStarred(currentAccountID, currentFolder.path, email):markStarred(currentAccountID, currentFolder.path, email)">
                                <icon-base class="starred-icon" :class="{'filled':email.flags.includes('Starred')}" name="star"/>
                            </div>
                            <div class="unread" title="Unread" v-if="!email.flags.includes('\\Seen')">
                                <icon-base class="unread-icon" name="circle"/>
                            </div>
                        </div>
                        <div class="email-from"><p>{{email.from.name||email.from.address}}</p></div>
                        <div class="email-subject"><p>{{email.subject}}</p></div>
                        <div class="email-date"><date-view :date="new Date(email.date)" time/></div>
                        <div class="email-message-preview"><p>{{getMessagePreview(email)}}</p></div>
                    </div>
                    <div class="empty-folder sidebar-item" v-if="currentFolder !== null && Object.values(currentEmails).length === 0 && this.ready"> 
                        <p>This folder is empty.</p>
                    </div>
                    <div class="empty-folder sidebar-item" v-if="currentFolder === null"> 
                        <p>No folder selected.</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="pane" v-if="currentEmail !== null">
            <div class="controls">
                <div class="control" title="Close Email" @click="closeCurrentEmail()">
                    <icon-base name="x-square" />
                </div>
            </div>
            <div class="message-wrapper">
                <div class="message-header" v-if="currentEmail!==null">
                    <div class="message-details">
                        <div class="header-subject"><p>{{currentEmail.subject}}</p></div>
                        <div class="header-from"><p>{{currentEmail.from.name}} - {{currentEmail.from.address}} </p></div>
                        <div class="header-date"><date-view :date="new Date(currentEmail.date)"/></div>
                    </div>
                    <div class="message-controls controls">
                        <div class="control" title="Reply" @click="replyToEmail()">
                            <icon-base name="corner-up-left" />
                        </div>
                        <div class="control" title="Delete (permanent)" @click="deleteEmail()">
                            <icon-base name="trash-2"/>
                        </div>
                    </div>
                </div>
                <div class="no-accounts sidebar-item" v-if="accountsList === null || Object.keys(accountsList).length === 0" @click="addNewAccount()">
                    <h2><p>Welcome to Webmailer!</p></h2>
                    <p>It looks like you haven't set up any email accounts yet.</p>
                    <p>Click here to link your first account.</p>
                </div>
                <iframe id="iframe" :src="currentMessage" sandbox="allow-same-origin" @load="iframeLoaded" />
            </div>
        </div>
    </div>
</template>

<script>
const utils = require('../utils');
import DateView from '../components/DateView.vue';
import Loading from '../components/Loading.vue';

export default {
    name: "Mailbox",
    components: {
        DateView,
        Loading
    },
    data() {
        return {
            //currentEmails: [],
            currentMessage: null,
            currentEmail: null,
            iframeHeight: "100px",
            accountsList: {
                
            },
            currentAccountID: null,
            currentFolder: null,
            ready: false,
            loading: false,
            collapsed: true,
            timer: null,
            folderIcons: {
                "" : "chevron-right",
                "\\Inbox": "inbox",
                "\\Spam": "alert-circle",
                "\\Junk": "alert-circle",
                "\\Drafts": "edit-2",
                "\\Trash": "trash",
                "\\Sent": "send"
            },
            unreadCounts: {

            }
        }
    },
    async created() {
        if(window.screen.availWidth > 600) {
            this.collapsed = false;
        }

        //Get mail without syncing.
        //This will download mail already synced to the server and should be fast.
        this.loading = true;

        await this.getAll();

        //Now sync mail, this takes much longer but the user can already see previously synced mail.
        await this.getAll(true);

        //Stop showing the loading message.
        this.ready = true;

        //Check and sync mail once per minute.
        this.timer = setInterval(()=>{
            if(!this.loading) {
                this.loading = true;
                this.getAll(true);
            }
        }, 1000 * 60);

    },
    beforeDestroy() {
        clearInterval(this.timer);  
    },
    methods: {
        async getAll(sync = false) {
            await this.getAccounts();
            for(let accountid in this.accountsList) {
                let account = this.accountsList[accountid].account;
                if(sync) {
                    await this.syncMail(account._id);
                }
                for(let folder of account.folders) {
                    await this.getMail(folder.path, account._id);  
                    await this.getFolderStatus(account._id, folder.path);
                }
            }
            this.loading = false;
        },
        async getAccounts() {
            let result = await utils.get("api/accounts");

            if(!result.success) {
                return;
            }

            for(let account of result.data) {
                if(!this.accountsList[account._id]) {
                    this.$set(this.accountsList, account._id, {});
                }

                this.sortFolders(account.folders);

                this.$set(this.accountsList[account._id], 'account', account);

                if(!this.accountsList[account._id].emails) {
                    this.$set(this.accountsList[account._id], 'emails', {});

                    for(let folder of account.folders) {
                        this.$set(this.accountsList[account._id].emails, folder.path, []);
                    }
                }
            }
        },
        async syncMail(accountid=null) {
            try {
                await utils.post("/api/sync", {
                    accountid: accountid||this.currentAccountID
                });
            } catch (error) {
                console.log(error);
            }
        },
        async getMail(folderPath=null, accountid=null) {
            if(this.currentFolder === null && folderPath === null) {
                return;
            }

            try {
                folderPath = folderPath||this.currentFolder.path;

                let response = await utils.post("/api/mail", {
                    id: (accountid||this.currentAccountID),
                    folder: folderPath
                });

                if(!response.success) {
                    return;
                }

                this.$set(this.accountsList[(accountid||this.currentAccountID)].emails, folderPath, response.data);
            } catch (err) {
                console.log(err);
            }
        },
        async getFolderStatus(accountid, folderPath) {
            try {
                let response = await utils.post("/api/account/status", {
                    accountid: accountid,
                    folder: folderPath
                });

                if(response.success) {
                    this.unreadCounts[folderPath+accountid] = response.data.unseen;
                }
            }
            catch(err) {
                console.log(err);
            }
        },
        getMessagePreview(email) {
            return email.message?email.message.substr(0,150):"";
        },
        selectEmail(email) {
            const blob = new Blob([email.html], { type:'text/html' });
            this.currentMessage = URL.createObjectURL(blob);
            this.currentEmail = email;
            let iframe = document.querySelector("#iframe");
            iframe.style.height = 0;

            if(!email.flags.includes('\\Seen')) {
                this.markSeen(this.currentAccountID, this.currentFolder.path, this.currentEmail);
            }
        },
        iframeLoaded() {
            let iframe = document.querySelector("#iframe");
            iframe.style.height = (iframe.contentWindow.document.body.scrollHeight + 100) + 'px';
        },
        async selectFolder(folder, id) {
            if(window.screen.availWidth <= 600) {
                this.toggleSidebar();
            }
            this.currentAccountID = id;
            //this.currentEmails = this.accountsList[this.currentAccountID].emails[folder];
            this.currentFolder = folder;
        },
        addNewAccount() {
            this.$router.push({ name: 'Settings', params: { page:2}});
        },
        replyToEmail() {
            this.$router.push({ 
                name: 'Compose', params: { 
                    to:this.currentEmail.from.address, 
                    from:this.accountsList[this.currentAccountID].account.email,
                    subject: this.currentEmail.subject
                }
            });
        },
        closeCurrentEmail() {
            this.currentEmail = null;
        },
        toggleSidebar() {
            this.collapsed = !this.collapsed;
        },
        async deleteEmail() {
            try {
                let response = await utils.post("/api/mail/delete", {
                        uid: this.currentEmail._id,
                        accountid: this.currentAccountID,
                        folder: this.currentFolder
                    });

                if(response.success) {
                    //Remove from list without a request
                    this.currentEmail = null;
                    await this.getAll();
                }

            } catch (error) {
                console.log(error);
            }
        },
        sortFolders(folders) {
            folders.sort((a,b) => {
                if (a.path < b.path)
                    return -1;
                if (a.path > b.path)
                    return 1;
                return 0;
            });
        },
        async markStarred(accountid, folder, email) {
            await this.addFlags(accountid, folder, email, ['Starred']); //Flags without a leading backslash are only saved to the database cache and not to the IMAP server.
        },
        async unmarkStarred(accountid, folder, email) {
            await this.removeFlags(accountid, folder, email, ['Starred']); //Flags without a leading backslash are only saved to the database cache and not to the IMAP server.
        },
        async markSeen(accountid, folder, email) {
            this.unreadCounts[folder+accountid] -= 1;
            await this.addFlags(accountid, folder, email, ['\\Seen']);
        },
        async addFlags(accountid, folder, email, flags) {
            let response = await utils.post("/api/mail/flag", {
                accountid: accountid,
                folder: folder,
                uid: email.uid,
                flags: flags
            });

            if(!response.success) {
                console.log(response.data);
            }
            else {
                this.accountsList[this.currentAccountID].emails[this.currentFolder.path][email.uid].flags = email.flags.concat(flags);
            }
        },
        async removeFlags(accountid, folder, email, flags) {
            let response = await utils.post("/api/mail/flag/remove", {
                accountid: accountid,
                folder: folder,
                uid: email.uid,
                flags: flags
            });

            if(!response.success) {
                console.log(response.data);
            }
            else {
                for(let flag of flags) {
                    let i = email.flags.indexOf(flag);

                    if(i > -1) {
                        email.flags.splice(i, 1);
                    }
                }

                this.accountsList[this.currentAccountID].emails[this.currentFolder.path][email.uid].flags = email.flags;
            }
        }
    },
    computed: {
        currentEmails() {
            if(!this.currentAccountID||!this.currentFolder) {
                return [];
            }
            return this.accountsList[this.currentAccountID].emails[this.currentFolder.path];
        }
    }
}
</script>

<style scoped>
#mailbox-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
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

.sidebar.collapsed {
    width: 0px;
}

.sidebar.narrow {
    width: initial;
    min-width: 32px;
    background-color: var(--accent-1);
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

.sidebar-item.tall {
    height: 100%;
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

.starred-icon{
    opacity: 0;
    transition: 0.25s opacity;
}

.sidebar-item:hover .starred-icon {
    opacity: 1;
}

.starred .filled {
    fill: var(--accent-4) !important;
    color: var(--accent-4);
    opacity: 1;
}

.unread {
    color: var(--accent-4);
}

.unread-icon {
    fill: var(--accent-4) !important;
}

.email-controls {
    position: absolute;
    text-align: right;
    top:0px;
    left: 0px;
    width: 100%;
    padding: 8px;
    font-size: 14px;
    display: flex;
    align-items: center;
    place-content: flex-end;
}

.email-controls > div {
    padding: 5px;
}

.email-preview {
    padding: 16px;
    cursor: pointer;
    position: relative;
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

.no-accounts {
    cursor: pointer;
}

.folder-item {
    display: flex;
    align-items: center;
}

.folder-icon {
    margin-right: 16px;
    text-align: right;
    display: flex;
    align-items: center;
}

.folder-unread-count {
    flex: 1;
    text-align: right;
}

#pane {
    background-color: #fff;
    flex: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.message-header {
    display: flex;
}

.controls {
    font-size: 18px;
    display: flex;
    padding: 8px;
    place-content: flex-start;
    align-items: center;
    width: 100%;
}

.message-controls {
    height: 100%;
    width: initial;
    place-content: flex-end;
    align-items: center;
}

.control {
    padding: 8px;
    display: flex;
    place-content: center;
    align-items: center;
    border-radius: 4px;;
}

.control:hover {
    background-color: var(--accent-2);
}

.message-wrapper {
    background-color: #fff;
    padding: 8px 32px;
    width: 100%;
}

.message-details {
    flex: 1;
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

@media screen and (max-width: 600px) {
    .sidebar.shown {
        width: 100%;
        top:0px;
        left:0px;
        height: 100%;
        z-index: 100;
    }

    .sidebar.secondary {
        flex: 1;
        position: absolute;
        width: calc(100% - 32px);
        top: 0px;
        left: 32px;
        z-index: -1;
        height: 100%;
    }
}

@media screen and (max-width: 1200px) {
    #pane {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 50;
        width: 100%;
        height: 100%;
    }

    .sidebar.secondary  {
        flex: 1;
    }

    #sidebar-wrapper {
        width: 100%;
    }

    .message-wrapper {
        padding: 8px 16px;
    }
}

</style>
