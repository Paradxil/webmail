<template>
    <div class="composer-wrapper">
        <email-composer/>
    </div>
</template>

<script>
import EmailComposer from '../components/EmailComposer.vue'

export default {
    name:"Compose",
    components: { EmailComposer },
}
</script>

<style scoped>

.composer-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
</style>