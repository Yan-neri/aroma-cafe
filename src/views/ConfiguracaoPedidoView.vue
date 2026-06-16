<template>
  <div>
    <h1>Monte seu pedido</h1>
    <pedido-component-vue :cafe="this.cafeSelecionado" />
  </div>
</template>
<script>
import PedidoComponentVue from "@/components/PedidoComponent.vue";
export default {
  name: "ConfiguracaoPedidoView",
  components: {
    PedidoComponentVue,
  },
  data() {
    return {
      cafeSelecionado: null,
    };
  },
  mounted() {
    const query = this.$route.query;
    if (query.cafe) {
      const decodeCafe = JSON.parse(decodeURIComponent(query.cafe));
      this.cafeSelecionado = decodeCafe;
    }
  },
};
</script>
<style scoped></style>
