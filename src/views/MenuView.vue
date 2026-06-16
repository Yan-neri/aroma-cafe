<template>
  <div>
    <h1>Menu</h1>
    <div id="scroll-horizontal">
      <div id="card-content" v-for="cafe in listaMenuCafes" :key="cafe.id">
        <div id="card-linha">
          <div class="foto-cafe">
            <img :src="cafe.foto" alt="nome do café" />
            <div class="card-coluna">
              <p id="nome-content">{{ cafe.nome }}</p>
              <p id="preco-content">R$ {{ cafe.valor }},00</p>
              <p id="descricao-content">{{ cafe.descricao }}</p>
              <button @click="selecionarCafe(cafe)">Selecionar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MenuView",
  data() {
    return {
      listaMenuCafes: [],
    };
  },
  methods: {
    async consultarMenu() {
      const response = await fetch(`${this.$apiUrl}/menu`);
      const dados = await response.json();
      this.listaMenuCafes = dados.cafes;
    },
    selecionarCafe(cafeSelecionado) {
      const param = JSON.stringify(cafeSelecionado);
      const cafeJson = encodeURIComponent(param);
      this.$router.push({ path: "/config", query: { cafe: cafeJson } });
    },
  },
  mounted() {
    this.consultarMenu();
  },
};
</script>
<style scoped>
#card-content {
  display: inline-block;
  width: 280px;
  min-height: 500px;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 15px;
  box-shadow: 0 4px 8px #444;
  position: relative;
  overflow: hidden;
}

#scroll-horizontal {
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
  width: 700px;
  margin: 0 auto;
  box-shadow: inset -10px 0px 15px -15px grey;
}

.foto-cafe img {
  width: 100%;
  object-fit: cover;
  max-height: 200px;
  border-radius: 10px 0 0;
}

#nome-content {
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  margin: 12px;
}

#preco-content {
  font-size: 35px;
  text-align: center;
  font-weight: bold;
  color: green;
  margin: 16px;
}

#descricao-content {
  font-size: 16px;
  text-align: left;
  color: gray;
  margin: 16px;
  white-space: pre-line;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

.card-coluna button {
  margin-top: auto;
  padding: 10px;
  background-color: #b07d4f;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  width: 80%;
  margin: 20px;
  cursor: pointer;
  transition: 0.5s;
}

.card-coluna button:hover {
  background-color: transparent;
  color: #3e2723;
  border-radius: 8px;
  border: solid 1px #b07d4f;
}
</style>
