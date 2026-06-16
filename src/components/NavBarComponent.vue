<template>
  <div>
    <nav id="nav">
      <router-link to="/" id="logo-url">
        <img src="/img/logo_aroma.svg" id="logo" />
      </router-link>
      <router-link to="/">Home</router-link> |
      <router-link to="/menu">Menu</router-link> |
      <router-link to="/pedidos">Pedidos</router-link>
    </nav>
  </div>
</template>
<script>
export default {
  name: "NavBarComponent",
};
</script>
<style scoped>
#logo {
  width: 60px;
  height: 60px;
}

#logo:hover {
  width: 70px;
  height: 70px;
  rotate: 360deg;
  transition: 0.2s;
}

#nav #logo-url {
  margin: auto;
  margin-left: 0;
}

#nav {
  background-color: #3e2723;
  border-bottom: #b07d4f 4px solid;
  padding: 15px 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

#nav a {
  color: #e0b88a;
  text-decoration: none;
  margin-left: 20px;
  font-size: 18px;
}

#nav a:hover {
  color: white;
  font-size: 22px;
  transition: 0.2s;
}
</style>
