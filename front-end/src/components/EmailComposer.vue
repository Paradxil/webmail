<template>
    <div class="composer-wrapper">
        <div class="header">
            <div class="input-wrapper">
                <label>from:</label>
                <select v-model="fromaddress">
                    <option v-for="address in fromAddresses" :key="address">{{address}}</option>
                </select>
                <button @click="sendEmail()">Send<icon-base class="icon" name="send"/></button>
            </div>
            <div class="input-wrapper">
                <label>to:</label>
                <input type="text" v-model="toaddress" id="toaddress"/>
            </div>
            <div class="input-wrapper subject">
                <input type="text" v-model="emailSubject" id="subject" placeholder="subject"/>
            </div>
        </div>
        <div class="editor-wrapper">
            <div id="editor">
            </div>
        </div>
    </div>
</template>

<script>
const Quill = require('quill');
const axios = require('axios');

export default {
    props: {
        to: String,
        from: String,
        subject: String
    },
    data() {
        return {
            editor: null,
            fromAddresses: [],
            accounts: {},
            fromaddress: this.from||null,
            emailSubject: this.subject||"",
            toaddress: this.to||null
        }
    },
    async created() {
        await this.getFromAddresses();
        console.log(this.fromaddress);
    },
    methods: {
        async getFromAddresses() {
            let result = await axios.get('/api/accounts');
            let accounts = result.data;

            for(let account of accounts) {
                this.fromAddresses.push(account.email);
                this.accounts[account.email] = account;
            }
        },
        async sendEmail() {
            let result = await axios.post('/api/send', {
                text: this.editor.getText(),
                html: this.editor.root.innerHTML,
                subject: this.emailSubject,
                to: this.toaddress,
                from: this.accounts[this.fromaddress]._id
            });
            if(result.status === 200) {
                this.resetForm();
            }
        },
        resetForm() {
            this.fromaddress = null;
            this.emailSubject = null;
            this.toaddress = null;
            this.editor.setText("");
        }
    },
    mounted() {
        var toolbarOptions = [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'align': [] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        //['blockquote', 'code-block'],

        //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        //[{ 'direction': 'rtl' }],                         // text direction
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

        ['clean']                                         // remove formatting button
        ];
        this.editor = new Quill('#editor', {
            modules: { toolbar: toolbarOptions },
            theme: 'snow'
        });
    }
}
</script>

<style scoped>
.editor-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    width: 100%;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.15);
}

#editor {
    flex: 1;
}

.header {
    padding: 16px 0px;
    width: 100%;
    max-width: 1000px;
}

input, select, button {
    margin: 4px;
    font-family: inherit;
    outline: none;
    flex: 1;
    width: 100%;
    padding: 8px;
    border: none;
    border-bottom: 1px solid var(--accent-2);
}

input:focus, select:focus {
    border-bottom: 1px solid var(--accent-1);
}

button {
    max-width: 150px;
    border-radius: 4px;
    display: flex;
    place-content: center;
    align-items: center;
    background-color: var(--background-3);
    color: var(--font-2);
    transition: 0.25s background-color;
    cursor: pointer;
}

button:hover {
    background-color: var(--background-2);
}

button:active {
    opacity: 0.85;
}

.icon {
    margin-left: 5px;
}

.input-wrapper {
    display:flex;
    align-items: center;
    padding: 0px 8px;
}

.input-wrapper label {
    padding: 0px 8px;
}

.subject, .subject input {
    font-size: 20px;
}
</style>