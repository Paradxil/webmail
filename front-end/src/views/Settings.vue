<template>
    <div class="settings-wrapper">
        <div class="sidebar-wrapper">
            <div class="sidebar">
                <div class="sidebar-item" v-for="item of settings" :class="{'current':current===item}" :key="item" @click="selectItem(item)">
                    <p>{{item}}</p>
                </div>
            </div>
        </div>
        <div class="content-wrapper">
            <component :is="settingsComponent"></component>
        </div>
    </div>
</template>

<script>
const GeneralSettings = () => import("../components/GeneralSettings");
const AccountSettings = () => import("../components/AccountSettings");
const AppearanceSettings = () => import("../components/AppearanceSettings");

export default {
    name: "Settings",
    data() {
        return {
            current: "General",
            settings: ["General", "Appearance", "Email Accounts"]
        }
    },
    methods: {
        selectItem(item) {
            this.current = item;
        }
    },
    computed: {
        settingsComponent() {
            switch(this.current) {
                case this.settings[0]:
                    return GeneralSettings
                case this.settings[1]:
                    return AppearanceSettings
                case this.settings[2]:
                    return AccountSettings
                default:
                    return GeneralSettings
            }
        }
    }
}
</script>

<style scoped>
.settings-wrapper {
    text-align: center;
    width: 100%;
    display: flex;
    flex: 1;
    overflow:hidden;
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
}
</style>