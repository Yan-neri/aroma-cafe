<template>
  <div id="main-banner">
    <img id="banner-img" src="/img/banner.svg" alt="banner" />
    <h1>Seu café do jeitinho que você gosta</h1>
  </div>
</template>
<script>
export default {
  name: "BannerComponent",
};
</script>
<style scoped>
#main-banner {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
}
#banner-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
#main-banner h1 {
  font-size: 40px;
  color: antiquewhite;
  background: #3e2723;
  padding: 25px;
  border-radius: 100px 0px 0px 100px;
}
</style>
