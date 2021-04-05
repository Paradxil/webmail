<template>
  <div class="home">
    <div class='header'>
      <h1>Webmail</h1>
    </div>
    <div class="container">
      <div class="features">
        <div class="feature">
          <div class="icon">
            <icon-base name="plus-square"/>
          </div>
          <div class="description">
            Connect multiple email accounts.
          </div>
        </div>
        <div class="feature">
          <div class="icon">
            <icon-base name="book-open"/>
          </div>
          <div class="description">
            Check your email on the go.
          </div>
        </div>
        <div class="feature">
          <div class="icon">
            <icon-base name="sliders"/>
          </div>
          <div class="description">
            Intuitive interface.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home'
}
</script>

<style scoped>

.home {
  background-color: var(--background-2);
  color: var(--font-2);
  flex: 1;
}

.header {
  width: 100%;
  text-align: center;
  padding: 150px 0px;
  background-color: var(--accent-2);
  margin-bottom: 20px;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 70%;
  max-width: 300px;
}

.features {
  display: flex;
  flex-wrap: wrap;
}

.feature .icon {
  font-size: 40px;
  padding: 20px;
  color: var(--background-1);
}

.icon svg {
    color: var(--accent-4);
}

.feature {
  padding: 45px;
  flex: 1;
  flex-basis: auto;
  text-align: center;
  font-size: 18px;
  margin: 10px;
  border-radius: 4px;
}
</style>
