<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { createApp } from "vue";
// import VueBarcode from "@chenfengyuan/vue-barcode";
const app = createApp({});
// app.component(VueBarcode.name, VueBarcode);
export default defineComponent({
  name: "App",
  components: {},
});
</script>
