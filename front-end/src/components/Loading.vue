<template>
    <div class="loading-wrapper">
        <div class="loading">
            <div class="loading-icon">
                <IconBase name="loader"/>
            </div>
            <p>loading...</p>
        </div>
    </div>
</template>

<style scoped>

.loading {
    display: flex;
    place-content: center;
    align-items: center;
}

.loading > * {
    padding: 5px;
}

.loading-icon svg {
    display: flex;
    place-content: center;
    align-items: center;
    animation-name: loading;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

@keyframes loading {
    0% {transform: rotate(0deg);}
    100% {transform: rotate(360deg);}
}

</style>