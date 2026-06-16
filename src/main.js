import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);


app.config.globalProperties.$apiUrl = process.env.VUE_APP_API_BASE_URL;

app.use(router).mount("#app");
